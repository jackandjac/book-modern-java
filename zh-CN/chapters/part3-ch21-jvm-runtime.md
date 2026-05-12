# 第21章：Java 25 中的 JVM 与运行时改进

Java 25 带来了重要的 JVM 层面改进：紧凑对象头（Compact Object Headers）减少了所有 Java 程序的内存使用，分代 Shenandoah（Generational Shenandoah）成为生产就绪的垃圾收集器（GC），向量 API（Vector API）进入了第10次孵化且已接近最终品质，JFR 新增了 CPU 时间分析和方法追踪功能，稳定值（Stable Values）提供了一种新的 JVM 优化的延迟初始化常量模式。

---

## 21.1 紧凑对象头（JEP 519 — 在 Java 25 中正式发布）

每个 Java 对象都携带一个**对象头（header）**——存储在对象字段之前的 JVM 元数据。在 64 位 JVM 上，该对象头传统上为 96–128 位（12–16 字节），包含：
- **标记字（mark word）**（64 位）：GC 状态、身份哈希码（identity hashcode）、锁状态
- **类指针（class pointer）**（32–64 位）：指向类元数据的引用

JEP 519 通过将类指针压缩到标记字的未使用位中，将对象头缩减至 **64 位**。这需要在 `-XX:+UseCompressedClassPointers` 基础上进行更深层次的 64 位类指针压缩。

### 启用紧凑对象头

```bash
# Opt-in flag (not default in Java 25)
java -XX:+UseCompactObjectHeaders -jar myapp.jar

# Combined with other GC and heap flags
java -XX:+UseZGC -XX:+ZGenerational \
     -XX:+UseCompactObjectHeaders \
     -Xmx8g \
     -jar myapp.jar
```

### 内存节省

```java
// Measure header size savings with JOL (Java Object Layout)
// Add jol-core dependency to your project:
// <dependency>
//   <groupId>org.openjdk.jol</groupId>
//   <artifactId>jol-core</artifactId>
//   <version>0.17</version>
// </dependency>

import org.openjdk.jol.info.ClassLayout;
import org.openjdk.jol.vm.VM;

public class HeaderSizeDemo {
    record Point(double x, double y) {}

    public static void main(String[] args) {
        System.out.println(VM.current().details());
        System.out.println(ClassLayout.parseClass(Point.class).toPrintable());

        // Without compact headers: 16 bytes header + 16 bytes fields = 32 bytes
        // With compact headers: 8 bytes header + 16 bytes fields = 24 bytes
        // Savings: 25% per Point object
    }
}
```

### 实际影响

内存节省在以下场景中最为显著：
- 拥有大量小对象的应用程序（大量小型 record、POJO）
- 集合密集型代码（具有大量 Entry 对象的 HashMap）
- 包含中间对象的流式数据处理管道

典型基准测试显示，对象密集型工作负载可减少 10–20% 的堆内存占用，这直接转化为更少的 GC 暂停和更好的缓存利用率。

### 兼容性

紧凑对象头要求所有运行中的代码与压缩类指针方案兼容。直接操作对象头的代码（例如通过 `sun.misc.Unsafe.objectFieldOffset()`）可能会出现问题。行为规范的 Java 代码——即不使用 JVM 内部 API 的代码——不受影响。

---

## 21.2 分代 Shenandoah（在 Java 25 中正式发布）

Shenandoah GC 自 Java 12 起作为并发、低暂停收集器（concurrent, low-pause collector）可用。Java 25 正式发布了在 Java 24 中实验性引入的**分代 Shenandoah（Generational Shenandoah）**模式。

### Shenandoah 与 ZGC 对比

两者都以超低暂停时间（<1ms）为目标。主要区别如下：

| 特性 | Shenandoah | ZGC（分代模式） |
|---------|------------|-------------------|
| 实现方式 | Brooks 转发指针（forwarding pointers） | 加载屏障（load barriers） |
| 并发压缩 | 是 | 是 |
| 分代模式（Java 25） | 是（已正式发布） | 是（在 Java 21 中正式发布） |
| 最佳堆大小 | 1GB–256GB | 1GB–16TB |
| CPU 开销 | 中等 | 中高 |
| 可用平台 | 大多数平台 | 大多数平台 |

