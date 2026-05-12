# 第6章：Java 17 的其他特性——伪随机数生成器、强封装与废弃项

Java 17 带来的不仅仅是记录类（Records）、密封类（Sealed Classes）和模式匹配（Pattern Matching）这些备受瞩目的语言特性。本章涵盖了那些重要但较少被关注的改进：随机数 API 的全面重构、JDK 强封装（Strong Encapsulation）的最终确定、浮点运算（Floating-Point）一致性、增强的反序列化（Deserialization）安全性，以及每位工程师在迁移前都必须了解的一系列废弃和移除项。

---

## 6.1 增强的伪随机数生成器（JEP 356）

Java 17 之前的随机数生成方案是碎片化且不一致的。你有 `java.util.Random`、`java.util.concurrent.ThreadLocalRandom`、`java.util.SplittableRandom` 和 `java.security.SecureRandom`——四个类具有重叠但不兼容的 API，没有公共接口，也无法编写跨越它们的通用代码。

JEP 356 围绕全新的 **`RandomGenerator` 接口层次结构** 对此进行了彻底重构。

### 新的接口层次结构

```
RandomGenerator
├── StreamableGenerator      — 可以生成生成器流
│   ├── SplittableGenerator  — split() 创建独立的子生成器
│   ├── JumpableGenerator    — jump() 以大步长推进状态
│   └── LeapableGenerator    — leap() 以超大步长推进状态
└── (所有新的算法类直接实现 RandomGenerator)
```

### RandomGenerator 接口

```java
import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

// 基于接口编写算法无关的代码
public class MonteCarloSimulation {
    private final RandomGenerator rng;

    public MonteCarloSimulation(RandomGenerator rng) {
        this.rng = rng;
    }

    public double estimatePi(int samples) {
        long inside = 0;
        for (int i = 0; i < samples; i++) {
            double x = rng.nextDouble();
            double y = rng.nextDouble();
            if (x * x + y * y <= 1.0) inside++;
        }
        return 4.0 * inside / samples;
    }
}
```

### 使用工厂选择算法

```java
import java.util.random.RandomGeneratorFactory;

// 列出所有可用算法
RandomGeneratorFactory.all()
    .sorted(Comparator.comparing(RandomGeneratorFactory::name))
    .forEach(f -> System.out.printf("%-30s stateBits=%-5d isJumpable=%-5b isSplittable=%b%n",
        f.name(), f.stateBits(), f.isJumpable(), f.isSplittable()));

// 通过算法名称创建
RandomGenerator xoshiro = RandomGeneratorFactory.of("Xoshiro256PlusPlus").create();
RandomGenerator lxm     = RandomGeneratorFactory.of("L64X256MixRandom").create();
RandomGenerator legacy  = RandomGeneratorFactory.of("Random").create();

// 使用特定种子创建以确保可重复性
RandomGenerator seeded = RandomGeneratorFactory.of("Xoshiro256PlusPlus").create(42L);
```

### LXM 生成器——新的默认高质量选择

LXM 生成器（L64X128MixRandom、L64X256MixRandom、L128X256MixRandom 等）将线性同余生成器（Linear Congruential Generator, LCG）与 XBG 生成器（基于 XorShift）以及混合函数相结合。它们提供了出色的统计质量，是模拟、游戏以及任何非密码学用途的推荐选择：

```java
import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

RandomGenerator rng = RandomGeneratorFactory.of("L64X256MixRandom").create();

// 所有熟悉的操作，外加新增的操作
int    roll  = rng.nextInt(1, 7);     // [1, 6] 闭区间——比 nextInt(6)+1 更简洁
double prob  = rng.nextDouble(0, 1);  // [0.0, 1.0)
long   token = rng.nextLong();

// 新增：内置指数分布和高斯分布
double exp   = rng.nextExponential();   // 均值 = 1
double gauss = rng.nextGaussian(5, 2);  // 均值=5, 标准差=2 (Java 17+)
```

### 用于并行流的 SplittableGenerator

`SplittableGenerator` 是安全进行并行随机数生成的关键。每次 `split()` 都会创建一个完全独立的生成器，保证产生统计独立的序列：

```java
import java.util.random.RandomGenerator.SplittableGenerator;
import java.util.random.RandomGeneratorFactory;

SplittableGenerator splittable =
    (SplittableGenerator) RandomGeneratorFactory.of("L64X256MixRandom").create(12345L);

// 并行蒙特卡洛：每个线程获得自己独立的生成器
double pi = splittable.splits(8)         // 8 个独立的生成器
    .parallel()
    .mapToDouble(gen -> {
        long inside = 0;
        for (int i = 0; i < 1_000_000; i++) {
            double x = gen.nextDouble();
            double y = gen.nextDouble();
            if (x * x + y * y <= 1.0) inside++;
        }
        return (double) inside / 1_000_000;
    })
    .average()
    .orElseThrow() * 4.0;

System.out.printf("π ≈ %.6f%n", pi);
```

