# 第14章：Java 21 的其他特性——分代式 ZGC、字符串模板和未命名模式

Java 21 除了旗舰级的虚拟线程（Virtual Threads）、有序集合（Sequenced Collections）和模式匹配（Pattern Matching）之外，还包含了许多其他特性。本章涵盖分代式 ZGC（Generational ZGC，一项重大的垃圾收集改进）、字符串模板（String Templates，预览功能——后来在后续预览中被移除）、未命名模式和变量（Unnamed Patterns and Variables），以及未命名类和实例 main 方法（Unnamed Classes and Instance Main Methods）。

---

## 14.1 分代式 ZGC（JEP 439）

ZGC 在 Java 11 中作为一款低延迟垃圾收集器（Garbage Collector）被引入，具有亚毫秒级的暂停时间。其最初的设计采用单代堆（single-generation heap）。Java 21 为 ZGC 增加了**分代**模式，利用了众所周知的分代假说（Generational Hypothesis）：大多数对象在年轻时就会死亡。

### 为什么分代式 GC 对 ZGC 有帮助

非分代式 ZGC 在每次收集周期中都会扫描整个堆。使用分代式 ZGC 后，短生命周期的对象会在**年轻代**（Young Generation，空间小、收集速度快）中被频繁收集，而长生命周期的对象则会晋升到**老年代**（Old Generation，收集频率较低）。这减少了：
- 每次收集周期扫描的存活数据量
- GC 的 CPU 开销
- 屏障缓冲区（Barrier Buffers）所需的堆开销

### 启用分代式 ZGC

```bash
# Java 21：启用分代模式的 ZGC
java -XX:+UseZGC -XX:+ZGenerational -jar myapp.jar

# Java 21 默认仍然是非分代式 ZGC
# 从 Java 23 开始，分代模式成为 ZGC 的默认模式
java -XX:+UseZGC -jar myapp.jar  # 在 Java 21 中为非分代模式
```

### 性能特征

分代式 ZGC 对以下场景最为有益：
- 高分配率的应用程序（处理大量短生命周期请求的微服务）
- 大堆（16GB+）的应用程序，此时全堆扫描开销较大
- 低延迟服务，尾部延迟（Tail Latency）比吞吐量更重要

```java
// 示例：受益于分代式 ZGC 的高分配率微服务
@RestController
public class OrderController {

    @GetMapping("/orders/{id}")
    public OrderResponse getOrder(@PathVariable String id) {
        // 每个请求会产生许多短生命周期的对象：
        // - 请求 DTO、响应对象
        // - 中间流对象
        // - JSON 序列化缓冲区
        Order order = orderService.find(id);
        return mapper.toResponse(order); // 这些对象在响应之后就会死亡
    }
}
```

分代式 ZGC 的堆大小配置指南：
```bash
# 年轻代大小（默认：自动调优）
-XX:ZYoungGenerationSize=1g   # 或指定为比例
-XX:ZYoungGenerationSizeMax=2g
```

### ZGC vs G1 vs Shenandoah

| 垃圾收集器 | 暂停时间目标 | 最适用于 |
|----|-------------|----------|
| G1 | ~200ms | 吞吐量与延迟的平衡 |
| Shenandoah | <10ms | 中等堆大小的低延迟场景 |
| ZGC（分代式） | <1ms | 超低延迟、大堆场景 |
| Serial/Parallel | 不适用 | 小堆的批处理/命令行工具 |

---

## 14.2 字符串模板（JEP 430——Java 21 预览功能）

> **状态说明**：字符串模板在 Java 21（JEP 430）和 Java 22（JEP 459）中作为预览功能引入，但在 Java 23 中由于设计方面的顾虑被**撤回并移除**出预览。该特性可能会在未来的版本中以重新设计的形式回归。以下内容反映的是 Java 21/22 的预览 API，仅供历史参考。请勿在面向 Java 23+ 的生产代码中使用此特性。

### STR 模板处理器（Template Processor）

```java
// 使用 STR 进行基本插值（Java 21 预览语法）
String name = "Alice";
int age = 30;

String greeting = STR."Hello, \{name}! You are \{age} years old.";
// "Hello, Alice! You are 30 years old."

// \{...} 内可以使用任意表达式
double price = 99.99;
String receipt = STR."Total: $\{price * 1.1}";  // "Total: $109.989"
String formatted = STR."Total: $\{"%.2f".formatted(price * 1.1)}"; // $109.99
```

### FMT 模板处理器

```java
// FMT：类似 STR，但支持格式化说明符
String table = FMT."""
        %-15s %5s %8s%n\{""} %-15s %5.2f %8.2f%n\
        """.formatted();  // 注意：FMT 是一个预览概念
```

### 为什么字符串模板被撤回

Java 团队发现模板处理器（`StringTemplate.Processor` 接口）的设计存在未解决的问题，涉及安全性、默认处理器语义，以及与 SQL/HTML 注入预防的交互。他们选择撤回该特性，而不是最终确定一个未来可能需要进行破坏性更改的设计。

---

## 14.3 未命名模式和变量（JEP 443——Java 21 预览，Java 22 正式发布）

未命名模式和变量使用 `_` 作为通配符来**有意忽略**不需要的值：

### catch 中的未命名变量

```java
// 之前：被迫为不使用的异常命名
try {
    riskyOperation();
} catch (SpecificException ignored) {  // "ignored" 名不副实
    fallback();
}

// 之后：_ 明确表示"我不需要这个"
try {
    riskyOperation();
} catch (SpecificException _) {
    fallback();
}
```

### 增强 for 循环中的未命名变量