### 启用分代 Shenandoah

```bash
# Java 25: enable Shenandoah with generational mode (now final)
java -XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational -jar myapp.jar

# Combined with heap sizing
java -XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational \
     -Xms4g -Xmx16g \
     -jar myapp.jar
```

### 何时选择分代 Shenandoah

在以下情况下，优先选择分代 Shenandoah 而非非分代 Shenandoah：
- 应用程序具有较高的内存分配速率（大量短生命周期对象）
- 在中等大小的堆（4–128GB）上需要一致的低延迟
- 希望获得比非分代 Shenandoah 更低的 CPU 开销

---

## 21.3 向量 API（JEP 508 — 在 Java 25 中第10次孵化）

向量 API（Vector API）支持从 Java 执行 **SIMD（单指令多数据，Single Instruction, Multiple Data）**操作——利用 CPU 向量单元（SSE、AVX、NEON）对多个数据元素同时执行相同操作。

经过10轮孵化，该 API 已经成熟且具备生产级品质，尽管仍标注为"孵化器（incubator）"。之所以保持孵化状态，是因为它有待 Valhalla 项目（Project Valhalla）的值类型（value types）支持，届时可实现更高效的向量元素表示。

### 基本 SIMD 操作

```java
import jdk.incubator.vector.*;

public class VectorDemo {
    static final VectorSpecies<Float> FLOAT_SPECIES = FloatVector.SPECIES_256;
    // SPECIES_256 = 256-bit wide vectors = 8 floats per vector on AVX2

    // Scalar (traditional) float array sum
    static float scalarSum(float[] a) {
        float sum = 0;
        for (float v : a) sum += v;
        return sum;
    }

    // Vectorized float array sum — typically 4-8x faster
    static float vectorSum(float[] a) {
        int i = 0;
        float sum = 0;
        int bound = FLOAT_SPECIES.loopBound(a.length);

        // Process 8 elements at a time
        var sumVec = FloatVector.zero(FLOAT_SPECIES);
        for (; i < bound; i += FLOAT_SPECIES.length()) {
            var v = FloatVector.fromArray(FLOAT_SPECIES, a, i);
            sumVec = sumVec.add(v);
        }
        sum = sumVec.reduceLanes(VectorOperators.ADD);

        // Handle remaining elements (tail)
        for (; i < a.length; i++) {
            sum += a[i];
        }
        return sum;
    }
}
```

### 点积——关键的机器学习推理操作

```java
// Dot product: sum of element-wise products
// Critical for neural network inference
static float dotProduct(float[] a, float[] b) {
    assert a.length == b.length;
    int i = 0;
    int bound = FLOAT_SPECIES.loopBound(a.length);
    var accum = FloatVector.zero(FLOAT_SPECIES);

    for (; i < bound; i += FLOAT_SPECIES.length()) {
        var va = FloatVector.fromArray(FLOAT_SPECIES, a, i);
        var vb = FloatVector.fromArray(FLOAT_SPECIES, b, i);
        accum = va.fma(vb, accum);   // fma = fused multiply-add: accum += va * vb
    }

    float result = accum.reduceLanes(VectorOperators.ADD);

    // Tail
    for (; i < a.length; i++) {
        result += a[i] * b[i];
    }
    return result;
}
```

### 逐元素操作

```java
// Apply ReLU activation function: max(0, x)
static float[] relu(float[] input) {
    float[] output = new float[input.length];
    var zero = FloatVector.zero(FLOAT_SPECIES);
    int i = 0;
    int bound = FLOAT_SPECIES.loopBound(input.length);

    for (; i < bound; i += FLOAT_SPECIES.length()) {
        var v = FloatVector.fromArray(FLOAT_SPECIES, input, i);
        v.max(zero).intoArray(output, i);
    }
    for (; i < input.length; i++) {
        output[i] = Math.max(0, input[i]);
    }
    return output;
}
```