### 用于独立序列的 JumpableGenerator

```java
import java.util.random.RandomGenerator.JumpableGenerator;

JumpableGenerator jumpable =
    (JumpableGenerator) RandomGeneratorFactory.of("Xoshiro256PlusPlus").create();

// 每次 jump() 创建一个前进了 2^128 步的副本——保证不重叠
JumpableGenerator thread1Gen = jumpable;
JumpableGenerator thread2Gen = (JumpableGenerator) jumpable.jump();
JumpableGenerator thread3Gen = (JumpableGenerator) jumpable.jump();
// thread1Gen、thread2Gen、thread3Gen 产生的序列永远不会重叠
// （每个序列长度为 2^128 个值，对任何模拟来说都绰绰有余）
```

### 实际迁移

```java
// 旧代码——在使用旧 API 的任何地方
Random old = new Random(seed);
int n = old.nextInt(100);

// 新代码——基于接口，算法灵活可切换
RandomGenerator rng = RandomGeneratorFactory.of("L64X256MixRandom").create(seed);
int n2 = rng.nextInt(100);  // 相同语义，更好的统计特性

// 关于线程安全（以前用 ThreadLocalRandom）：
// ThreadLocalRandom 对于单线程使用场景仍然适用
// 对于并行场景，优先使用 SplittableGenerator 的 splits()
```

---

## 6.2 JDK 内部 API 的强封装（JEP 403）

对于现有代码库而言，JEP 403 可以说是 Java 17 中最具破坏性的变更。它最终确定了自 Java 9 模块系统（Module System）以来开始的 JDK 内部 API 封装工作。

### 发生了什么变化

在 Java 17 之前，`--illegal-access` 标志允许通过反射访问 JDK 内部 API。在 Java 16 中，`--illegal-access=deny` 成为默认值，但仍可被覆盖。在 Java 17 中，**`--illegal-access` 被完全移除**。尝试通过反射访问 JDK 内部 API 现在会无条件抛出 `InaccessibleObjectException`。

常见的故障点：

```java
// 以下代码在 Java 17 之前使用 --illegal-access=permit 时可以工作：
// sun.misc.Unsafe, com.sun.xml.internal.*, sun.reflect.* 等

// 这些被广泛使用于：
// - 进行底层内存操作的库（Unsafe）
// - 序列化框架（Kryo、FST）
// - Mock 框架（Mockito 早期版本）
// - 依赖注入容器（旧版本的 Spring/Guice）
// - 某些 XML/JSON 解析器
```

### 迁移桥梁：`--add-opens` 和 `--add-exports`

如果你正在迁移的代码库依赖于尚无法消除的内部 API，请使用以下 JVM 标志：

```bash
# --add-opens：允许对某个包进行深度反射访问
java --add-opens java.base/java.lang=ALL-UNNAMED \
     --add-opens java.base/java.util=ALL-UNNAMED \
     --add-opens java.base/sun.nio.ch=ALL-UNNAMED \
     -jar myapp.jar

# --add-exports：使某个包的公共 API 可见（用于编译时）
javac --add-exports java.base/sun.security.util=ALL-UNNAMED MyClass.java
```

在 Maven 中：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.2.5</version>
    <configuration>
        <argLine>
            --add-opens java.base/java.lang=ALL-UNNAMED
            --add-opens java.base/java.util=ALL-UNNAMED
        </argLine>
    </configuration>
</plugin>
```

### 长期策略

`--add-opens` 是一个**迁移桥梁，而非永久解决方案**。正确的解决方式是：

1. 找出哪个库触发了这些访问（查看堆栈跟踪）
2. 更新库——大多数主流库（Spring、Hibernate、Mockito、Jackson）都有兼容 Java 17 的版本
3. 如果是你自己的代码，请从内部 API 迁移到公共 API：
   - `sun.misc.Unsafe` → `java.lang.foreign.MemorySegment`（Project Panama，第13章）
   - 内部反射技巧 → `java.lang.invoke.MethodHandles`
   - `sun.security.*` → 标准的 `javax.crypto` / `java.security` API

---

## 6.3 恢复始终严格的浮点语义（JEP 306）

这个变更主要具有历史意义，但值得了解。

### 背景

在 Java 1.1 中，引入了 `strictfp` 修饰符以确保跨平台的可移植、确定性的浮点行为。如果不使用 `strictfp`，JVM 可以在 x87 浮点处理单元（FPU）上使用扩展的 80 位精度，可能在不同硬件上产生不同的结果。

随着现代 x64 和 ARM 硬件始终使用 IEEE 754-2019 的 64 位运算（JVM 不再需要对 x87 进行特殊处理），`strictfp` 和非 `strictfp` 之间的区别变得毫无意义。**Java 17 恢复了始终严格的语义**——所有浮点运算现在始终等同于 `strictfp`。

### 影响

```java
// strictfp 现在是空操作（但不是错误——语法仍然有效，只是多余了）
public strictfp class LegacyFinancialCalculator {
    public strictfp double compute(double a, double b) {
        return a * b; // 现在无论是否有修饰符都始终是严格模式
    }
}