```java
// 仅计数元素而不使用元素本身
int count = 0;
for (var _ : collection) {
    count++;
}
// 比 for (var ignored : collection) 更简洁
```

### switch 中的未命名模式

```java
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
record Triangle(double base, double height, double hyp) implements Shape {}

// 使用 _ 忽略不需要的组件
String quickDescribe(Shape shape) {
    return switch (shape) {
        case Circle(double r)            -> "circle r=" + r;
        case Rectangle(double w, double h) -> "rectangle " + w + "×" + h;
        case Triangle(double b, var _, var _) -> "triangle base=" + b; // 忽略 h 和 hyp
    };
}
```

### Lambda 中的未命名变量

```java
// 当 Lambda 参数是必需的但未被使用时
Map<String, Integer> wordCount = new HashMap<>();
words.forEach((word, _) -> wordCount.merge(word, 1, Integer::sum));
// 比 words.forEach((word, ignoredValue) -> ...) 更简洁
```

### try-with-resources 中的未命名变量

```java
// 当你需要打开/关闭的副作用，但不需要资源本身时
try (var _ = MDC.putCloseable("requestId", requestId)) {
    processRequest(); // MDC 上下文在此期间被设置，我们不需要这个 AutoCloseable 对象
}
```

---

## 14.4 未命名类和实例 main 方法（JEP 445——Java 21 预览，Java 25 正式发布）

此特性通过消除简单程序中必须声明类的要求，降低了 Java 程序的入门门槛：

### 实例 main 方法

```java
// Java 21 之前：必须使用 static、String[] args 和类声明
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Java 21 预览：这三个修饰符现在都是可选的
// 传统写法仍然有效，但以下写法也可以编译：
class SimplerHello {
    void main() {  // 实例方法，无参数
        System.out.println("Hello, World!");
    }
}
```

启动器（Launcher）的优先级顺序：
1. `public static void main(String[])`  ——传统方式，最高优先级
2. `static void main(String[])`
3. `public static void main()`
4. `static void main()`
5. `public void main(String[])`
6. `public void main()`
7. `void main(String[])`
8. `void main()`                        ——最低优先级

### 未命名类

```java
// 未命名类：完全没有类声明
// 文件：Greeter.java
void main() {
    String name = System.getProperty("user.name");
    println("Hello, " + name + "!");
}

// 'println' 是自动导入的（java.io.IO 类，预览功能）
```

未命名类**隐式导入**了：
- `java.lang.*` 的全部内容
- `java.io.*` 的全部内容
- 选定的实用方法，如 `println()`

### 高级使用场景

对于有经验的工程师来说，这些特性并不是关于简化——而是关于**脚本编写的便利性**：

```java
// 快速数据转换脚本——无需任何仪式代码
// 文件：ProcessOrders.java
import java.nio.file.*;
import java.util.*;

void main() throws Exception {
    var orders = Files.readAllLines(Path.of("orders.csv"));
    orders.stream()
          .skip(1)  // 跳过标题行
          .map(line -> line.split(","))
          .filter(cols -> Double.parseDouble(cols[2]) > 100.0)
          .forEach(cols -> System.out.println(cols[0] + ": $" + cols[2]));
}
```

运行方式：
```bash
java --enable-preview --source 21 ProcessOrders.java
```

---

## 14.5 完整的 Java 21 升级检查清单

```
☐ 启用虚拟线程（Spring Boot：spring.threads.virtual.enabled=true）
   或使用 Executors.newVirtualThreadPerTaskExecutor() 创建自定义执行器

☐ 在使用虚拟线程且 synchronized 代码块内存在阻塞操作的地方，
   将 synchronized 替换为 ReentrantLock

☐ 采用有序集合 API：
   - 使用 list.getFirst() / list.getLast() 代替 list.get(0) / list.get(size-1)
   - 使用 list.reversed() 进行反向迭代
   - 使用 linkedHashMap.firstEntry() / lastEntry() 访问有序 Map

☐ 在 switch 和 instanceof 中采用记录模式（Record Patterns）
   - 用记录解构替换嵌套的 instanceof 链

☐ 采用 switch 的模式匹配（在 Java 21 中无需 --enable-preview）
   - 对密封类型的穷举式 switch 移除 'default' 分支

☐ 升级依赖项以兼容 Java 21：
   - Spring Boot 3.2+ 以支持虚拟线程
   - Hibernate 6.4+
   - 所有主流框架均已支持 Java 21

☐ GC：为高分配率、低延迟的服务评估分代式 ZGC
   -XX:+UseZGC -XX:+ZGenerational

☐ 预览功能（--enable-preview）：
   - 作用域值（Scoped Values，自行承担在生产中使用的风险——Java 25 正式发布）
   - 结构化并发（Structured Concurrency，自行承担在生产中使用的风险——持续演进至 Java 25）
   - 未命名模式和变量（Java 22 正式发布）
```

---

## 14.6 总结

Java 21 的补充特性使这一里程碑式的版本更加完善：

- **分代式 ZGC** 减少了高分配率服务的 GC 开销，暂停时间接近于零
- **字符串模板**（预览功能，后被撤回）——等待未来 Java 版本的重新设计
- **未命名模式**（`_`）实现了对未使用组件和变量的有意忽略——Java 22 正式发布
- **未命名类**和实例 `main()` 方法减少了脚本和程序的样板代码——Java 25 正式发布

结合虚拟线程、有序集合和模式匹配的最终定稿，Java 21 代表了自 Java 8 以来最具影响力的变更集合——使其成为任何严肃的 Java 组织理所当然的长期目标版本。