### 在构建中使用向量 API

```xml
<!-- Maven: add incubator module to compilation and runtime -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <compilerArgs>
            <arg>--add-modules=jdk.incubator.vector</arg>
        </compilerArgs>
    </configuration>
</plugin>
```

```bash
# Runtime
java --add-modules=jdk.incubator.vector -jar myapp.jar
```

---

## 21.4 JFR CPU 时间分析（JEP 509 — 实验性）

JDK 飞行记录器（JDK Flight Recorder）传统上使用挂钟时间（wall-clock time）进行性能分析。JEP 509 在 Linux 上新增了 **CPU 时间分析（CPU-time profiling）**——区分线程在 CPU 上执行的时间与等待的时间。

```bash
# Enable CPU-time profiling (Linux only, experimental)
java -XX:StartFlightRecording=filename=profile.jfr,cpuTime=true \
     -jar myapp.jar

# After application runs, analyze with JDK Mission Control or jfr tool
jfr print --events jdk.ExecutionSample profile.jfr
```

CPU 时间分析在以下场景中尤为有价值：
- 识别消耗大量 CPU 的方法（相对于被频繁调用但执行很快的方法）
- 诊断服务中意外的高 CPU 使用率
- 区分 CPU 密集型与 I/O 密集型热点路径

---

## 21.5 JFR 方法计时与追踪（JEP 520）

JEP 520 通过字节码插桩（bytecode instrumentation）扩展了 JFR 的**方法级计时与追踪**能力——无需使用 Java Agent：

```bash
# Instrument specific methods for timing via command line
java -XX:StartFlightRecording=filename=trace.jfr \
     -XX:FlightRecorderMethodSampleInterval=10ms \
     -jar myapp.jar
```

在代码中，可以通过注解标记方法以生成 JFR 事件：

```java
import jdk.jfr.Event;
import jdk.jfr.Label;
import jdk.jfr.Description;

@Label("Order Processing")
@Description("Tracks order processing latency")
class OrderProcessingEvent extends Event {
    @Label("Order ID")
    String orderId;

    @Label("Item Count")
    int itemCount;
}

public class OrderService {
    public Order processOrder(String orderId, List<OrderItem> items) {
        var event = new OrderProcessingEvent();
        event.begin();  // start timing
        event.orderId   = orderId;
        event.itemCount = items.size();

        try {
            return doProcessOrder(orderId, items);
        } finally {
            event.commit();  // end timing and record event
        }
    }
}
```

---

## 21.6 稳定值（JEP 502 — 在 Java 25 中预览）

`StableValue<T>` 是一个新的 JVM 原语，用于**延迟初始化的、事实上不可变的值**。JVM 可以在稳定值被设置后将其视为 JIT 常量——从而实现积极的常量折叠（constant-folding）优化，这是普通的 `volatile` 字段或 `AtomicReference` 无法做到的。

```java
import java.lang.StableValue;

// Traditional lazy initialization: volatile + double-checked locking
private volatile ExpensiveSingleton instance;
public ExpensiveSingleton getInstance() {
    if (instance == null) {
        synchronized (this) {
            if (instance == null) {
                instance = new ExpensiveSingleton();
            }
        }
    }
    return instance;
}

// With StableValue: simpler and JVM-optimizable
private final StableValue<ExpensiveSingleton> stableInstance =
    StableValue.of();

public ExpensiveSingleton getInstance() {
    return stableInstance.orElseSet(ExpensiveSingleton::new);
}
```

### 在静态上下文中使用 StableValue

```java
// Per-class configuration — initialized once, read-only thereafter
public class AppConfig {
    private static final StableValue<DatabaseConfig> DB_CONFIG = StableValue.of();
    private static final StableValue<CacheConfig>    CACHE_CONFIG = StableValue.of();

    public static void initialize(Properties props) {
        DB_CONFIG.set(DatabaseConfig.from(props));
        CACHE_CONFIG.set(CacheConfig.from(props));
    }

    public static DatabaseConfig db() { return DB_CONFIG.get(); }
    public static CacheConfig cache() { return CACHE_CONFIG.get(); }
}
```