// 今后，直接省略 strictfp 即可
public class FinancialCalculator {
    public double compute(double a, double b) {
        return a * b; // 与 strictfp 行为相同，无需修饰符
    }
}
```

实际影响：**无需修改代码**。现有的 `strictfp` 注解是无害的。新代码不应再使用 `strictfp`。

---

## 6.4 上下文特定的反序列化过滤器（JEP 415）

Java 反序列化（Deserialization）是一个众所周知的攻击面。JEP 415 在 Java 9 引入的 JVM 全局反序列化过滤器（`-Djdk.serialFilter`）基础上，增加了一个**动态的、上下文感知的过滤器工厂**——一个在每个 `ObjectInputStream` 创建时都会被调用的 JVM 全局回调，允许你根据上下文选择过滤器。

### JEP 415 解决的问题

静态的 JVM 全局过滤器对于复杂应用来说粒度太粗。一个 Web 框架可能需要对用户提供的数据和内部集群消息应用不同的反序列化规则。JEP 415 允许你安装一个 `BinaryOperator<ObjectInputFilter>` 作为过滤器工厂：

```java
import java.io.ObjectInputFilter;

public class SecureDeserializationSetup {

    public static void install() {
        ObjectInputFilter.Config.setSerialFilterFactory(
            SecureDeserializationSetup::buildFilter);
    }

    private static ObjectInputFilter buildFilter(
            ObjectInputFilter currentFilter,
            ObjectInputFilter nextFilter) {

        // 将当前流过滤器与我们的策略组合
        ObjectInputFilter policyFilter = ObjectInputFilter.Config.createFilter(
            // 白名单：仅允许这些类
            "com.myapp.model.*;java.util.*;java.lang.*;!*"
        );

        // 链式调用：我们的策略先执行，然后是流特定的过滤器
        return ObjectInputFilter.merge(policyFilter, nextFilter);
    }
}

// 在应用启动时安装一次：
// SecureDeserializationSetup.install();
```

### 构建实用的过滤器

```java
import java.io.*;

public class ApplicationFilterFactory {

    // 不同上下文使用不同规则
    enum DeserializationContext {
        USER_INPUT,      // 严格——允许最少的类
        INTERNAL_CACHE,  // 中等——已知的内部类
        CLUSTER_MESSAGE  // 宽松——我们自己序列化的集群状态
    }

    // 基于 ThreadLocal 或参数的上下文注入
    private static final ThreadLocal<DeserializationContext> CONTEXT =
        ThreadLocal.withInitial(() -> DeserializationContext.USER_INPUT);

    public static void setContext(DeserializationContext ctx) {
        CONTEXT.set(ctx);
    }

    public static ObjectInputFilter buildContextFilter(
            ObjectInputFilter current, ObjectInputFilter next) {

        String pattern = switch (CONTEXT.get()) {
            case USER_INPUT     -> "java.lang.*;java.util.ArrayList;maxdepth=5;maxarray=1000;!*";
            case INTERNAL_CACHE -> "com.myapp.**;java.util.*;java.lang.*;maxdepth=10;!*";
            case CLUSTER_MESSAGE -> "com.myapp.cluster.**;java.util.*;java.lang.*;!*";
        };

        ObjectInputFilter contextFilter = ObjectInputFilter.Config.createFilter(pattern);
        return ObjectInputFilter.merge(contextFilter, next);
    }