JVM 能够识别出 `StableValue` 在首次写入后即表现为常量——读取稳定值的方法调用可以被内联和优化，如同该值是编译时常量一样。这与 `static final` 字段具有相同的优化级别，但支持延迟初始化。

---

## 21.7 移除 32 位 x86 支持（JEP 526）

Java 25 移除了对 32 位 x86（Windows 和 Linux）的所有构建支持和相关代码。这仅影响：
- 在 32 位 Windows 或 Linux 上运行 OpenJDK 的开发者（在生产环境中基本不存在）
- 以 32 位 JVM 为目标的构建配置

所有现代生产系统都运行 64 位 JVM。绝大多数 Java 部署无需采取任何操作。

---

## 21.8 Java 25 完整 JEP 汇总

| JEP | 特性 | 状态 | 分类 |
|-----|---------|--------|----------|
| 502 | 稳定值（Stable Values） | 预览 | 语言/JVM |
| 505 | 结构化并发（Structured Concurrency） | 第5次预览 | 并发 |
| 506 | 作用域值（Scoped Values） | **正式发布** | 并发 |
| 507 | 模式中的原始类型（Primitive Types in Patterns） | 第3次预览 | 语言 |
| 508 | 向量 API（Vector API） | 第10次孵化 | 性能 |
| 509 | JFR CPU 时间分析 | 实验性 | 可观测性 |
| 510 | 密钥派生函数 API（Key Derivation Function API） | **正式发布** | 安全 |
| 511 | 模块导入声明（Module Import Declarations） | **正式发布** | 语言 |
| 512 | 紧凑源文件与实例主方法（Compact Source Files & Instance Main Methods） | **正式发布** | 语言 |
| 519 | 紧凑对象头（Compact Object Headers） | **正式发布** | JVM |
| 520 | JFR 方法计时与追踪 | **正式发布** | 可观测性 |
| 470 | PEM 编码（PEM Encodings） | 预览 | 安全 |
| 492 | 灵活的构造函数体（Flexible Constructor Bodies） | **正式发布** | 语言 |
| Gen-Shenandoah | 分代 Shenandoah | **正式发布** | GC |
| 526 | 移除 32 位 x86 支持 | 移除 | 平台 |

---

## 21.9 未来展望：Java 26 及更远

Java 26（2026年3月）已经到来。关键主题包括：

- **Valhalla 项目准备工作**：JEP 500（空值受限的值类类型，Null-Restricted Value Class Types）和 JEP 529（值对象，Value Objects）正在为值类型（value types）奠定基础——这是自泛型（generics）以来 Java 最重要的变革
- **结构化并发（Structured Concurrency）**：继续朝着正式发布的方向推进
- **字符串模板（String Templates）**：重新设计的 API 预计将再次进入预览

**Valhalla 项目**——长达十年之久的将值类型引入 Java 的努力——将提供定义"实例行为类似原始类型"的类的能力：无标识（no identity）、不可为空（no nullability）、可内联到数组和对象中。这将消除包装类型的开销（不再需要 `Integer[]` 装箱），实现密集的数组布局，并解锁对 SIMD 友好的数据结构。

---

## 21.10 总结

Java 25 的 JVM 改进：

- **紧凑对象头**：每个对象的头部大小减少 25–30%——通过 `-XX:+UseCompactObjectHeaders` 选择启用
- **分代 Shenandoah**：支持分代收集的低延迟 GC——已正式发布并可用于生产
- **向量 API**（第10次孵化）：面向高性能计算（HPC）和机器学习推理工作负载的 SIMD 操作
- **JFR CPU 时间分析**：区分 CPU 密集型与 I/O 密集型热点
- **JFR 方法追踪**：无需 Agent 即可对生产环境中的方法进行插桩分析
- **稳定值**：JVM 优化的延迟初始化——将延迟设置的值视为 JIT 常量

Java 25 作为长期支持（LTS）版本，为未来数年的 Java 应用提供了稳定、优化的基础。