    // 用法：
    public static <T> T deserialize(byte[] data, DeserializationContext context)
            throws IOException, ClassNotFoundException {
        setContext(context);
        try (var ois = new ObjectInputStream(new ByteArrayInputStream(data))) {
            @SuppressWarnings("unchecked")
            T result = (T) ois.readObject();
            return result;
        }
    }
}
```

---

## 6.5 废弃与移除

### 已移除：Applet API（JEP 398）

`java.applet` 包及相关的浏览器插件基础设施被正式标记为废弃并将被移除。自从浏览器厂商放弃 NPAPI 插件支持以来，Applet 实际上已经消亡。任何使用 `java.applet.Applet`、`java.applet.AppletContext` 等的代码都必须重写。

### 已移除：RMI 激活机制（JEP 407）

`java.rmi.activation`——用于激活休眠 RMI 服务器的子系统——已被移除。标准 RMI（`java.rmi`）仍然可用。如果你使用了 RMI 激活机制（RMI Activation），必须迁移到通过常规 RMI 存根实现的按需激活，或替换为现代的 IPC 机制（gRPC、REST、消息队列）。

### 已移除：实验性 AOT 和 JIT 编译器（JEP 410）

实验性的基于 Java 的提前编译器（Ahead-of-Time Compiler，`jaotc`）和 Graal JIT 编译器（作为替代的 JVM JIT）已被移除。原因是：维护成本超过了采用率。GraalVM 仍然作为独立发行版可用（GraalVM CE/EE），只是不再与 OpenJDK 捆绑。

```bash
# Java 17 之前：在某些 JDK 上可能可用
# jaotc --output libHelloWorld.so HelloWorld.class

# Java 17 之后：jaotc 已从标准 JDK 中移除
# 如需本地镜像：单独使用 GraalVM
# native-image -jar myapp.jar
```

### 已废弃：安全管理器（JEP 411）

安全管理器（Security Manager）——Java 原始的沙箱机制——已被标记为废弃并将被移除。多年来它作为安全工具一直存在根本性缺陷（大多数 JVM 安全研究人员都忽略它），它的存在只增加了复杂性而没有安全收益。

```java
// 在 Java 17 中仍然可以工作，但会打印废弃警告：
System.setSecurityManager(new SecurityManager());

// 警告内容：
// WARNING: A terminally deprecated method in java.lang.System has been called
// WARNING: System::setSecurityManager has been called by com.example.Main
// ...

// 未来的 Java 版本将抛出 UnsupportedOperationException
```

现代安全性通过容器、操作系统级别的沙箱和网络策略来实现——而非 Java 的安全管理器。

---

## 6.6 Java 17 升级清单

从 Java 11（或更早版本）升级到 Java 17 时：

```
☐ 审查 JVM 启动脚本中的 --illegal-access 使用情况
  → 移除 --illegal-access 标志（已不存在）
  → 为任何仍在使用的内部 API 添加 --add-opens / --add-exports

☐ 将依赖更新到兼容 Java 17 的版本：
  → Spring Boot: 3.0+（要求 Java 17）
  → Hibernate: 6.0+
  → Mockito: 4.0+
  → ByteBuddy: 1.12+
  → 依赖 Byte-Buddy 的框架（Mockito、Hibernate 代理）

☐ 测试序列化代码：
  → 确保反序列化过滤器已就位
  → 验证记录类的紧凑构造函数在反序列化时正确运行

☐ 移除 strictfp 修饰符（可选——它们无害但现在已多余）

☐ 移除安全管理器的安装代码（或制定计划——现在会产生废弃警告）

☐ 移除 RMI 激活代码（已不存在）

☐ 构建配置：
  → 在 Maven/Gradle 中将 source/target 设置为 17
  → 使用 --release 17 启用 JVM 级别的优化

☐ 逐步采用新的语言特性：
  → 记录类（Records）用于数据载体
  → 密封类（Sealed Classes）用于封闭层次结构
  → 文本块（Text Blocks）用于多行字符串
  → 在所有适用处使用 Switch 表达式（自 Java 14 起已正式发布）
```

Java 17 的 Maven 构建配置：

```xml
<properties>
    <java.version>17</java.version>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <!-- 或者，推荐方式： -->
    <maven.compiler.release>17</maven.compiler.release>
</properties>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.13.0</version>
    <configuration>
        <release>17</release>
    </configuration>
</plugin>
```

---

## 6.7 总结

Java 17 的"其他特性"填补了重要的空白：

- **增强的伪随机数生成器（JEP 356）**：统一的 `RandomGenerator` 接口取代了碎片化的随机数 API，通过工厂进行算法选择，并通过 `SplittableGenerator` 提供一流的并行支持
- **强封装（JEP 403）**：`--illegal-access` 已移除——请将内部 API 依赖迁移到公共 API 或当前版本的库
- **始终严格的浮点运算（JEP 306）**：`strictfp` 现在是空操作；所有浮点运算都普遍符合 IEEE 754 标准
- **反序列化过滤器（JEP 415）**：上下文感知的过滤器工厂支持细粒度的反序列化安全策略
- **移除/废弃**：Applet API、RMI 激活机制、实验性 AOT/JIT 已被移除；安全管理器已被废弃

总之，这些变更使 Java 17 成为多年来最安全、最一致、最现代化的 LTS 基准版本。
