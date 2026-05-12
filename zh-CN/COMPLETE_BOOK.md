# 现代 Java：精通 Java 17、21 和 25 的新特性

## 面向资深 Java 工程师的深度指南

---

**版本：** 第一版，2026

---

## MIT 许可证

Copyright (c) 2026 The Junlei Li

特此免费授予任何获得本书及相关文档文件（以下简称"本书"）副本的人不受限制地处理本书的权利，包括但不限于使用、复制、修改、合并、出版、分发、再许可和/或销售本书副本的权利，以及允许获得本书的人这样做的权利，但须遵守以下条件：

上述版权声明和本许可声明应包含在本书的所有副本或重要部分中。

本书按"原样"提供，不附带任何明示或暗示的保证，包括但不限于适销性、特定用途适用性和非侵权性的保证。在任何情况下，作者或版权持有人均不对因本书或本书的使用或其他处理而产生的、由此引起的或与之相关的任何索赔、损害或其他责任负责，无论是合同诉讼、侵权诉讼还是其他诉讼。

---

Java 和 OpenJDK 是 Oracle Corporation 及/或其附属公司的商标或注册商标。所有其他商标均为其各自所有者的财产。

---

---

# 目录

**前言**

**引言：现代 Java 的发布节奏**

---

## 第一部分：Java 17 —— 基础焕新（LTS）

**第 1 章：记录（Records）—— 不可变数据载体**
- 1.1 记录所解决的问题
- 1.2 记录声明的结构解析
- 1.3 自动生成的方法：equals、hashCode、toString、访问器
- 1.4 紧凑构造器（Compact Constructors）
- 1.5 自定义构造器与访问器重写
- 1.6 记录与接口
- 1.7 泛型记录
- 1.8 记录作为局部记录
- 1.9 限制：记录不能做什么
- 1.10 记录与序列化
- 1.11 记录 vs. Lombok @Value vs. 传统 POJO
- 1.12 实战模式：领域值对象、DTO、结果类型
- 1.13 记录与 Stream API 及 Collectors
- 1.14 总结

**第 2 章：密封类和接口（Sealed Classes and Interfaces）**
- 2.1 动机：开放类层次结构的问题
- 2.2 使用 permits 子句声明密封类
- 2.3 密封接口
- 2.4 子类约束：final、sealed、non-sealed
- 2.5 模块注意事项
- 2.6 密封类与编译器：穷尽性检查
- 2.7 密封类作为代数数据类型（ADTs）
- 2.8 密封类与记录的结合
- 2.9 密封类与模式匹配的结合
- 2.10 密封类在领域建模中的应用：Shape、Payment、Result、Either
- 2.11 迁移：将现有层次结构重构为密封类
- 2.12 总结

**第 3 章：instanceof 的模式匹配（Pattern Matching for instanceof）**
- 3.1 旧的 instanceof 惯用法及其不便之处
- 3.2 模式变量：绑定与作用域
- 3.3 流作用域规则
- 3.4 否定与短路运算符
- 3.5 模式匹配实战：替代访问者模式
- 3.6 嵌套与链式模式
- 3.7 与泛型的交互
- 3.8 总结

**第 4 章：深入文本块（Text Blocks）**
- 4.1 动机：Java 15 之前的多行字符串字面量
- 4.2 文本块语法与附带空白
- 4.3 转义序列：\s 和行续接符
- 4.4 文本块相关的 String 方法：indent、stripIndent、translateEscapes
- 4.5 文本块用于 JSON、SQL、HTML 和 XML
- 4.6 性能考量
- 4.7 总结

**第 5 章：Switch 表达式与 Switch 的模式匹配（Switch Expressions and Pattern Matching for Switch）**
- 5.1 Switch 表达式：从语句到表达式
- 5.2 箭头语法与 yield
- 5.3 Switch 表达式中的穷尽性
- 5.4 Switch 的模式匹配：类型模式
- 5.5 使用 when 的守卫模式
- 5.6 Switch 中的 null 处理
- 5.7 主导性与完备性规则
- 5.8 总结

**第 6 章：Java 17 的其他特性**
- 6.1 增强的伪随机数生成器（JEP 356）
- 6.2 JDK 内部 API 的强封装（JEP 403）
- 6.3 上下文相关的反序列化过滤器（JEP 415）
- 6.4 弃用与移除
- 6.5 总结

---

## 第二部分：Java 21 —— 并发、集合与模式（LTS）

**第 7 章：虚拟线程（Virtual Threads）—— 线程革命**
- 7.1 扩展性问题：平台线程与操作系统
- 7.2 虚拟线程：架构与载体线程
- 7.3 创建虚拟线程
- 7.4 阻塞的代价很低：I/O、锁与钉扎
- 7.5 虚拟线程与线程局部变量
- 7.6 虚拟线程与 ExecutorService
- 7.7 可观测性：JFR、JMX 和线程转储
- 7.8 何时不应使用虚拟线程
- 7.9 现有应用的迁移策略
- 7.10 总结

**第 8 章：结构化并发（Structured Concurrency）**
- 8.1 非结构化并发及其失败模式
- 8.2 StructuredTaskScope：概念与 API
- 8.3 ShutdownOnFailure 和 ShutdownOnSuccess 策略
- 8.4 自定义作用域
- 8.5 错误传播与取消
- 8.6 结构化并发与虚拟线程
- 8.7 总结

**第 9 章：作用域值（Scoped Values）**
- 9.1 ThreadLocal 的问题
- 9.2 ScopedValue：概念与生命周期
- 9.3 继承与子作用域
- 9.4 结构化并发中的作用域值
- 9.5 从 ThreadLocal 迁移
- 9.6 总结

**第 10 章：有序集合（Sequenced Collections）**
- 10.1 Java 21 之前集合层次结构中的缺口
- 10.2 SequencedCollection、SequencedSet、SequencedMap
- 10.3 新方法：getFirst、getLast、reversed
- 10.4 与现有集合的交互
- 10.5 总结

**第 11 章：记录模式（Record Patterns）**
- 11.1 解构记录
- 11.2 嵌套记录模式
- 11.3 泛型记录模式
- 11.4 Switch 中的记录模式
- 11.5 实际用例
- 11.6 总结

**第 12 章：Switch 的模式匹配（正式版）（Pattern Matching for Switch (Finalized)）**
- 12.1 从预览到正式：有哪些变化
- 12.2 完整的模式 Switch 示例
- 12.3 密封类型的穷尽性
- 12.4 when 子句
- 12.5 总结

**第 13 章：外部函数与内存 API（Foreign Function and Memory API）**
- 13.1 动机：超越 JNI
- 13.2 MemorySegment 与 MemoryLayout
- 13.3 Linker 与 FunctionDescriptor
- 13.4 Arena 生命周期管理
- 13.5 实战示例：调用原生库
- 13.6 安全性与性能权衡
- 13.7 总结

**第 14 章：Java 21 的其他特性**
- 14.1 分代 ZGC
- 14.2 字符串模板（预览 — JEP 430）
- 14.3 未命名模式与变量（预览 — JEP 443）
- 14.4 未命名类与实例 main 方法（预览 — JEP 445）
- 14.5 密钥管理与安全更新
- 14.6 总结

---

## 第三部分：Java 25 —— 下一个 LTS

**第 15 章：作用域值（正式版）（Scoped Values (Finalized)）**
- 15.1 预览版以来的变化
- 15.2 最终 API 形态与最佳实践
- 15.3 实际部署模式
- 15.4 总结

**第 16 章：结构化并发（Java 25 中的预览特性）（Structured Concurrency (Preview in Java 25)）**
- 16.1 自 Java 21 以来的 API 演变
- 16.2 新的作用域策略与自定义扩展点
- 16.3 生产就绪度评估
- 16.4 总结

**第 17 章：灵活的构造器主体（Flexible Constructor Bodies）**
- 17.1 旧有的 super() 必须置首约束
- 17.2 灵活构造器主体所允许的内容
- 17.3 委托前的验证与计算
- 17.4 对继承与安全性的影响
- 17.5 总结

**第 18 章：精简源文件与实例 main 方法（Compact Source Files and Instance Main Methods）**
- 18.1 为小程序减少样板代码
- 18.2 实例 main 方法：工作原理
- 18.3 无需类声明的精简源文件
- 18.4 用例：脚本、原型、教学
- 18.5 总结

**第 19 章：模块导入声明（Module Import Declarations）**
- 19.1 模块化导入的冗余问题
- 19.2 import module 语法
- 19.3 与模块系统的交互
- 19.4 总结

**第 20 章：密钥派生函数 API 与安全增强（Key Derivation Function API and Security Enhancements）**
- 20.1 密钥派生函数：背景知识
- 20.2 KDF API
- 20.3 HKDF 和 PBKDF2 实现
- 20.4 Java 25 中的其他安全更新
- 20.5 总结

**第 21 章：JVM 与运行时改进**
- 21.1 紧凑对象头（JEP 450）
- 21.2 分代 Shenandoah
- 21.3 性能改进与基准测试
- 21.4 弃用与移除
- 21.5 总结

---

## 附录

**附录 A：Java 版本兼容性与迁移指南**
- A.1 从 Java 11 迁移到 Java 17
- A.2 从 Java 17 迁移到 Java 21
- A.3 从 Java 21 迁移到 Java 25
- A.4 工具链兼容性矩阵
- A.5 常见迁移陷阱

**附录 B：JEP 参考索引**
- 本书引用的所有 JEP，按 Java 版本组织

---

---

# 前言

本书是为那些已经深谙 Java 语言的工程师而写的——他们是使用 Java 8、11 或 17 构建过生产系统的专业人士，需要一本精确、全面且有见地的指南来了解现代 Java 版本中的变化。在这里，你不会找到面向对象编程基础的讲解，也不会找到集合 API 的入门介绍。你会找到的，是对三个里程碑式版本——Java 17、21 和 25——中引入的语言和平台特性的深入实践探讨。

## 为什么选择这三个版本？

Java 遵循六个月一次的发布节奏，每年三月和九月发布新版本。这种节奏产生了大量版本，但并非所有版本都同等重要。Java 社区和更广泛的生态系统——构建工具、框架、云服务商、运行时环境——都集中在长期支持（Long-Term Support，LTS）版本上，这些版本提供延长的维护窗口和供应商保证。Java 17（2021 年 9 月发布）、Java 21（2023 年 9 月发布）和 Java 25（预计 2025 年 9 月发布）代表了三个连续的 LTS 里程碑，共同定义了"现代 Java"编程的含义。

Java 17 巩固了此前经历多个版本预览或孵化的特性：记录、密封类、`instanceof` 的模式匹配、文本块和 Switch 表达式成为语言的标准组成部分。这些特性组合在一起，使 Java 显著地朝着更具表现力、带有函数式编程风格的方向转变。

Java 21 交付了许多人认为是十多年来最重大的平台级变革：虚拟线程。连同结构化并发、作用域值、有序集合、记录模式以及 Switch 模式匹配的正式定稿，Java 21 是一个改变了资深工程师思考并发、数据建模和 API 设计方式的版本。

Java 25 在平台基础之上继续构建，将经过多轮预览的特性正式定稿，引入灵活的构造器主体、精简源文件、模块导入声明和新的密钥派生函数 API，同时持续改进 JVM 的垃圾收集器和运行时性能。

## 如何阅读本书

本书分为三个部分，每个部分对应一个 LTS 版本。在每个部分中，章节按照循序渐进的方式编排——基础语言特性在高级 API 之前，简单概念在复杂概念之前。然而，每一章基本上是独立的，资深工程师完全可以直接跳转到与当前工作最相关的特性。

每一章遵循一致的结构：动机（该特性为何存在、解决什么问题）、包含大量代码示例的详细技术阐述、来自实际工程场景的实用模式，以及总结部分。

本书中的代码示例针对 Java 17 或更高版本编写，特定版本的示例有明确标注。除非另有说明，所有示例均完整且可编译。我们倾向于使用贴近真实业务的领域名称——`Order`、`Product`、`User`、`Money`、`PaymentMethod`、`ShippingAddress`——而非那些充斥在过多技术书籍中的抽象玩具示例。

## 预备知识

本书假设你精通 Java。具体来说，你应该熟练掌握以下内容：

- Java 泛型，包括有界通配符和类型推断
- Java 集合框架
- 函数式接口、Lambda 表达式和 Stream API（Java 8+）
- Java 模块系统（JPMS），至少在概念层面
- 并发基础：线程、锁、`ExecutorService`、`Future`
- JVM 概念：堆、栈、垃圾收集基础

如果你是 Java 新手，我们建议先打好基础。本书不是入门读物——而是一本精通指南。

## 致谢

Wibey 工程团队感谢 OpenJDK 贡献者、JEP 作者以及更广泛的 Java 社区，他们公开的规范、设计文档和技术讨论使本书的撰写成为可能。我们特别感谢 Project Loom、Project Amber 和 Project Panama 团队多年来持续而深思熟虑的工作，正是他们打造了本书涵盖的这些特性。

---

---

# 引言：现代 Java 的发布节奏

## 一门持续演进的语言

多年来，Java 的发布节奏以漫长的周期著称。Java 6 于 2006 年发布，Java 7 于 2011 年，Java 8 于 2014 年，Java 9 于 2017 年。工程师们可以合理地预期两次大版本之间有数年的稳定期，而生态系统——框架、工具、运行时环境——也有充足的时间在下一波变革到来之前做好适配。其弊端在于积压：特性需要数年才能进入生产环境，半成品的实验长期搁置，而来自 Kotlin、Scala 和其他 JVM 语言的竞争压力日益加剧。

2017 年，OpenJDK 社区采用了新的模式：严格的六个月发布节奏，每年三月和九月发布一个新的特性版本。伴随发布节奏而来的是"预览特性（Preview Feature）"机制，该机制允许语言和 API 的变更以一种有时限的、标准但非最终定稿的状态发布，让社区有机会在特性被锁定之前提供反馈。频繁发布与预览特性的结合，将 Java 的开发过程从缓慢的瀑布式模型转变为更接近持续改进的模式。

## 为什么 LTS 版本仍然重要

六个月的发布节奏并不意味着每个版本对所有组织都可以直接用于生产环境。许多企业、基础设施提供商和框架作者无法在六个月的周期内消化破坏性变更或不确定的 API。LTS（长期支持）标识的存在正是为了应对这一现实。LTS 版本是 Oracle、Amazon、Microsoft、Azul、Red Hat 和其他 JDK 发行商承诺提供安全补丁和 Bug 修复的版本，支持期通常长达八年或更久——这是 Oracle 当前策略下的典型期限。

对于在企业、云服务或任何注重稳定性的环境中工作的工程师来说，LTS 版本定义了实际的采用边界。如果你正在为一个新项目或一次重大迁移选择标准化的 Java 版本，答案几乎总是最新的 LTS 版本。这就是 Java 17、Java 21 和 Java 25 如此重要的原因：它们是特性趋于稳定、生态系统跟上步伐、生产环境大规模采用成为常态的版本。

## Java 17、21 和 25 概览

**Java 17**（LTS，2021 年 9 月）正式定稿了通过 Java 14、15 和 16 孵化的语言特性。记录、密封类和 `instanceof` 的模式匹配成为语言规范的永久组成部分。文本块作为标准特性在 Java 15 中引入后得到进一步完善。Switch 表达式自 Java 14 起成为标准，并在预览中获得了扩展的模式匹配能力。JDK 还完成了 Project Jigsaw 开启的内部 API 强封装，移除了许多应用所依赖的变通方案。Java 17 是一次重大的语言现代化版本。

**Java 21**（LTS，2023 年 9 月）可以说是自 Java 8 以来影响最为深远的 Java 版本。Project Loom 的虚拟线程作为标准特性正式发布，使得编写阻塞式 I/O 代码可以在海量规模下运行而无需承担操作系统级线程的开销。结构化并发和作用域值——两者当时仍处于预览阶段——提供了正确使用虚拟线程的编程模型。Switch 的模式匹配正式定稿，记录模式将模式匹配系统扩展到复合数据结构中。有序集合解决了集合 API 中一个长期存在的缺口。外部函数与内存 API（Project Panama）成为标准的非预览特性。Java 21 改变了你编写并发代码和建模数据的方式。

**Java 25**（LTS，预计 2025 年 9 月）为经历了多轮预览周期的若干特性画上句号，最引人注目的是灵活的构造器主体、精简源文件和实例 main 方法。它正式定稿了作用域值并推进了结构化并发。安全性改进包括新的密钥派生函数 API。JVM 层面的变化包括紧凑对象头和分代 Shenandoah，为内存密集型工作负载带来了显著的性能提升。Java 25 是一个成熟版本——戏剧性的突破较少，但平台经过精心打磨，质量上乘，为下一代生产系统做好了准备。

## 各特性如何协同配合

Java 17 至 25 横跨的特性中最引人注目的一点是它们组合得如此连贯。记录、密封类和模式匹配形成了一个在 Java 中表达代数数据类型（Algebraic Data Types）的完整体系——这是函数式程序员数十年来一直使用的设计模式，而 Java 现在正以自己的方式拥抱它。虚拟线程、结构化并发和作用域值同样构成了一个一致的并发编程模型——它将异步框架的表达力带入了同步阻塞代码中。

这些并非逐一拼接到语言上的孤立特性。它们是长期运行的 OpenJDK 项目的产物——Project Amber（语言特性）、Project Loom（并发）、Project Panama（原生互操作）、Project Valhalla（值类型，仍在进行中）——每个项目都有清晰的架构愿景。理解这些愿景与理解各个独立特性同样重要，这也是我们在全书中反复回归的主题。

后续各章将深入研究每一个特性。但更宏大的叙事是关于 Java 的蜕变——它正在成为一门能够清晰表达领域模型、大规模处理并发、高效与原生平台互操作的语言，同时还保持着向后兼容性和丰富的生态系统——正是这些品质使它成为历史上部署最广泛的编程语言之一。

让我们开始吧。


---

# 第1章：记录（Records）——不可变数据载体

记录（Records）是过去十年中对 Java 语言影响最深远的特性之一。它在 Java 16 中正式定稿（JEP 395），也是 Java 17 的基石特性。记录消除了数据载体类中令人疲于应付的大量样板代码，同时在类型系统中编码了*设计意图*：一个记录表明"这是一个透明的、不可变的组件聚合体"。深入理解记录——它的能力、约束以及背后的设计哲学——是每一位现代 Java 工程师的必备素养。

---

## 1.1 记录要解决的问题

考虑一个简单的 `Point` 类。在记录出现之前，你需要编写如下代码：

```java
public final class Point {
    private final double x;
    private final double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double x() { return x; }
    public double y() { return y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point p)) return false;
        return Double.compare(p.x, x) == 0 && Double.compare(p.y, y) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }

    @Override
    public String toString() {
        return "Point[x=" + x + ", y=" + y + "]";
    }
}
```

仅仅一个包含 2 个字段的数据类，就需要 30 多行代码。使用 Lombok 的 `@Value` 可以减少代码量，但这引入了注解处理器依赖，而且该类仍然不是一等语言概念——它只是一个代码生成的外观。

使用记录，同样的类变成了：

```java
public record Point(double x, double y) {}
```

一行代码。没有样板代码。没有注解处理器。完整的编译器支持。

---

## 1.2 记录声明的结构

语法非常简洁：

```
[modifiers] record <Name>(<components>) [implements <interfaces>] { [body] }
```

一个涵盖所有部分的实际示例：

```java
public record Order(
    UUID id,
    String customerId,
    List<OrderItem> items,
    Instant createdAt,
    OrderStatus status
) implements Serializable {
    // optional body: custom constructors, static fields/methods, instance methods
}
```

**组件**（括号中的参数）是记录的核心定义特征。每个组件隐式声明了：
1. 一个同名同类型的 `private final` 字段
2. 一个同名的公共访问器方法（不是 `getX()`——而是 `x()`）
3. 参与自动生成的 `equals`、`hashCode` 和 `toString`

记录隐式地是 `final` 的——它们不能被继承。它们隐式地继承 `java.lang.Record`。

---

## 1.3 自动生成的方法

编译器自动合成四样东西：

**规范构造函数（Canonical constructor）**：按声明顺序接受所有组件作为参数。

**访问器方法**：每个组件一个，返回该组件的值。

**`equals()`**：使用各组件自身的 `equals()` 来比较所有组件。

**`hashCode()`**：由所有组件派生。

**`toString()`**：生成 `ClassName[comp1=val1, comp2=val2, ...]` 格式的字符串。

```java
record Product(String sku, String name, BigDecimal price) {}

public class RecordDemo {
    public static void main(String[] args) {
        var p1 = new Product("ABC-001", "Wireless Headphones", new BigDecimal("79.99"));
        var p2 = new Product("ABC-001", "Wireless Headphones", new BigDecimal("79.99"));
        var p3 = new Product("ABC-002", "USB-C Cable", new BigDecimal("12.99"));

        // accessor methods (not getXxx() — just xxx())
        System.out.println(p1.sku());    // ABC-001
        System.out.println(p1.name());   // Wireless Headphones
        System.out.println(p1.price());  // 79.99

        // equals — structural, not identity
        System.out.println(p1.equals(p2)); // true
        System.out.println(p1.equals(p3)); // false
        System.out.println(p1 == p2);      // false (distinct objects)

        // hashCode — consistent with equals
        System.out.println(p1.hashCode() == p2.hashCode()); // true

        // toString — readable and unambiguous
        System.out.println(p1); // Product[sku=ABC-001, name=Wireless Headphones, price=79.99]
    }
}
```

---

## 1.4 紧凑构造函数

**紧凑构造函数（Compact constructor）**是记录特有的功能，用于添加校验或规范化逻辑，而无需重复组件赋值：

```java
public record Range(int min, int max) {
    // Compact constructor: no parameter list, no explicit assignments
    public Range {
        if (min > max) {
            throw new IllegalArgumentException(
                "min (%d) must not exceed max (%d)".formatted(min, max));
        }
        // Normalization example: trim strings if components were String
    }
}
```

紧凑构造函数体在隐式字段赋值*之前*执行。你可以在其中重新赋值组件变量：

```java
public record NormalizedEmail(String address) {
    public NormalizedEmail {
        Objects.requireNonNull(address, "address must not be null");
        address = address.strip().toLowerCase(); // reassign before implicit assignment
    }
}

// Usage:
var email = new NormalizedEmail("  Alice@Example.COM  ");
System.out.println(email.address()); // alice@example.com
```

这比记录出现之前在构造函数中散落 `this.address = address.strip().toLowerCase()` 的写法干净得多。

---

## 1.5 自定义构造函数与访问器重写

你可以定义额外的构造函数，但它们**必须通过 `this(...)` 委托给规范构造函数**：

```java
public record Money(BigDecimal amount, Currency currency) {
    // Additional convenience constructor
    public Money(double amount, String currencyCode) {
        this(BigDecimal.valueOf(amount), Currency.getInstance(currencyCode));
    }

    // Factory method pattern (often preferred over additional constructors)
    public static Money of(double amount, String currencyCode) {
        return new Money(BigDecimal.valueOf(amount), currencyCode);
    }

    public static Money zero(String currencyCode) {
        return new Money(BigDecimal.ZERO, Currency.getInstance(currencyCode));
    }
}
```

你还可以重写访问器方法——这在需要对可变组件进行防御性复制时很有用：

```java
public record Snapshot(List<String> tags, Instant timestamp) {
    // Defensive copy in compact constructor
    public Snapshot {
        tags = List.copyOf(tags); // make truly immutable
    }

    // Override accessor if needed (rare — compact constructor is usually enough)
    // public List<String> tags() { return Collections.unmodifiableList(tags); }
}
```

---

## 1.6 记录与接口

记录可以实现接口，这是一种强大的能力表达模式：

```java
public interface Identifiable<ID> {
    ID id();
}

public interface Auditable {
    Instant createdAt();
    Instant updatedAt();
}

public record CustomerRecord(
    UUID id,
    String name,
    String email,
    Instant createdAt,
    Instant updatedAt
) implements Identifiable<UUID>, Auditable {

    // Interface methods are satisfied by the record components automatically
    // because accessors match: id(), createdAt(), updatedAt()
}
```

在构建泛型仓储或处理管道时，这一点尤其强大：

```java
public <ID, T extends Identifiable<ID>> void save(T entity) {
    System.out.println("Saving entity with id: " + entity.id());
}
```

---

## 1.7 泛型记录

记录完全支持泛型：

```java
public record Pair<A, B>(A first, B second) {
    public Pair<B, A> swap() {
        return new Pair<>(second, first);
    }

    public <C> Pair<A, C> mapSecond(java.util.function.Function<B, C> f) {
        return new Pair<>(first, f.apply(second));
    }
}

public record Result<T>(T value, String error, boolean success) {
    public static <T> Result<T> ok(T value) {
        return new Result<>(value, null, true);
    }

    public static <T> Result<T> fail(String error) {
        return new Result<>(null, error, false);
    }

    public boolean isOk() { return success; }

    public T getOrThrow() {
        if (!success) throw new RuntimeException("Result failed: " + error);
        return value;
    }
}
```

用法：

```java
var pair = new Pair<>("hello", 42);
System.out.println(pair.swap()); // Pair[first=42, second=hello]

var result = Result.ok("user found");
System.out.println(result.getOrThrow()); // user found

var failed = Result.<String>fail("user not found");
System.out.println(failed.isOk()); // false
```

---

## 1.8 局部记录

记录可以在方法内部局部声明——这是一种极佳的工具，用于定义不应污染包命名空间的中间计算数据结构：

```java
public List<String> getTopProductNames(List<Order> orders, int topN) {
    // Local record: only meaningful in this method's context
    record ProductRevenue(String name, BigDecimal revenue) {}

    return orders.stream()
        .flatMap(o -> o.items().stream())
        .collect(Collectors.groupingBy(
            OrderItem::productName,
            Collectors.reducing(BigDecimal.ZERO,
                OrderItem::subtotal,
                BigDecimal::add)
        ))
        .entrySet().stream()
        .map(e -> new ProductRevenue(e.getKey(), e.getValue()))
        .sorted(Comparator.comparing(ProductRevenue::revenue).reversed())
        .limit(topN)
        .map(ProductRevenue::name)
        .toList();
}
```

局部记录在定义上是 `static` 的——它们不能捕获外围实例的状态。

---

## 1.9 限制：记录不能做什么

理解记录*不能*做什么与了解它能做什么同样重要：

| 限制 | 原因 |
|------|------|
| 不能继承其他类 | 记录隐式继承 `java.lang.Record` |
| 不能被其他类继承 | 记录隐式为 `final` |
| 不能声明组件之外的实例字段 | 组件即完整状态 |
| 不能有可变组件（由不可变字段强制保证） | 但组件*中*的可变对象需要你自行负责 |
| 紧凑构造函数不能显式调用 `this(...)` | 它本身就是规范构造函数 |
| 组件不能是 `transient` 的（但显式字段可以） | 组件状态即记录的身份标识 |

```java
// This is ILLEGAL:
// record BadRecord(int x) extends SomeClass {}   // can't extend

// This is LEGAL — static fields ARE allowed:
record Counter(int value) {
    private static final AtomicInteger instanceCount = new AtomicInteger(0);

    public Counter {
        instanceCount.incrementAndGet();
    }

    public static int totalCreated() {
        return instanceCount.get();
    }
}
```

---

## 1.10 记录与序列化

记录天然支持序列化。反序列化过程使用规范构造函数，这意味着紧凑构造函数中的校验逻辑在反序列化时同样会执行——这是相对于传统 Java 序列化的一大改进：

```java
public record SerializablePoint(double x, double y) implements Serializable {
    // serialVersionUID is optional for records but good practice
    // Deserialization ALWAYS goes through the canonical constructor
}

// Proof that validation runs during deserialization:
public record PositiveRange(int min, int max) implements Serializable {
    public PositiveRange {
        if (min < 0 || max < 0) throw new IllegalArgumentException("must be positive");
        if (min > max) throw new IllegalArgumentException("min > max");
    }
}
// A tampered serialized form with min > max will fail on deserialization — safe!
```

---

## 1.11 记录 vs Lombok @Value vs 传统 POJO

| 特性 | 传统 POJO | Lombok `@Value` | Java 记录 |
|------|----------|-----------------|-----------|
| 样板代码 | 多 | 无（生成的） | 无（原生的） |
| 需要注解处理器 | 否 | 是 | 否 |
| 不可变性 | 手动（`final` 字段） | 强制保证 | 强制保证 |
| 访问器风格 | `getX()` | `getX()` | `x()` |
| 可被继承 | 是 | 否 | 否 |
| 支持继承 | 是 | 否 | 否（仅支持接口） |
| JVM 感知度 | 无 | 无 | 一等类型 |
| 模式匹配（Pattern Matching）支持 | 否 | 否 | 是 (JEP 440) |
| IDE 支持 | 好 | 好（需要插件） | 优秀（原生） |
| 序列化安全性 | 手动 | 手动 | 构造函数始终被调用 |

关键洞见：记录是一个**语言层面的概念**，而非代码生成的技巧。JVM 理解记录，模式匹配理解记录，未来的 Java 特性也将持续与记录深度集成。

---

## 1.12 实战模式

### 领域值对象

```java
// Value objects in DDD — records are perfect
public record CustomerId(UUID value) {
    public CustomerId {
        Objects.requireNonNull(value, "CustomerId cannot be null");
    }

    public static CustomerId generate() {
        return new CustomerId(UUID.randomUUID());
    }

    public static CustomerId of(String uuidString) {
        return new CustomerId(UUID.fromString(uuidString));
    }
}

public record EmailAddress(String value) {
    private static final Pattern PATTERN =
        Pattern.compile("^[^@]+@[^@]+\\.[^@]+$");

    public EmailAddress {
        Objects.requireNonNull(value);
        if (!PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid email: " + value);
        }
        value = value.toLowerCase();
    }
}

public record Money(BigDecimal amount, String currencyCode) {
    public Money {
        Objects.requireNonNull(amount);
        Objects.requireNonNull(currencyCode);
        if (amount.scale() > 2) {
            amount = amount.setScale(2, RoundingMode.HALF_UP);
        }
    }

    public Money add(Money other) {
        if (!currencyCode.equals(other.currencyCode))
            throw new IllegalArgumentException("Currency mismatch");
        return new Money(amount.add(other.amount), currencyCode);
    }

    public Money multiply(int factor) {
        return new Money(amount.multiply(BigDecimal.valueOf(factor)), currencyCode);
    }
}
```

### API 层的 DTO

```java
// Request/Response DTOs — records are ideal
public record CreateOrderRequest(
    String customerId,
    List<OrderItemRequest> items,
    String shippingAddress
) {}

public record OrderItemRequest(String productId, int quantity) {}

public record CreateOrderResponse(
    String orderId,
    String status,
    Instant estimatedDelivery
) {}
```

### 结果类型

```java
public record ValidationResult(boolean valid, List<String> errors) {
    public ValidationResult {
        errors = List.copyOf(errors);
    }

    public static ValidationResult ok() {
        return new ValidationResult(true, List.of());
    }

    public static ValidationResult fail(List<String> errors) {
        return new ValidationResult(false, errors);
    }

    public static ValidationResult fail(String... errors) {
        return new ValidationResult(false, List.of(errors));
    }

    public ValidationResult merge(ValidationResult other) {
        var allErrors = new ArrayList<>(errors);
        allErrors.addAll(other.errors);
        return new ValidationResult(valid && other.valid, allErrors);
    }
}
```

---

## 1.13 记录与 Stream API 和 Collectors

记录与流（Stream）完美集成：

```java
record SalesSummary(String region, long orderCount, BigDecimal totalRevenue) {}

List<SalesSummary> summarize(List<Order> orders) {
    return orders.stream()
        .collect(Collectors.groupingBy(
            Order::region,
            Collectors.collectingAndThen(
                Collectors.toList(),
                regionOrders -> new SalesSummary(
                    regionOrders.get(0).region(),
                    regionOrders.size(),
                    regionOrders.stream()
                        .map(Order::total)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                )
            )
        ))
        .values().stream()
        .sorted(Comparator.comparing(SalesSummary::totalRevenue).reversed())
        .toList();
}
```

使用 `Collectors.teeing()` 在单次遍历中计算多个聚合值：

```java
record Stats(long count, BigDecimal sum, BigDecimal average) {}

Stats computeStats(List<BigDecimal> values) {
    return values.stream().collect(
        Collectors.teeing(
            Collectors.counting(),
            Collectors.reducing(BigDecimal.ZERO, BigDecimal::add),
            (count, sum) -> new Stats(
                count,
                sum,
                count == 0 ? BigDecimal.ZERO
                           : sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
            )
        )
    );
}
```

---

## 1.14 总结

记录是一项一等语言特性，它能够：

- **消除样板代码**——数据载体类的构造函数、equals、hashCode、toString、访问器全部自动生成
- **编码设计意图**——记录声明了"这个类型纯粹是关于它的数据的"
- **强制不可变性**——组件始终是 `private final` 的
- **赋能模式匹配**——记录解构模式（第11章）正是建立在记录之上的
- **提升序列化安全性**——反序列化时始终会执行规范构造函数
- **良好的组合性**——与接口、泛型、流以及现代 Java 的其他特性无缝协作

关键采用原则：**如果一个类是透明的、不可变的数据载体，它就应该是一个记录**。将普通类保留给具有行为身份或需要可变状态的类型。当这一区分被一致地应用时，代码库的可读性和可维护性将获得质的提升。


---

# 第2章：密封类与密封接口（Sealed Classes and Interfaces）

密封类（Sealed Classes，JEP 409，在 Java 17 中正式发布）回答了 Java 开发者数十年来一直面临的一个问题：*如何定义一个有意封闭的类型层次结构？* 这个问题在领域建模中不断出现——`Shape` 只能是 `Circle`、`Rectangle` 或 `Triangle`；`PaymentMethod` 只能是 `CreditCard`、`BankTransfer` 或 `Crypto`；一个 HTTP 响应要么是 `Success`，要么是 `Failure`。在密封类出现之前，Java 没有任何方式在类型系统中表达这种约束。现在有了。

---

## 2.1 动机：开放类层次结构的问题

考虑一个经典的形状层次结构：

```java
// Before sealed classes: completely open hierarchy
public abstract class Shape {
    public abstract double area();
}

public class Circle extends Shape { ... }
public class Rectangle extends Shape { ... }
public class Triangle extends Shape { ... }
```

这个层次结构是*开放的*——任何人都可以在任何包中添加 `Pentagon`、`Hexagon`，甚至是 `MaliciousShape`。这种开放性会带来几个问题：

**穷尽性检查（Exhaustiveness checking）是不可能的。** 如果你编写一个处理每种已知形状的方法：

```java
// Pre-Java 17: the compiler cannot verify this is exhaustive
double describe(Shape shape) {
    if (shape instanceof Circle c) return c.area();
    if (shape instanceof Rectangle r) return r.area();
    if (shape instanceof Triangle t) return t.area();
    throw new IllegalArgumentException("Unknown shape: " + shape);  // runtime crash
}
```

末尾的 `throw` 是一颗运行时定时炸弹。编译器根本无法判断 `if` 链是否穷尽。

**库作者无法保证不变量。** 返回 `Shape` 值的库无法保证调用者只会遇到这三个已知子类。

**模式匹配（Pattern matching）的 switch 无法做到穷尽。** 没有密封类，对抽象类型进行 switch 总是需要一个 `default` 子句，即使你已经处理了所有有意义的情况。

---

## 2.2 使用 permits 子句声明密封类

```java
public sealed class Shape permits Circle, Rectangle, Triangle {
    public abstract double area();
    public abstract double perimeter();
}
```

`sealed` 修饰符与 `permits` 组合使用，枚举了所有允许的直接子类。编译器会双向强制执行这一约束：`permits` 子句必须精确列出实际继承 `Shape` 的所有类。

被许可的子类必须位于同一个**编译单元（Compilation unit）**中（如果是未命名模块，则为同一个包；如果是命名模块，则为同一个模块）。它们还必须使用以下三种修饰符之一来显式声明其继承关系：

```java
// Option 1: final — no further extension
public final class Circle extends Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override public double area() { return Math.PI * radius * radius; }
    @Override public double perimeter() { return 2 * Math.PI * radius; }
}

// Option 2: sealed — restricted further extension
public sealed class Rectangle extends Shape permits Square {
    private final double width;
    private final double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override public double area() { return width * height; }
    @Override public double perimeter() { return 2 * (width + height); }
}

public final class Square extends Rectangle {
    public Square(double side) { super(side, side); }
}

// Option 3: non-sealed — reopens the hierarchy
public non-sealed class Triangle extends Shape {
    private final double base;
    private final double height;
    private final double hypotenuse;

    public Triangle(double base, double height, double hypotenuse) {
        this.base = base;
        this.height = height;
        this.hypotenuse = hypotenuse;
    }

    @Override public double area() { return 0.5 * base * height; }
    @Override public double perimeter() { return base + height + hypotenuse; }
}
```

---

## 2.3 密封接口（Sealed Interfaces）

接口也可以被密封——这是用记录（Records）表达封闭代数数据类型（Algebraic Data Types）的关键特性：

```java
public sealed interface PaymentMethod
    permits CreditCard, BankTransfer, CryptoCurrency, GiftCard {}

public record CreditCard(String last4, String network, YearMonth expiry)
    implements PaymentMethod {}

public record BankTransfer(String iban, String bic, String accountHolder)
    implements PaymentMethod {}

public record CryptoCurrency(String walletAddress, String coinType)
    implements PaymentMethod {}

public record GiftCard(String code, BigDecimal balance)
    implements PaymentMethod {}
```

这种模式——密封接口 + 记录实现——现在已经成为 Java 中表达**代数数据类型（ADTs，Algebraic Data Types）**的惯用方式。它相当于 Haskell 的 `data` 类型或 Scala 的 `sealed trait`。

---

## 2.4 子类约束：final、sealed、non-sealed

每个被许可的子类**必须**选择其立场：

| 修饰符 | 含义 | 适用场景 |
|----------|---------|----------|
| `final` | 不允许进一步继承 | 层次结构的叶子节点，完全封闭 |
| `sealed` | 使用 permits 限制进一步继承 | 你想要一个拥有自身封闭性的子层次结构 |
| `non-sealed` | 允许开放继承 | 你想让层次结构的某个分支可扩展 |

`non-sealed` 是有意重新开放层次结构的"逃生舱口"。对于领域类型来说，它很少是正确的选择，但它的存在是为了框架和可扩展点。

---

## 2.5 密封层次结构中的穷尽性——编译器的保证

密封类的杀手级特性是 `switch` 表达式中的**穷尽性检查**：

```java
// With sealed hierarchy — NO default needed, compiler checks exhaustiveness!
double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.width() * r.height();
        case Square s    -> s.side() * s.side();
        case Triangle t  -> 0.5 * t.base() * t.height();
    };
}
```

如果你添加了一个新的被许可子类（比如 `Pentagon`）但忘记更新这个 switch，**编译器会使构建失败**。不再有因遗漏情况而导致的运行时崩溃。

---

## 2.6 密封类作为代数数据类型

密封类最强大的应用是以类型安全的方式编码**和类型（Sum types）**（一个值是这些备选项*之一*）。与记录结合使用时，可以产出简洁、可组合的领域模型：

```java
// A classic Result/Either type
public sealed interface Result<T> permits Result.Success, Result.Failure {

    record Success<T>(T value) implements Result<T> {}
    record Failure<T>(String message, Throwable cause) implements Result<T> {
        public Failure(String message) { this(message, null); }
    }

    static <T> Result<T> success(T value) { return new Success<>(value); }
    static <T> Result<T> failure(String message) { return new Failure<>(message); }
    static <T> Result<T> failure(String message, Throwable cause) {
        return new Failure<>(message, cause);
    }

    default boolean isSuccess() { return this instanceof Success<T>; }

    default T getOrThrow() {
        return switch (this) {
            case Success<T> s -> s.value();
            case Failure<T> f -> throw new RuntimeException(f.message(), f.cause());
        };
    }

    default <U> Result<U> map(java.util.function.Function<T, U> f) {
        return switch (this) {
            case Success<T> s -> Result.success(f.apply(s.value()));
            case Failure<T> f -> Result.failure(f.message(), f.cause());
        };
    }
}
```

用法：

```java
Result<User> findUser(String id) {
    try {
        return Result.success(userRepository.findById(id));
    } catch (NotFoundException e) {
        return Result.failure("User not found: " + id, e);
    }
}

// Caller — exhaustive, type-safe, no exceptions in control flow
String message = switch (findUser("u123")) {
    case Result.Success<User> s -> "Hello, " + s.value().name();
    case Result.Failure<User> f -> "Error: " + f.message();
};
```

---

## 2.7 使用密封类进行领域建模

### HTTP 响应建模

```java
public sealed interface HttpResponse<T>
    permits HttpResponse.Ok, HttpResponse.Created, HttpResponse.ClientError,
            HttpResponse.ServerError {

    record Ok<T>(T body) implements HttpResponse<T> {}
    record Created<T>(T body, URI location) implements HttpResponse<T> {}
    record ClientError<T>(int statusCode, String message) implements HttpResponse<T> {}
    record ServerError<T>(int statusCode, String message, Throwable cause)
        implements HttpResponse<T> {}
}

// Processing — exhaustive, no default needed
<T> void handleResponse(HttpResponse<T> response) {
    switch (response) {
        case HttpResponse.Ok<T> ok ->
            System.out.println("Success: " + ok.body());
        case HttpResponse.Created<T> created ->
            System.out.println("Created at: " + created.location());
        case HttpResponse.ClientError<T> err ->
            System.err.println("Client error " + err.statusCode() + ": " + err.message());
        case HttpResponse.ServerError<T> err ->
            System.err.println("Server error " + err.statusCode() + ": " + err.message());
    }
}
```

### 事件溯源（Event Sourcing）

```java
public sealed interface OrderEvent permits
    OrderEvent.OrderPlaced,
    OrderEvent.PaymentConfirmed,
    OrderEvent.ItemShipped,
    OrderEvent.OrderCancelled,
    OrderEvent.OrderDelivered {

    record OrderPlaced(UUID orderId, CustomerId customer,
                       List<OrderItem> items, Instant timestamp)
        implements OrderEvent {}

    record PaymentConfirmed(UUID orderId, String transactionId,
                            Money amount, Instant timestamp)
        implements OrderEvent {}

    record ItemShipped(UUID orderId, String trackingNumber,
                       Instant shippedAt) implements OrderEvent {}

    record OrderCancelled(UUID orderId, String reason,
                          Instant cancelledAt) implements OrderEvent {}

    record OrderDelivered(UUID orderId, Instant deliveredAt)
        implements OrderEvent {}
}

// Event handler — exhaustive switch, all events covered
OrderState apply(OrderState state, OrderEvent event) {
    return switch (event) {
        case OrderEvent.OrderPlaced e ->
            state.withStatus(OrderStatus.PENDING).withItems(e.items());
        case OrderEvent.PaymentConfirmed e ->
            state.withStatus(OrderStatus.PAID);
        case OrderEvent.ItemShipped e ->
            state.withStatus(OrderStatus.SHIPPED).withTracking(e.trackingNumber());
        case OrderEvent.OrderCancelled e ->
            state.withStatus(OrderStatus.CANCELLED);
        case OrderEvent.OrderDelivered e ->
            state.withStatus(OrderStatus.DELIVERED);
    };
}
```

---

## 2.8 密封类与模式匹配的结合

密封类和模式匹配天生就是为协同工作而设计的：

```java
public sealed interface Expr
    permits Expr.Num, Expr.Add, Expr.Mul, Expr.Neg, Expr.Var {

    record Num(double value) implements Expr {}
    record Add(Expr left, Expr right) implements Expr {}
    record Mul(Expr left, Expr right) implements Expr {}
    record Neg(Expr expr) implements Expr {}
    record Var(String name) implements Expr {}
}

// Recursive evaluator — exhaustive, no default
double eval(Expr expr, Map<String, Double> env) {
    return switch (expr) {
        case Expr.Num(var v)         -> v;
        case Expr.Var(var name)      -> env.getOrDefault(name, 0.0);
        case Expr.Neg(var e)         -> -eval(e, env);
        case Expr.Add(var l, var r)  -> eval(l, env) + eval(r, env);
        case Expr.Mul(var l, var r)  -> eval(l, env) * eval(r, env);
    };
}

// Pretty-printer
String print(Expr expr) {
    return switch (expr) {
        case Expr.Num(var v)         -> String.valueOf(v);
        case Expr.Var(var name)      -> name;
        case Expr.Neg(var e)         -> "(-" + print(e) + ")";
        case Expr.Add(var l, var r)  -> "(" + print(l) + " + " + print(r) + ")";
        case Expr.Mul(var l, var r)  -> "(" + print(l) + " * " + print(r) + ")";
    };
}
```

---

## 2.9 密封类在错误/可选值建模中的应用

```java
// Option type (like Java Optional, but pattern-matchable)
public sealed interface Option<T> permits Option.Some, Option.None {

    record Some<T>(T value) implements Option<T> {}

    @SuppressWarnings("unchecked")
    final class None<T> implements Option<T> {
        private static final None<?> INSTANCE = new None<>();
        private None() {}
        public static <T> None<T> instance() { return (None<T>) INSTANCE; }
    }

    static <T> Option<T> of(T value) {
        return value != null ? new Some<>(value) : none();
    }

    static <T> Option<T> none() { return None.instance(); }

    default T getOrElse(T defaultValue) {
        return switch (this) {
            case Some<T> s -> s.value();
            case None<T> n -> defaultValue;
        };
    }

    default <U> Option<U> map(java.util.function.Function<T, U> f) {
        return switch (this) {
            case Some<T> s -> Option.of(f.apply(s.value()));
            case None<T> n -> Option.none();
        };
    }
}
```

---

## 2.10 将现有层次结构迁移为密封类

如果你有一个现有的开放层次结构：

```java
// Before: open hierarchy
public abstract class Notification {
    abstract void send();
}
public class EmailNotification extends Notification { ... }
public class SmsNotification extends Notification { ... }
public class PushNotification extends Notification { ... }
```

迁移步骤：
1. 在父类上添加 `sealed` 和 `permits`
2. 在每个子类上添加 `final`（或 `sealed` / `non-sealed`）
3. 让编译器告诉你是否遗漏了任何被许可的子类
4. 将所有 `if-instanceof` 链更新为穷尽性 `switch`

```java
// After: sealed hierarchy
public sealed abstract class Notification
    permits EmailNotification, SmsNotification, PushNotification {
    abstract void send();
}
public final class EmailNotification extends Notification { ... }
public final class SmsNotification extends Notification { ... }
public final class PushNotification extends Notification { ... }
```

---

## 2.11 总结

密封类是一个关键的语言特性，它能够：

- **有意地封闭层次结构**，使其具有自文档化特性
- **启用穷尽性检查**，用于 switch 表达式和模式匹配
- **在 Java 中惯用地支持代数数据类型**（和类型）
- **与记录配合**，产出简洁、不可变、类型安全的领域模型
- **与模式匹配集成**（第3、11、12章），实现精确、可读的数据分发

经验法则：当一个类型拥有*固定的已知子类型集合*，且调用者应该处理所有子类型时，就应该使用 `sealed`。与记录结合使用，它是现代 Java 数据建模的基石。


---

# 第三章：instanceof 的模式匹配（Pattern Matching for instanceof）

> JEP 394，在 Java 16 中正式定稿，是 Java 17 的基石特性

---

`instanceof` 的模式匹配（Pattern Matching）是那种单独来看似乎变动不大、但只有当你遇到它所替代的代码时才会展现出真正价值的语言变化。它是 Java 平台更大规模、长期模式匹配蓝图中交付的第一个成果——这个蓝图贯穿密封类（Sealed Classes）、switch 表达式（Switch Expressions）、记录模式（Record Patterns）等后续特性。要理解 Java 的发展方向，你必须先理解它在 JEP 394 中的起点。

本章以资深 Java 工程师应得的方式来讲解 `instanceof` 的模式匹配：不是将其视为一种语法上的新奇事物，而是作为一个精确的语义工具，围绕作用域（Scope）、控制流（Flow）、泛型（Generics）和性能（Performance）有着明确定义的规则。我们将通过真实的代码来阐释每一个概念，并在最后提供一份迁移指南，你今天就可以将其应用到你的生产代码库中。

---

## 3.1 旧式 instanceof-cast 惯用写法的冗余之苦

每一位经验丰富的 Java 工程师都写过、审查过、也重构过类似这样的代码：

```java
// Classic instanceof-cast idiom — the old way
public double computeArea(Shape shape) {
    if (shape instanceof Circle) {
        Circle c = (Circle) shape;          // cast is redundant information
        return Math.PI * c.radius() * c.radius();
    } else if (shape instanceof Rectangle) {
        Rectangle r = (Rectangle) shape;    // same type we just tested
        return r.width() * r.height();
    } else if (shape instanceof Triangle) {
        Triangle t = (Triangle) shape;
        return 0.5 * t.base() * t.height();
    }
    throw new IllegalArgumentException("Unknown shape: " + shape);
}
```

这里的坏味道不仅仅是冗长。第三行的类型转换（Cast）在逻辑上是多余的：JVM 在第二行已经验证了类型。你，程序员，是在重复自己以满足类型系统的要求，而类型系统并没有从这种重复中获得任何新信息，因为它已经知道了。更糟糕的是，在与测试（`shape instanceof Circle`）不同的行上引入局部变量（`Circle c`），创建了一种对编译器不可见的隐式耦合。如果未来的维护者移除或重新排列了测试但留下了类型转换，`ClassCastException` 就会在运行时（Runtime）出现。

这种惯用写法还会污染封闭作用域。在上面的代码片段中，`c`、`r` 和 `t` 在整个方法中都是可见的——即使在它们各自的分支已经结束之后。这很少是你想要的结果。

再来看一个更隐蔽的变体：在 `java.util.concurrent` 成熟之前，高性能并发代码中出现的双重检查模式（Double-Check Pattern）：

```java
// Problematic double-check — type tested twice, cast separate
public void processEvent(Object event) {
    if (event instanceof PaymentEvent) {
        // ... some validation ...
        PaymentEvent pe = (PaymentEvent) event; // could throw in theory if
                                                // event were mutated between
                                                // lines in a concurrent context
        processPayment(pe.getAmount(), pe.getCurrency());
    }
}
```

在实际中这是安全的，因为 `event` 是一个局部变量（Local Variable），但推理其安全性所带来的认知负担是真实存在的。JEP 394 彻底消除了这一整类问题。

---

## 3.2 模式变量：语法与语义

新语法非常简洁：

```java
if (shape instanceof Circle c) {
    // c is available here, already typed as Circle
    return Math.PI * c.radius() * c.radius();
}
```

片段 `Circle c` 被称为**模式**（Pattern）——具体来说是一个**类型模式**（Type Pattern）。它由一个类型（`Circle`）和一个**模式变量**（Pattern Variable）（`c`）组成。其语义如下：

1. 像以前一样计算 `shape instanceof Circle`。
2. 如果结果为 `true`，将模式变量 `c` 绑定到将 `shape` 转换为 `Circle` 后的值。
3. 使 `c` 在测试已知成立的作用域内可用。

绑定操作由运行时使用与受检类型转换（`checkcast` 字节码）相同的机制执行，因此与 `(Circle) shape` 在语义上没有区别。不同之处完全在于该转换相对于程序员书写内容的位置：JVM 隐式地完成了它，结果被赋予了你选择的名称，而不是你不得不发明的名称。

重写原始示例：

```java
public double computeArea(Shape shape) {
    if (shape instanceof Circle c) {
        return Math.PI * c.radius() * c.radius();
    } else if (shape instanceof Rectangle r) {
        return r.width() * r.height();
    } else if (shape instanceof Triangle t) {
        return 0.5 * t.base() * t.height();
    }
    throw new IllegalArgumentException("Unknown shape: " + shape);
}
```

类型转换的行消失了。每个分支都是自包含的。模式变量 `c`、`r` 和 `t` 不会污染彼此的作用域（我们将在下一节中看到这一点）。

---

## 3.3 模式变量的作用域——流敏感类型详解

模式变量的作用域规则是 JEP 394 中智识上最有趣的部分，因为它们使用了**确定赋值**（Definite Assignment）分析——Java 用来确保局部变量在使用前已初始化的相同底层机制——但在此基础上扩展了**流敏感类型**（Flow-Sensitive Typing）。

编译器会在控制流图（Control Flow Graph）中的每个点追踪模式变量是否被**确定赋值**。规则如下：

- 由 `e instanceof T v` 引入的模式变量在区域 R 中处于作用域内，当且仅当 `e instanceof T` 在 R 中确定为 true。

这听起来很抽象，让我们通过示例来建立直觉。

```java
// Pattern variable in scope only inside the if-block
public void inspect(Object obj) {
    if (obj instanceof String s) {
        System.out.println(s.length()); // s is in scope here
    }
    // s is NOT in scope here — the compiler rejects any reference to s
}
```

作用域不会扩展到闭合大括号之后，因为编译器无法保证在那个点上 `obj` 是 `String`。

现在考虑 `else` 分支：

```java
public void inspectElse(Object obj) {
    if (obj instanceof String s) {
        System.out.println("String of length: " + s.length());
    } else {
        // s is NOT in scope here, which makes perfect sense:
        // in the else branch, obj is definitely NOT a String
        System.out.println("Not a String");
    }
}
```

`s` 的作用域被限制在 `true` 分支中。这是正确的行为：在 `else` 分支中，`s` 将是未绑定的。

更微妙的是提前返回惯用法（Early-Return Idiom）：

```java
public void processString(Object obj) {
    if (!(obj instanceof String s)) {
        return; // or throw
    }
    // s IS in scope here, because we only reach this point
    // if obj instanceof String was true
    System.out.println(s.toUpperCase());
    System.out.println(s.length());
}
```

这就是守卫子句模式（Guard-Clause Pattern），Java 17 完全支持它。在提前返回之后，编译器知道 `obj instanceof String` 必定为 true，因此 `s` 是确定已赋值的。这与允许你在 `if (x == null) throw ...` 之后使用变量的推理逻辑完全相同。

作用域规则是递归的，并能正确处理嵌套情况：

```java
public void nestedScope(Object outer, Object inner) {
    if (outer instanceof Container container) {
        if (inner instanceof Payload payload) {
            container.add(payload); // both in scope
        }
        // payload NOT in scope here
        container.seal();           // container still in scope
    }
    // neither container nor payload in scope here
}
```

---

## 3.4 在条件表达式中使用模式变量：&& 和 ||

`&&` 运算符具有短路求值特性：只有当左操作数为 `true` 时，才会计算右操作数。编译器利用这一特性将模式变量的作用域扩展到 `&&` 的右操作数中：

```java
// Pattern variable usable in the same condition via &&
public boolean isNonEmptyString(Object obj) {
    return obj instanceof String s && !s.isEmpty();
    // s is in scope on the right of && because:
    // the right side is only evaluated when obj instanceof String is true
}
```

这种写法非常优雅。你可以在不引入中间变量的情况下表达多条件测试：

```java
public boolean isValidEmailAddress(Object obj) {
    return obj instanceof String s
        && s.contains("@")
        && s.length() > 5
        && !s.startsWith("@")
        && !s.endsWith("@");
}
```

`||` 运算符的语义恰好相反：当左操作数为 `false` 时，才会计算右操作数。在 `||` 的左操作数中引入的模式变量不在右操作数的作用域内，因为只有当左侧测试失败时（即模式未匹配时）才会到达右侧：

```java
// This does NOT compile — s is not in scope after ||
// public boolean bad(Object obj) {
//     return obj instanceof String s || s.isEmpty(); // ERROR
// }

// But this is fine — both branches contribute to the union
public boolean isStringOrNumber(Object obj) {
    return obj instanceof String || obj instanceof Number;
}
```

`&&` 和 `||` 之间的不对称性是确定赋值规则的必然结果，与 Java 已有的布尔短路求值（Short-Circuit Evaluation）处理方式完全一致。这不是任意的规定——它直接源于语义本身。

---

## 3.5 取反：! 运算符与模式的配合

取反（Negation）会翻转作用域规则。当你对一个 `instanceof` 检查取反时，模式变量会在原始测试本应为 `false` 的区域中处于作用域内：

```java
// Guard clause with negated pattern
public String extractUpperCase(Object obj) {
    if (!(obj instanceof String s)) {
        throw new IllegalArgumentException("Expected String, got: "
            + (obj == null ? "null" : obj.getClass().getName()));
    }
    // s is definitely assigned here — the negation + early exit
    // establishes that we only reach this line when the match succeeded
    return s.toUpperCase();
}
```

这是使用模式匹配编写前置条件检查（Precondition Check）的惯用方式。它的阅读体验与传统的 `Objects.requireNonNull` 模式完全一致，并能自然地与现有的代码规范集成。

`!` 与 `||` 之间的交互值得注意：

```java
// Using De Morgan's law with pattern variables
public void requireStringOrNumber(Object obj) {
    // NOT recommended — confusing and doesn't compile as you might expect
    // if (!(obj instanceof String s || obj instanceof Number n)) { ... }

    // Preferred: explicit and clear
    if (!(obj instanceof String) && !(obj instanceof Number)) {
        throw new IllegalArgumentException("Unsupported type");
    }
    // Now handle the types separately
    if (obj instanceof String s) {
        handleString(s);
    } else if (obj instanceof Number n) {
        handleNumber(n);
    }
}
```

---

## 3.6 方法中的模式匹配：类似访问者模式的分派

在模式匹配出现之前，对类型层次结构（Type Hierarchy）进行分派的经典方式是访问者模式（Visitor Pattern）。它功能强大但代价不菲：它要求修改层次结构中的每一个类以接受一个访问者，增加了大量样板代码，将层次结构与访问者接口耦合在一起，并且经常涉及让新手困惑的双重分派（Double-Dispatch）机制。

模式匹配提供了一种轻量级的替代方案，当你不拥有该层次结构的所有权或者分派逻辑是局部性的时候，这种方案非常合适：

```java
// Domain model — imagine this is in a library you don't own
public sealed interface Notification
    permits EmailNotification, SmsNotification, PushNotification {}

public record EmailNotification(String to, String subject, String body)
    implements Notification {}

public record SmsNotification(String phoneNumber, String message)
    implements Notification {}

public record PushNotification(String deviceToken, String title, String payload)
    implements Notification {}

// Dispatcher using pattern matching — no Visitor needed
public class NotificationDispatcher {

    public void dispatch(Notification notification) {
        if (notification instanceof EmailNotification email) {
            sendEmail(email.to(), email.subject(), email.body());
        } else if (notification instanceof SmsNotification sms) {
            sendSms(sms.phoneNumber(), sms.message());
        } else if (notification instanceof PushNotification push) {
            sendPush(push.deviceToken(), push.title(), push.payload());
        } else {
            throw new UnsupportedOperationException(
                "No handler for notification type: "
                + notification.getClass().getSimpleName());
        }
    }

    private void sendEmail(String to, String subject, String body) {
        System.out.printf("EMAIL to=%s subject=%s%n", to, subject);
    }

    private void sendSms(String phone, String message) {
        System.out.printf("SMS to=%s message=%s%n", phone, message);
    }

    private void sendPush(String token, String title, String payload) {
        System.out.printf("PUSH token=%s title=%s%n", token, title);
    }
}
```

在 Java 21+ 中，带有模式 case 的 `switch` 表达式使这一写法变得更加优雅——但 `instanceof` 链对于非层次化场景来说，相比它所替代的访问者模式已经是一个巨大的改进。

---

## 3.7 与 switch 的结合（Java 17 中的预览特性）——前瞻

Java 17 将 `switch` 的模式匹配作为预览特性（Preview Feature）发布（JEP 406）。虽然 switch 模式的完整讨论属于后续章节，但理解 `instanceof` 链与 `switch` 之间的关系是重要的背景知识。

`instanceof` 链：

```java
public String format(Object value) {
    if (value instanceof Integer i) return "int: " + i;
    if (value instanceof Long l)    return "long: " + l;
    if (value instanceof Double d)  return "double: " + d;
    if (value instanceof String s)  return "string: " + s;
    return "unknown: " + value;
}
```

在 Java 21（正式版）中变为：

```java
public String format(Object value) {
    return switch (value) {
        case Integer i -> "int: " + i;
        case Long l    -> "long: " + l;
        case Double d  -> "double: " + d;
        case String s  -> "string: " + s;
        default        -> "unknown: " + value;
    };
}
```

`switch` 版本不仅更短——当选择器类型（Selector Type）是密封类型（Sealed Type）或枚举（Enum）时，它还具备穷尽性检查（Exhaustiveness Checking）。编译器会在你遗漏某个 case 时告知你。`instanceof` 链则无法提供这种保证。

从 `instanceof` 到 `switch`，再到带有守卫模式（Guarded Patterns）的 `switch`，这是 Java 模式匹配故事的演进弧线。JEP 394 是这一切的基础。

---

## 3.8 模式匹配中的 null 处理

现有的 `instanceof` 运算符对 `null` 返回 `false`，模式匹配完全保留了这一语义：

```java
// null is never matched by any type pattern
public void handlePossiblyNull(Object obj) {
    if (obj instanceof String s) {
        // obj cannot be null here; null instanceof String is false
        System.out.println("String: " + s);
    } else {
        // obj could be null here
        System.out.println("Not a string (or null): " + obj);
    }
}
```

在几乎所有情况下这都是正确的行为：你不希望 null 匹配任何类型模式，因为将 null 值绑定到有类型的模式变量上是危险的。但你需要意识到其后果：如果你想显式处理 null，必须单独进行。

```java
// Explicit null handling before the instanceof check
public String describe(Object obj) {
    if (obj == null) {
        return "null value";
    }
    if (obj instanceof String s) {
        return "String with " + s.length() + " characters";
    }
    if (obj instanceof Number n) {
        return "Number: " + n.doubleValue();
    }
    return "Unknown type: " + obj.getClass().getSimpleName();
}
```

在 Java 21 的 `switch` 中，有一个专用的 `case null` 标签可以使这一处理更加简洁。但对于 Java 17 中的 `instanceof` 链，在顶部进行显式 null 检查是规范的做法。

---

## 3.9 模式匹配与泛型：类型擦除的考量

Java 的类型擦除（Type Erasure）与模式匹配之间存在着微妙的交互，每一位经验丰富的工程师都必须理解这一点。

在运行时，泛型类型参数（Generic Type Parameter）会被擦除。`List<String>` 和 `List<Integer>` 在字节码（Bytecode）层面都只是 `List`。模式匹配操作的是运行时类型，因此你不能在类型模式中使用参数化类型（Parameterized Type）：

```java
// THIS DOES NOT COMPILE
// The compiler rejects unchecked type patterns with generic parameters
// if (obj instanceof List<String> ls) { ... }  // compile error

// This compiles, but with an unchecked warning in some contexts:
public void processCollection(Object obj) {
    if (obj instanceof List<?> list) {
        // list is List<?> — safe, but you lose the element type
        System.out.println("List with " + list.size() + " elements");
    }
}
```

通配符（Wildcard）`List<?>` 在这里是你的好帮手。它允许你匹配原始结构而不对元素类型做出未经检查的断言。

如果你需要处理元素类型，要么对各个元素使用 `instanceof`，要么在分支内部使用未检查的类型转换并添加 `@SuppressWarnings`：

```java
@SuppressWarnings("unchecked")
public List<String> toStringList(Object obj) {
    if (obj instanceof List<?> rawList && !rawList.isEmpty()
            && rawList.get(0) instanceof String) {
        // Reasonably safe: we checked the first element.
        // In production, you'd want to verify all elements.
        return (List<String>) rawList;
    }
    throw new ClassCastException("Expected List<String>");
}
```

这是类型擦除的根本性限制，而非模式匹配的局限。模式匹配在这种情况下做了最好的处理——使 `List<?>` 使用起来很方便，并且立即给你一个命名变量。

数组不受类型擦除的影响；它们的元素类型在运行时是可具化类型（Reifiable Type）：

```java
public void handleArray(Object obj) {
    if (obj instanceof String[] strings) {
        // Fully type-safe — String[] is a reifiable type
        System.out.println("String array with " + strings.length + " elements");
        for (String s : strings) {
            System.out.println("  - " + s);
        }
    }
}
```

---

## 3.10 实际应用场景：JSON 处理、命令分派、事件处理

### JSON 处理

考虑一个轻量级的 JSON 模型，其中解析后的值表示为 `Object`。这在底层 JSON 库中很常见，或者当你从动态反序列化层接收到 `Object` 时也会遇到：

```java
public class JsonRenderer {

    /**
     * Converts a loosely-typed JSON value tree to a formatted string.
     * The tree consists of: null, Boolean, Long, Double, String,
     * List<Object>, and Map<String, Object>.
     */
    public String render(Object value, int indent) {
        String pad = " ".repeat(indent * 2);
        if (value == null) {
            return "null";
        }
        if (value instanceof Boolean b) {
            return b.toString();
        }
        if (value instanceof Long l) {
            return l.toString();
        }
        if (value instanceof Double d) {
            return d.toString();
        }
        if (value instanceof String s) {
            return "\"" + escape(s) + "\"";
        }
        if (value instanceof List<?> list) {
            if (list.isEmpty()) return "[]";
            var sb = new StringBuilder("[\n");
            for (int i = 0; i < list.size(); i++) {
                sb.append(pad).append("  ").append(render(list.get(i), indent + 1));
                if (i < list.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append(pad).append("]");
            return sb.toString();
        }
        if (value instanceof Map<?, ?> map) {
            if (map.isEmpty()) return "{}";
            var sb = new StringBuilder("{\n");
            var entries = new java.util.ArrayList<>(map.entrySet());
            for (int i = 0; i < entries.size(); i++) {
                var entry = entries.get(i);
                sb.append(pad).append("  ")
                  .append("\"").append(entry.getKey()).append("\": ")
                  .append(render(entry.getValue(), indent + 1));
                if (i < entries.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append(pad).append("}");
            return sb.toString();
        }
        throw new IllegalArgumentException("Unsupported JSON value type: "
            + value.getClass());
    }

    private String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\t", "\\t");
    }
}
```

### 命令分派

命令总线（Command Bus）和 CQRS 架构从模式匹配分派中受益巨大：

```java
// Command hierarchy
public sealed interface AccountCommand
    permits OpenAccount, DepositFunds, WithdrawFunds, CloseAccount {}

public record OpenAccount(String accountId, String ownerName, String currency)
    implements AccountCommand {}

public record DepositFunds(String accountId, java.math.BigDecimal amount)
    implements AccountCommand {}

public record WithdrawFunds(String accountId, java.math.BigDecimal amount)
    implements AccountCommand {}

public record CloseAccount(String accountId, String reason)
    implements AccountCommand {}

// Command handler
public class AccountCommandHandler {

    public CommandResult handle(AccountCommand command) {
        if (command instanceof OpenAccount open) {
            return openAccount(open.accountId(), open.ownerName(), open.currency());
        }
        if (command instanceof DepositFunds deposit) {
            return depositFunds(deposit.accountId(), deposit.amount());
        }
        if (command instanceof WithdrawFunds withdraw) {
            return withdrawFunds(withdraw.accountId(), withdraw.amount());
        }
        if (command instanceof CloseAccount close) {
            return closeAccount(close.accountId(), close.reason());
        }
        throw new UnsupportedOperationException(
            "No handler for: " + command.getClass().getSimpleName());
    }

    private CommandResult openAccount(String id, String owner, String currency) {
        System.out.printf("Opening account %s for %s in %s%n", id, owner, currency);
        return CommandResult.success();
    }

    private CommandResult depositFunds(String id, java.math.BigDecimal amount) {
        System.out.printf("Depositing %s into %s%n", amount, id);
        return CommandResult.success();
    }

    private CommandResult withdrawFunds(String id, java.math.BigDecimal amount) {
        System.out.printf("Withdrawing %s from %s%n", amount, id);
        return CommandResult.success();
    }

    private CommandResult closeAccount(String id, String reason) {
        System.out.printf("Closing account %s because: %s%n", id, reason);
        return CommandResult.success();
    }
}

public record CommandResult(boolean success, String message) {
    public static CommandResult success() {
        return new CommandResult(true, "OK");
    }
    public static CommandResult failure(String message) {
        return new CommandResult(false, message);
    }
}
```

### 事件处理

领域事件（Domain Event）处理是另一个天然契合的场景：

```java
public sealed interface DomainEvent
    permits UserRegistered, UserEmailChanged, UserDeactivated {}

public record UserRegistered(String userId, String email, java.time.Instant at)
    implements DomainEvent {}

public record UserEmailChanged(String userId, String oldEmail, String newEmail)
    implements DomainEvent {}

public record UserDeactivated(String userId, String reason)
    implements DomainEvent {}

public class UserEventProjection {

    private final java.util.Map<String, UserView> users = new java.util.HashMap<>();

    public void apply(DomainEvent event) {
        if (event instanceof UserRegistered reg) {
            users.put(reg.userId(),
                new UserView(reg.userId(), reg.email(), true));
        } else if (event instanceof UserEmailChanged change) {
            users.computeIfPresent(change.userId(), (id, view) ->
                new UserView(id, change.newEmail(), view.active()));
        } else if (event instanceof UserDeactivated deactivated) {
            users.computeIfPresent(deactivated.userId(), (id, view) ->
                new UserView(id, view.email(), false));
        }
    }

    public java.util.Optional<UserView> findUser(String userId) {
        return java.util.Optional.ofNullable(users.get(userId));
    }
}

public record UserView(String userId, String email, boolean active) {}
```

---

## 3.11 性能考量：与传统 instanceof+cast 相比无额外开销

在采用新语法时，一个合理的顾虑是它是否会改变性能特征。对于 `instanceof` 的模式匹配，答案是否定的：与传统的 `instanceof` 加显式类型转换相比，没有任何额外开销。

JVM 在两种情况下都执行一次类型检查。旧式惯用写法：

```java
if (shape instanceof Circle) {
    Circle c = (Circle) shape; // second type check at bytecode level
    ...
}
```

实际上执行了两次类型检查：一次是 `instanceof`，另一次是 `(Circle)` 类型转换。JIT 编译器（JIT Compiler）可以消除这个冗余检查（而且几乎总是这样做），但在源代码层面它是冗余的。模式匹配只产生一次 `instanceof` 检查和一次类型转换，且不需要 null 检查（因为 `instanceof` 已经排除了 null），从而产生相同或略优的字节码体积。

你可以通过检查编译后的字节码来验证这一点。对于模式匹配版本，`javap -c` 将显示一条 `instanceof` 指令后跟一条 `checkcast` 或等效的优化指令，与旧式惯用写法经过 JIT 消除后产生的结果完全一致。没有新的额外开销。

模式变量只是栈帧（Stack Frame）中的一个局部变量槽（Local Variable Slot），其分配方式与任何局部变量相同。绑定操作的成本与一次赋值相当。

---

## 3.12 模式匹配与接口和抽象类

模式匹配不仅限于具体类（Concrete Class）。你可以像使用传统 `instanceof` 一样，对接口（Interface）和抽象类（Abstract Class）进行匹配：

```java
public interface Serializable {}
public interface Auditable { java.time.Instant lastModified(); }
public abstract class BaseEntity implements Serializable {
    public abstract String id();
}

public record Order(String id, java.math.BigDecimal total,
                    java.time.Instant lastModified)
    extends BaseEntity implements Auditable {}

public record Customer(String id, String name,
                       java.time.Instant lastModified)
    extends BaseEntity implements Auditable {}

public class AuditLogger {

    public void logIfAuditable(Object entity) {
        if (entity instanceof Auditable auditable) {
            System.out.println("Last modified: " + auditable.lastModified());
        }
    }

    public void logEntityInfo(Object obj) {
        if (obj instanceof BaseEntity entity && obj instanceof Auditable auditable) {
            System.out.printf("Entity %s last modified %s%n",
                entity.id(), auditable.lastModified());
        }
    }

    // More specific dispatch
    public String summarize(Object obj) {
        if (obj instanceof Order o) {
            return "Order " + o.id() + " total=" + o.total();
        }
        if (obj instanceof Customer c) {
            return "Customer " + c.id() + " name=" + c.name();
        }
        if (obj instanceof Auditable a) {
            return "Auditable entity last modified " + a.lastModified();
        }
        return "Unknown entity";
    }
}
```

注意 `summarize` 中的顺序：更具体的类型排在前面。如果 `Auditable` 出现在 `Order` 之前，那么对于 `Order` 实例，`Order` 分支将永远不会被执行，因为 `Order` 实现了 `Auditable`。这与传统 `instanceof` 链中的排序关注点相同，也是 `switch` 与密封类型结合提供穷尽性检查的一个重要动机。

---

## 3.13 迁移指南：转换现有的 instanceof 链

将现有代码迁移为使用模式匹配是机械化且安全的。以下是一个系统化的方法。

**第一步：识别目标模式。** 查找以下结构：

```java
if (x instanceof SomeType) {
    SomeType st = (SomeType) x;
    // use st
}
```

**第二步：应用转换。** 替换为：

```java
if (x instanceof SomeType st) {
    // use st
}
```

**第三步：移除不再使用的局部变量。** 显式的类型转换变量已经消失；删除它。

**第四步：寻找作用域缩窄的机会。** 如果局部变量仅在分支内使用，那么作用域已经是正确的。如果它在方法后续的地方被引用，且迁移后这种引用不应编译通过，那么这是一个值得修复的代码坏味道（Code Smell）。

考虑一个真实的配置读取器（Configuration Reader）的前后对比：

```java
// BEFORE: Classic instanceof-cast idiom
public String renderConfigValue(ConfigValue value) {
    String result;
    if (value instanceof StringValue) {
        StringValue sv = (StringValue) value;
        result = sv.get();
    } else if (value instanceof IntValue) {
        IntValue iv = (IntValue) value;
        result = String.valueOf(iv.get());
    } else if (value instanceof BooleanValue) {
        BooleanValue bv = (BooleanValue) value;
        result = bv.get() ? "true" : "false";
    } else if (value instanceof ListValue) {
        ListValue lv = (ListValue) value;
        result = lv.items().stream()
                   .map(this::renderConfigValue)
                   .collect(java.util.stream.Collectors.joining(", ", "[", "]"));
    } else {
        result = "<unknown>";
    }
    return result;
}

// AFTER: Pattern matching
public String renderConfigValue(ConfigValue value) {
    if (value instanceof StringValue sv) {
        return sv.get();
    } else if (value instanceof IntValue iv) {
        return String.valueOf(iv.get());
    } else if (value instanceof BooleanValue bv) {
        return bv.get() ? "true" : "false";
    } else if (value instanceof ListValue lv) {
        return lv.items().stream()
                  .map(this::renderConfigValue)
                  .collect(java.util.stream.Collectors.joining(", ", "[", "]"));
    }
    return "<unknown>";
}
```

`result` 累加变量消失了。每个分支直接返回。方法更短了，逻辑更清晰了，每个模式变量的作用域也是最小化的。

**第五步：考虑未来向 switch 的迁移。** 如果类型层次结构是密封的或逻辑上封闭的，请标记此迁移以便在采用 Java 21+ 特性时进行后续处理。`instanceof` 链可以干净地转换为带有穷尽性检查的 `switch` 表达式。

**自动化迁移。** IntelliJ IDEA 和 Eclipse 都提供了针对此转换的自动检查和快速修复。IntelliJ 的检查项"Pattern variable can be used"会高亮显示所有符合条件的 `instanceof`-cast 惯用写法，并提供一键替换。在大型代码库中可以将其用作发现工具，但要逐一审查每次转换：偶尔现有的变量名称与自动工具所选择的名称有意不同，或者作用域的变化可能有影响。

---

## 3.14 总结

`instanceof` 的模式匹配（JEP 394）是一个聚焦且设计精良的语言特性，它消除了 Java 代码中一个特定且普遍存在的冗余和错误来源。关键要点：

- **模式变量**将类型测试和绑定合并为单一的语法结构，移除了编译器之前要求的冗余显式类型转换。

- **作用域规则**基于确定赋值和流敏感类型。模式变量仅在编译器能够证明匹配成功的地方可用。这防止了一类新的变量误用缺陷。

- **`&&` 扩展作用域**到右操作数，因为短路求值保证了匹配在那里成立。`||` 不会将作用域扩展到右操作数，因为右侧是在左侧失败时才被求值的。

- **取反**（`!`）和提前返回支持守卫子句模式，使模式匹配成为前置条件检查的惯用方式。

- **Null** 永远不会被任何类型模式匹配，保持了 `instanceof` 现有的 null 安全语义。

- **泛型和类型擦除**限制类型模式只能用于可具化类型。使用 `List<?>` 及类似通配符来匹配泛型容器。

- **无性能开销**：模式匹配编译为与传统惯用写法等价的字节码，没有额外的运行时成本。

- **迁移是机械化的**，并且有 IDE 快速修复的支持。优先处理包含多个 `instanceof`-cast 惯用写法的方法，以获得最大的可读性提升。

`instanceof` 的模式匹配是第一步。它的作用域规则、语法和语义构成了 `switch` 中模式匹配（第六章）、记录模式（第七章）以及 Java 25 中即将到来的完全组合式模式匹配的基础。现在投入理解这些基础知识的精力，将在本书的剩余部分中带来持续的回报。

---

*第四章将继续介绍文本块（Text Blocks），这是 Java 17 的另一个基石特性，它解决了一个不同但同样普遍的 Java 冗余问题。*


---

# 第4章：深入理解文本块

文本块（Text Blocks）（JEP 378，在 Java 15 中正式定稿，Java 17 中可用）乍看之下似乎很简单——它们只是具有更优雅语法的多行字符串。但其中蕴含着真正的深度：缩进算法（indentation algorithm）、转义序列（escape sequences）以及组合模式使文本块成为一个强大的工具，资深开发者应当充分理解它，而非仅仅一扫而过。

---

## 4.1 文本块出现之前的字符串字面量：转义地狱

在文本块出现之前，在 Java 代码中嵌入结构化文本是一件痛苦的事情：

```java
// Embedding JSON: escape every quote, add \n, concatenate
String json = "{\n" +
              "  \"customerId\": \"" + customerId + "\",\n" +
              "  \"items\": [\n" +
              "    {\"productId\": \"" + productId + "\", \"qty\": " + qty + "}\n" +
              "  ]\n" +
              "}";

// Embedding SQL: same problem, harder to read
String sql = "SELECT o.id, o.created_at, c.name, c.email\n" +
             "FROM orders o\n" +
             "JOIN customers c ON o.customer_id = c.id\n" +
             "WHERE o.status = 'PENDING'\n" +
             "  AND o.created_at > ?\n" +
             "ORDER BY o.created_at DESC\n" +
             "LIMIT 100";
```

这段代码在技术上是正确的，但在视觉上却令人痛苦。每个双引号都必须转义，每个换行符都需要显式声明，而嵌入文本的实际结构被 Java 语法噪音所淹没。

---

## 4.2 语法：三引号定界符

文本块以 `"""` 开头，后跟可选的空白符和一个换行符，并以 `"""` 结尾：

```java
// The opening """ MUST be followed by a newline
String json = """
        {
          "customerId": "C-001",
          "status": "ACTIVE"
        }
        """;
```

关键规则：
- 开头的 `"""` 之后不能在同一行上跟随内容
- 结尾的 `"""` 决定了缩进基线（参见第 4.3 节）
- 结果是一个 `String`——没有新类型，完全兼容所有接受 `String` 的地方

使用文本块后，我们的 SQL 查询变成了：

```java
String sql = """
        SELECT o.id, o.created_at, c.name, c.email
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.status = 'PENDING'
          AND o.created_at > ?
        ORDER BY o.created_at DESC
        LIMIT 100
        """;
```

---

## 4.3 附带空白与必要空白：缩进算法

这是文本块中最重要但最不被理解的方面。编译器区分以下两种空白：

- **附带空白（incidental whitespace）**：为使文本块与周围代码对齐而添加的缩进
- **必要空白（essential whitespace）**：实际属于字符串内容一部分的空白

该算法确定"公共前导空白前缀"（common leading whitespace prefix）并从每一行中剥离它。**结尾 `"""` 的位置**是关键：

```java
// Case 1: closing """ on its own line at column 8
// All 8 leading spaces are stripped
String a = """
        Hello
        World
        """;
// Result: "Hello\nWorld\n"

// Case 2: closing """ at column 0 — no stripping
String b = """
        Hello
        World
""";
// Result: "        Hello\n        World\n"

// Case 3: closing """ inline with content
String c = """
        Hello
        World""";
// Result: "        Hello\n        World"  (no trailing newline!)
```

实用模式：**将结尾 `"""` 放在单独一行，缩进到与内容相同的层级**。这样可以得到干净的、无填充的内容：

```java
public String buildQuery(String tableName) {
    return """
            SELECT *
            FROM %s
            WHERE active = true
            """.formatted(tableName);
    // Result: "SELECT *\nFROM %s\nWHERE active = true\n"
    // (leading 12 spaces stripped, matching the closing """ position)
}
```

---

## 4.4 行终止符处理

文本块始终将行尾规范化为 `\n`（LF），无论运行在什么平台上。这对于跨平台一致性至关重要：

```java
// Always LF, even on Windows
String block = """
        line one
        line two
        """;
assert block.equals("line one\nline two\n");
```

如果你需要在文本块输出中使用 Windows 风格的行尾（CRLF），请显式使用 `\r` 转义：

```java
String withCRLF = """
        line one\r
        line two\r
        """;
```

---

## 4.5 新转义序列：`\<行终止符>` 和 `\s`

Java 14+ 专门为文本块新增了两个转义序列：

### `\` —— 行续接（抑制换行）

```java
// Without line continuation: a newline after each line
String withNewlines = """
        The quick brown fox
        jumps over the lazy dog
        """;
// "The quick brown fox\njumps over the lazy dog\n"

// With \: suppress the newline, logically join lines
String singleLine = """
        The quick brown fox \
        jumps over the lazy dog
        """;
// "The quick brown fox jumps over the lazy dog\n"
```

当字符串在逻辑上是单行，但你希望为了可读性而换行时，这个特性非常有用。

### `\s` —— 显式空格（保留行尾空白）

编译器默认会剥离每行的行尾空白。`\s` 代表一个空格，并防止其左侧的空白被剥离：

```java
// Trailing spaces stripped:
String padded = """
        red
        green
        blue
        """;
// "red\ngreen\nblue\n"  (trailing spaces gone)

// \s preserves trailing spaces:
String preserved = """
        red  \s
        green\s
        blue \s
        """;
// "red   \ngreen \nblue  \n"  (spaces before \s are preserved)
```

当文本块内容用于对精确间距有要求的场景时（协议消息、定宽格式），这个特性非常有用。

---

## 4.6 文本块与常见数据格式

### JSON

```java
record CreateUserRequest(String name, String email, String role) {
    String toJson() {
        return """
                {
                  "name": "%s",
                  "email": "%s",
                  "role": "%s"
                }
                """.formatted(name, email, role);
    }
}

// Usage in tests: expected JSON for assertion
String expectedJson = """
        {
          "id": "U-001",
          "name": "Alice",
          "status": "ACTIVE"
        }
        """;
```

### SQL

```java
String findActiveOrdersSql = """
        SELECT
            o.id          AS order_id,
            o.created_at  AS placed_at,
            c.name        AS customer_name,
            SUM(oi.price * oi.quantity) AS total
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status IN ('PENDING', 'CONFIRMED')
          AND o.created_at BETWEEN :from AND :to
        GROUP BY o.id, o.created_at, c.name
        ORDER BY o.created_at DESC
        """;
```

### HTML

```java
String emailBody(String name, String confirmationLink) {
    return """
            <!DOCTYPE html>
            <html lang="en">
            <body>
              <h1>Welcome, %s!</h1>
              <p>Please confirm your email:</p>
              <a href="%s">Confirm Email</a>
            </body>
            </html>
            """.formatted(name, confirmationLink);
}
```

### XML / YAML

```java
String kubernetesDeployment(String appName, String image, int replicas) {
    return """
            apiVersion: apps/v1
            kind: Deployment
            metadata:
              name: %s
            spec:
              replicas: %d
              template:
                spec:
                  containers:
                  - name: %s
                    image: %s
            """.formatted(appName, replicas, appName, image);
}
```

---

## 4.7 文本块与 String.formatted() 及 String 方法

文本块是 `String` 实例，可以与所有 `String` 方法配合使用：

```java
// String.formatted() — Java 15+ instance method (cleaner than String.format())
String greeting = """
        Dear %s,

        Your order #%s has been shipped.
        Expected delivery: %s

        Thank you for shopping with us.
        """.formatted(customerName, orderId, deliveryDate);

// String.stripIndent() — manual indentation stripping (for dynamically built strings)
String dynamic = "\t\tline one\n\t\tline two\n";
System.out.println(dynamic.stripIndent()); // "line one\nline two\n"

// String.translateEscapes() — process escape sequences in dynamically built strings
String withEscape = "Hello\\nWorld";
System.out.println(withEscape.translateEscapes()); // "Hello\nWorld"
```

---

## 4.8 文本块在测试代码中的应用

文本块在测试代码中最能大放异彩——期望值变得可读性极强：

```java
@Test
void shouldReturnJsonRepresentation() {
    var user = new User("U-001", "Alice", "alice@example.com");

    String actualJson = userSerializer.toJson(user);

    String expectedJson = """
            {
              "id": "U-001",
              "name": "Alice",
              "email": "alice@example.com"
            }
            """.stripTrailing();  // Remove trailing newline if needed

    assertThat(actualJson).isEqualToIgnoringWhitespace(expectedJson);
}

@Test
void shouldExecuteCorrectQuery() {
    String expectedSql = """
            SELECT u.id, u.name
            FROM users u
            WHERE u.active = true
            """;

    verify(jdbcTemplate).query(
        eq(expectedSql.strip()),
        any(RowMapper.class)
    );
}
```

---

## 4.9 多行字符串对齐策略

有时你需要文本块的对齐方式与包围它的代码不同：

```java
class EmailBuilder {
    // The text block content will be aligned to the left margin
    // even though the class is indented
    String buildTemplate() {
        return """
                Subject: Your Order Update

                Dear Customer,

                Your order has been processed.
                """;
        // With 16-space indentation, that's stripped off.
        // Result starts with "Subject: Your Order Update\n..."
    }
}
```

对于文本块内部的多级缩进（例如包含嵌套对象的 JSON），块内的缩进会作为*必要空白*被保留：

```java
String nestedJson = """
        {
          "order": {
            "id": "O-001",
            "items": [
              {"sku": "A1", "qty": 2},
              {"sku": "B2", "qty": 1}
            ]
          }
        }
        """;
// The internal 2-space and 4-space indentation is preserved
```

---

## 4.10 常见陷阱

### 行尾空白的不可见性

IDE 自动格式化工具通常会剥离行尾空白。如果你的文本块内容需要行尾空格，请使用 `\s` 来防止意外剥离。

### 结尾 `"""` 的位置至关重要

```java
// Common mistake: closing """ at column 0 adds unwanted indentation
String bad = """
    hello
    world
""";
// Includes 4 leading spaces on each line! "    hello\n    world\n"

// Correct: closing """ matches content indentation
String good = """
    hello
    world
    """;
// "hello\nworld\n"
```

### 结尾 `"""` 内联时没有尾随换行

```java
String noTrailingNewline = """
        content""";
// "content" — no trailing \n

String withTrailingNewline = """
        content
        """;
// "content\n" — trailing \n present
```

保持一致：大多数调用方不关心尾随换行，但 SQL 驱动程序和 JSON 解析器可能会在意。如有疑问，请使用 `.strip()`。

### 源文件中的 Windows CRLF

如果你的源文件使用 CRLF 行尾（Windows 默认），文本块内容仍然会被规范化为 LF——编译器会处理这一点。这几乎总是正确的行为。

---

## 4.11 总结

文本块是 Java 字符串处理中一个简洁但有深度的新增特性：

- **消除转义噪音**，适用于多行 JSON、SQL、HTML、XML、YAML 及其他结构化格式
- **缩进算法**剥离公共前导空白；结尾 `"""` 的位置控制基线
- **新转义序列**：`\` 用于行续接，`\s` 用于显式空格保留
- **与 `String.formatted()` 无缝配合**，实现字符串插值（string interpolation）
- **在测试代码中影响最大**，使期望值成为可读的文档

请大胆采用文本块。任何时候当你发现自己在为结构化文本使用 `\n` 和 `\"` 进行字符串拼接时，文本块都能同时提升可读性和可维护性。


---

# 第5章：Switch 表达式与 Switch 的模式匹配

> **JEP 361**（正式版，Java 14）· **JEP 406**（预览版，Java 17）· **JEP 420**（第二次预览，Java 18）· **JEP 441**（正式版，Java 21）

`switch` 结构经历了 Java 历史上任何语言特性中最为剧烈的演变。从一个继承自 C 语言、饱受贯穿（fall-through）缺陷困扰的简陋语句，到一个功能完备的模式匹配表达式（pattern-matching expression）——能够替代级联的 `instanceof` 链——现代的 `switch` 已成为地道 Java 写法中的一等公民。本章将完整追溯这一演变历程，从经典语句的缺陷出发，一直到 Java 21 中最终定稿的穷尽性（exhaustive）、类型安全的模式匹配。

---

## 5.1 经典 Switch 语句：局限性与贯穿陷阱

在长达近三十年的时间里，Java 的 `switch` 语句沿用了从 C 语言继承的语义：执行流从匹配的 `case` 标签处进入，然后顺序穿过后续的每一个 case，直到遇到显式的 `break` 或到达代码块末尾。这种"贯穿"（fall-through）行为偶尔有用——例如将多个共享相同逻辑的值归为一组——但更多时候它是微妙且难以诊断的缺陷的根源。

来看这个经典的"自坑"示例：

```java
// Example 5.1 — Classic fall-through bug
int day = 3;
String type;

switch (day) {
    case 1:
        type = "Monday";    // intended: set type and stop
    case 2:
        type = "Tuesday";   // fall-through: overwrites the assignment above
    case 3:
        type = "Wednesday";
        break;
    default:
        type = "Other";
}
System.out.println(type); // "Wednesday" even when day == 1
```

`case 1` 处遗漏的 `break` 是静默的：编译器默认不会发出任何警告，而测试套件可能直到生产事故时才会发现它。静态分析工具能有所帮助，但语言本身不承担任何责任。

除了贯穿问题之外，经典的 `switch` 语句还有三个额外的局限性，随着 Java 向函数式（functional）风格演进，这些局限变得愈发痛苦：

1. **没有表达式语义。** `switch` 语句不能出现在赋值操作的右侧，也不能用作方法参数。每个分支都必须独立地赋值给一个预先声明的变量，这导致了冗长的模式——一个 `final` 局部变量无法通过 switch 初始化，除非放弃其 `final` 特性或借助辅助方法。

2. **选择器类型有限。** 在 Java 7 之前，仅支持整型。Java 7 增加了 `String` 支持，但 `float`、`double`、`boolean` 以及任意对象在模式匹配扩展到来之前仍被禁止使用。

3. **没有编译时穷尽性检查。** 对一个 `enum` 类型进行 `switch` 而没有 `default` 分支时，即使缺少某些 case，编译也能顺利通过。编译器可能会发出一个可选的警告，但当控制流到达缺失的 case 时，程序会静默地什么都不做。

这些局限不仅仅是不便。它们实际上推动开发者走向可读性更差、更难优化的 `if-else` 链。JDK 团队认识到了这一点，并开始系统性地加以解决，首先从 JEP 361 的 switch 表达式开始。

---

## 5.2 Switch 表达式（JEP 361）：箭头标签与 `yield`

JEP 361 在 Java 12 和 13 的预览期之后于 Java 14 正式定稿，引入了两项关键创新：

- **Switch 表达式（Switch expressions）**：一种能产生值的 `switch` 结构
- **箭头标签（Arrow labels）**（`case X ->`）：一种无贯穿的简洁 case 标签形式

箭头标签是更容易理解的变化。每个 `case X -> expression` 分支是自包含的：只有箭头右侧的表达式或代码块会执行。没有贯穿到下一个分支，不需要 `break`，也没有隐式的顺序执行。

```java
// Example 5.2 — Switch expression with arrow labels
int day = 3;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    case 6 -> "Saturday";
    case 7 -> "Sunday";
    default -> throw new IllegalArgumentException("Invalid day: " + day);
};
System.out.println(dayName); // "Wednesday"
```

有几点值得注意。整个 `switch` 块是一个表达式：它产生一个值（这里是 `String`），直接赋值给 `dayName`。`default` 分支抛出一个异常，这是合法的——表达式分支可以是一个 `throw` 语句。变量 `dayName` 可以声明为 `final`，因为 switch 表达式在一次确定的求值中完成初始化。

多个标签可以使用逗号分隔的列表共享同一个分支：

```java
// Example 5.3 — Multiple labels per arrow arm
String season = switch (month) {
    case 12, 1, 2  -> "Winter";
    case 3, 4, 5   -> "Spring";
    case 6, 7, 8   -> "Summer";
    case 9, 10, 11 -> "Autumn";
    default        -> throw new IllegalArgumentException("month=" + month);
};
```

这取代了之前需要多个贯穿 `case` 标签配合共享 `break` 点或使用 `Map` 查找的写法——可读性上的显著提升。

---

## 5.3 Switch 表达式 vs. Switch 语句：何时使用哪种

Switch 表达式的引入并不意味着 switch 语句被弃用。两种形式在 Java 中都仍然有效，而理解何时使用哪种是掌握现代 Java 的重要一环。

**使用 switch 表达式**，当：

- 每个 switch 分支都产生一个值，且你希望捕获该值。
- 你希望编译器强制穷尽性检查（参见第 5.5 节）。
- 各分支是没有副作用（side effects）的纯计算：领域转换、类别查找、返回新状态的状态机转换。

**使用 switch 语句**，当：

- 各 switch 分支执行有副作用的操作：写入数据库、发布事件、更新可变状态。
- 并非每个分支都需要产生相同类型的值。
- 你确实需要贯穿行为（罕见，但在 switch 表达式的冒号标签形式中仍然存在，尽管不推荐使用）。

```java
// Example 5.4 — Switch statement is appropriate for side effects
switch (event.type()) {
    case ORDER_PLACED   -> orderService.reserve(event.orderId());
    case ORDER_CANCELLED -> orderService.release(event.orderId());
    case ORDER_SHIPPED  -> notificationService.notifyShipped(event.orderId());
    default             -> log.warn("Unknown event type: {}", event.type());
}
```

请注意，箭头标签在 switch 语句中同样有效；它们在保持语句语义（不产生值）的同时消除了贯穿。这是所有新编写的 switch 语句的推荐风格——旧式冒号标签形式应当仅保留给需要有意贯穿的罕见情况，并且该意图应当用 `// falls through` 注释加以说明。

---

## 5.4 从 Switch 返回值：`yield` 关键字

当一个 switch 表达式分支需要不止一个表达式——当你需要在分支内部使用局部变量、循环或条件逻辑时——你可以使用块分支（block arm）配合 `yield` 关键字：

```java
// Example 5.5 — Block arms and yield
double discountedPrice = switch (customer.tier()) {
    case GOLD -> {
        double base = product.price();
        double discount = base * 0.20;
        yield base - discount;
    }
    case SILVER -> {
        double base = product.price();
        double discount = base * 0.10;
        yield base - discount;
    }
    case BRONZE -> product.price() * 0.95;
    case STANDARD -> product.price();
};
```

`yield` 语句退出块分支并提供整个 switch 表达式的值。它不是一个通用的 `return`；它仅在 switch 表达式分支内部有效。这个区别很重要：`yield` 不会退出包含它的方法，其作用域严格限于 switch 表达式内部。

`yield` 关键字的选择经过了慎重考虑。由于 `yield` 在 Java 14 之前不是保留关键字（reserved keyword），使用 `yield` 作为标识符的现有代码仍然能够编译——该关键字是上下文敏感的（context-sensitive）。编译器通过检查语法上下文来区分 `yield(value)`（对假设的 `yield` 方法的调用）和 `yield value;` 语句。

```java
// Example 5.6 — yield is context-sensitive; this still compiles in Java 17
int yield = 42;             // local variable named yield — valid
int result = switch (x) {
    case 0 -> yield;        // expression arm: returns the local variable yield
    default -> {
        yield yield + 1;    // block arm: yields the value of (yield + 1)
    }
};
```

虽然这能通过编译，但在新代码中将变量命名为 `yield` 会造成混淆，应当避免。

---

## 5.5 Switch 表达式中的穷尽性

Switch 表达式施加了一个 switch 语句所没有的约束：编译器要求 switch 必须是**穷尽的**（exhaustive）——选择器的每个可能值都必须被覆盖。这在编译时进行检查，未能覆盖所有情况会产生编译错误（compile error），而非警告。

对于基本类型选择器和 `String`，一个 `default` 分支可以简单地满足穷尽性。真正的好处体现在 `enum` 类型上：

```java
// Example 5.7 — Enum exhaustiveness
enum Status { PENDING, ACTIVE, SUSPENDED, CLOSED }

String label = switch (status) {
    case PENDING   -> "Awaiting activation";
    case ACTIVE    -> "Operational";
    case SUSPENDED -> "Temporarily unavailable";
    case CLOSED    -> "Account closed";
    // No default needed: all enum constants are covered
};
```

如果你向 `Status` 添加一个新常量——比如 `ARCHIVED`——编译器会立即标记所有对 `Status` 进行 switch 但缺少覆盖的 switch 表达式，将运行时的疏忽转变为编译时错误。这相比等效的 `if-else` 链或基于 `Map` 的分发有着深远的优势，后者在缺少条目时运行时会静默地什么都不做。

穷尽性保证是可选加入的（opt-in）：对枚举的 switch 语句不要求穷尽性。只有 switch 表达式才要求。这种不对称是有意为之的——它在保持向后兼容性的同时，当你选择表达式形式时提供更强的保证。

---

## 5.6 Switch 的模式匹配（JEP 406 —— Java 17 预览版）

JEP 406 在 Java 17 中以预览版引入，将 switch 选择器从仅限整型、字符串和枚举的狭窄集合扩展到**任意引用类型**（reference type），并将 case 标签从常量扩展到**模式**（patterns）。这是现代 Java 类型安全分发机制的基石。

要在 Java 17 中编译预览特性（preview features），必须在 `javac` 和 `java` 命令中传递 `--enable-preview` 标志：

```bash
# Compiling with preview features enabled (Java 17)
javac --enable-preview --release 17 PatternSwitch.java

# Running the compiled class
java --enable-preview PatternSwitch
```

借助 switch 的模式匹配，你可以在一个可读的结构中对对象的动态类型进行分发：

```java
// Example 5.8 — Pattern matching for switch (preview in Java 17)
// Compile with: javac --enable-preview --release 17
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
record Triangle(double base, double height) implements Shape {}

double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.width() * r.height();
        case Triangle t  -> 0.5 * t.base() * t.height();
    };
}
```

对比 Java 17 之前的等效写法：

```java
// Before pattern matching — verbose and error-prone
double area(Shape shape) {
    if (shape instanceof Circle c) {
        return Math.PI * c.radius() * c.radius();
    } else if (shape instanceof Rectangle r) {
        return r.width() * r.height();
    } else if (shape instanceof Triangle t) {
        return 0.5 * t.base() * t.height();
    } else {
        throw new IllegalArgumentException("Unknown shape: " + shape);
    }
}
```

switch 版本不仅更简洁；它在语义上也更丰富。编译器可以对密封类型（sealed types）验证穷尽性（如第 5.10 节所述），从而完全消除防御性的 `else` 分支。

---

## 5.7 Switch 中的类型模式

`case` 标签中的**类型模式**（type pattern）由一个类型和一个绑定变量（binding variable）组成：`case SomeType varName`。当选择器匹配该模式时，`varName` 被绑定为选择器值转换为 `SomeType` 后的结果，并且该绑定在分支的表达式或块内有效。

```java
// Example 5.9 — Type patterns with multiple reference types (Java 21+)
Object serialize(Object value) {
    return switch (value) {
        case Integer i    -> "INT:" + i;
        case Long l       -> "LONG:" + l;
        case Double d     -> "DBL:" + String.format("%.4f", d);
        case String s     -> "STR:" + s.length() + ":" + s;
        case int[] arr    -> "INT_ARR[" + arr.length + "]";
        case null         -> "NULL";
        default           -> "OBJ:" + value.getClass().getSimpleName();
    };
}
```

switch 中的类型模式遵循与 `instanceof` 中模式相同的支配规则（dominance rules）：更具体的模式必须出现在更通用的模式之前，否则编译器会报告支配错误。

```java
// Example 5.10 — Dominance ordering (Java 21+)
String describe(Number n) {
    return switch (n) {
        case Integer i -> "integer: " + i;       // must precede Number
        case Long l    -> "long: " + l;
        case Number x  -> "other number: " + x;  // catches Float, Double, etc.
    };
}
// ERROR if you swap Number and Integer: case Integer i would be unreachable
```

---

## 5.8 使用 `when` 子句的守卫模式（Java 21 最终语法）

当模式匹配与额外的布尔守卫（boolean guards）结合时，switch 的模式匹配最为强大。在 Java 21 的最终语法（JEP 441）中，守卫通过附加在模式之后的 `when` 子句来表达：

```java
// Example 5.11 — Guarded patterns with when (Java 21, finalized)
String classify(Object obj) {
    return switch (obj) {
        case Integer i when i < 0       -> "negative integer";
        case Integer i when i == 0      -> "zero";
        case Integer i                  -> "positive integer";
        case String s when s.isEmpty()  -> "empty string";
        case String s                   -> "non-empty string: " + s;
        case null                       -> "null";
        default                         -> "other: " + obj.getClass().getSimpleName();
    };
}
```

`when` 子句仅在类型测试成功之后才会被求值。模式引入的绑定变量在 `when` 表达式中处于作用域内，从而实现精确的子分类，而无需嵌套的 `if` 语句。

请注意，在 Java 17 和 18 的预览期间，守卫使用的是 `&&` 语法：`case Integer i && i < 0`。`when` 关键字在 Java 19 预览中取代了它，并在 Java 21 中最终定稿。阅读较早的代码或预览期教程时，请注意这一语法差异。

```java
// Example 5.12 — Preview-era syntax (Java 17/18 ONLY — do not use in Java 21+)
// Compile with: javac --enable-preview --release 17
String oldSyntax(Object obj) {
    return switch (obj) {
        case Integer i && i > 0 -> "positive";    // old guard syntax
        case Integer i          -> "non-positive";
        default                 -> "not an integer";
    };
}
```

---

## 5.9 Switch 中的 Null 处理

历史上，将 `null` 传递给 switch 语句会在运行时抛出 `NullPointerException`。这一直是 switch 代码块周围进行防御性空值检查的固定原因。Switch 的模式匹配（在 Java 21 中正式定稿）通过允许 `case null` 分支直接解决了这个问题：

```java
// Example 5.13 — Null handling in switch (Java 21+)
void process(String command) {
    switch (command) {
        case null            -> System.out.println("No command provided");
        case "start"         -> startService();
        case "stop"          -> stopService();
        case "restart"       -> { stopService(); startService(); }
        default              -> System.out.println("Unknown command: " + command);
    }
}
```

如果没有 `case null` 分支，传递 `null` 仍然会抛出 `NullPointerException`。`case null` 分支必须被显式处理——编译器不会插入隐式的空值处理。这种设计保持了向后兼容性：没有 `case null` 的现有 switch 在选择器为 null 时会抛出 `NullPointerException`，与以前完全一样。

`case null` 也可以与 `default` 组合使用：

```java
// Example 5.14 — Combining null and default
String normalize(String input) {
    return switch (input) {
        case "yes", "y", "true", "1" -> "true";
        case "no", "n", "false", "0" -> "false";
        case null, default           -> "unknown";
    };
}
```

---

## 5.10 Switch 与密封类结合：穷尽性保证

密封类（Sealed classes，JEP 409，在 Java 17 中正式定稿）与 switch 的模式匹配天生就是配合使用的。当密封接口（sealed interface）或密封类作为选择器类型时，编译器知道允许的子类型的完整集合，并且可以验证所有子类型都已被覆盖，而无需 `default` 分支。

```java
// Example 5.15 — Sealed hierarchy with exhaustive switch (Java 21+)
sealed interface Expr
    permits Literal, Add, Multiply, Negate {}

record Literal(double value)              implements Expr {}
record Add(Expr left, Expr right)         implements Expr {}
record Multiply(Expr left, Expr right)    implements Expr {}
record Negate(Expr expr)                  implements Expr {}

double evaluate(Expr expr) {
    return switch (expr) {
        case Literal(double v)          -> v;
        case Add(Expr l, Expr r)        -> evaluate(l) + evaluate(r);
        case Multiply(Expr l, Expr r)   -> evaluate(l) * evaluate(r);
        case Negate(Expr e)             -> -evaluate(e);
        // No default needed: sealed hierarchy is fully covered
    };
}
```

请注意，`case Literal(double v)` 语法使用了**记录解构模式**（record deconstruction patterns），这是 JEP 440（在 Java 21 中正式定稿）的一部分。我们将在第 5.11 节中详细介绍。

对软件设计的关键启示十分深远：**你可以使用密封接口和模式匹配 switch 表达式在 Java 中建模变体类型（variant types），获得与函数式语言中代数数据类型（algebraic data types）相同的结构性保证**。向密封接口添加新的允许子类型会在编译时破坏所有穷尽的 switch，强制你显式处理新的情况。这是 Java 最接近 Haskell 和 Rust 开发者所依赖的"使非法状态不可表示"（make illegal states unrepresentable）原则的时刻。

如果你在对密封类型进行 switch 时添加了 `default` 分支，编译器的穷尽性检查会被满足，但编译时保证就失去了：`default` 分支会静默地吸收你后续添加的任何新子类型。

---

## 5.11 Switch 与记录及解构（预览路径）

记录模式（Record patterns）在 Java 21 中正式定稿（JEP 440），允许 case 标签直接解构记录实例，将记录的组件绑定到命名变量：

```java
// Example 5.16 — Record patterns in switch (Java 21+)
sealed interface JsonValue
    permits JsonNull, JsonBool, JsonNumber, JsonString, JsonArray, JsonObject {}

record JsonNull()                        implements JsonValue {}
record JsonBool(boolean value)           implements JsonValue {}
record JsonNumber(double value)          implements JsonValue {}
record JsonString(String value)          implements JsonValue {}
record JsonArray(List<JsonValue> items)  implements JsonValue {}
record JsonObject(Map<String,JsonValue> fields) implements JsonValue {}

String toYaml(JsonValue val) {
    return switch (val) {
        case JsonNull()              -> "null";
        case JsonBool(boolean b)     -> b ? "true" : "false";
        case JsonNumber(double d)    -> Double.toString(d);
        case JsonString(String s)    -> "\"" + s + "\"";
        case JsonArray(var items)    -> items.stream()
                                            .map(v -> "- " + toYaml(v))
                                            .collect(Collectors.joining("\n"));
        case JsonObject(var fields)  -> fields.entrySet().stream()
                                            .map(e -> e.getKey() + ": " + toYaml(e.getValue()))
                                            .collect(Collectors.joining("\n"));
    };
}
```

记录模式可以嵌套，从而实现深层结构匹配：

```java
// Example 5.17 — Nested record patterns (Java 21+)
record Point(double x, double y) {}
record Line(Point start, Point end) {}

String describeLine(Line line) {
    return switch (line) {
        case Line(Point(double x1, double y1), Point(double x2, double y2))
            when x1 == x2 -> "vertical line at x=" + x1;
        case Line(Point(double x1, double y1), Point(double x2, double y2))
            when y1 == y2 -> "horizontal line at y=" + y1;
        case Line(Point p1, Point p2) ->
            String.format("diagonal from (%.1f,%.1f) to (%.1f,%.1f)",
                p1.x(), p1.y(), p2.x(), p2.y());
    };
}
```

嵌套记录模式是一个仍在积极演进的领域。在 Java 25 中，预计会有对解构的进一步改进，特别是在泛型（generics）和基本类型模式（primitive patterns）方面。请密切关注这一领域的发展。

---

## 5.12 性能：Switch vs. If-Else 链

来自有经验的 Java 工程师的一个常见问题是：更具表达力的现代 switch 是否带来了性能开销。答案是有细微差别的，理解它需要了解 JVM 如何在字节码（bytecode）层面翻译 switch 结构。

**经典的整数 switch 语句** 编译为 `tableswitch`（用于密集的整数范围）或 `lookupswitch`（用于稀疏的整数集合）。两者分别是 O(1) 或 O(log n) 的操作——对于大量值的情况，显著快于线性的 `if-else` 链。

**使用箭头标签的 switch 表达式** 当选择器是整型或枚举时，编译为与经典 switch 语句相同的 `tableswitch`/`lookupswitch` 字节码。采用表达式形式不会带来运行时开销。

**模式匹配 switch** 则更为复杂。由于 JVM 的字节码原生不支持类型模式分发，编译器在底层生成类型测试（`instanceof` 检查），然后由 JIT 编译器（JIT compiler）进行激进优化。在实践中，对于少量替代项（少于约 10 个），模式匹配 switch 的性能与手写的 `if-else instanceof` 链无法区分。对于更多的替代项，由于 JIT 级别的分发表优化，switch 形式可能更快。

```java
// Example 5.18 — Microbenchmark structure (JMH, illustrative)
// To benchmark properly, use JMH. This is the structure:
@Benchmark
public String switchPatternMatch(BenchmarkState state) {
    return switch (state.nextObject()) {
        case Integer i -> "int:" + i;
        case Long l    -> "long:" + l;
        case String s  -> "str:" + s;
        default        -> "other";
    };
}

@Benchmark
public String ifElseChain(BenchmarkState state) {
    Object obj = state.nextObject();
    if (obj instanceof Integer i) return "int:" + i;
    if (obj instanceof Long l)    return "long:" + l;
    if (obj instanceof String s)  return "str:" + s;
    return "other";
}
```

在 Java 21 上运行的 JMH 基准测试（benchmark）中，模式匹配 switch 和等效的 `if-else instanceof` 链的性能差距在 2-5% 以内，对于大多数应用来说完全在噪声范围之内。**优先选择 switch 以获得可读性和正确性保证；仅在测量结果表明存在瓶颈时才诉诸性能剖析。**

---

## 5.13 实际应用：命令处理器、解析器、状态机

现代 switch 的实际价值在三个经典领域中体现得最为清晰：命令分发（command dispatch）、数据格式转换和有限状态机（finite state machines）。

**命令处理器**

一个典型的命令行或消息驱动的应用以记录或密封类型接收命令，并将它们分发给处理器：

```java
// Example 5.19 — Command processor with sealed interface
sealed interface Command permits
    CreateUser, UpdateEmail, DeleteUser, ListUsers {}

record CreateUser(String username, String email) implements Command {}
record UpdateEmail(long userId, String newEmail)  implements Command {}
record DeleteUser(long userId)                    implements Command {}
record ListUsers(int page, int pageSize)          implements Command {}

CommandResult dispatch(Command cmd) {
    return switch (cmd) {
        case CreateUser(String name, String email) ->
            userService.create(name, email);
        case UpdateEmail(long id, String email) ->
            userService.updateEmail(id, email);
        case DeleteUser(long id) ->
            userService.delete(id);
        case ListUsers(int page, int size) ->
            userService.list(page, size);
    };
}
```

编译器保证每种命令类型都已被处理。添加新的命令类型而不更新 `dispatch` 会导致编译错误。

**表达式解析器 / 解释器**

针对表达式树的递归解释器是结构化分发的经典用例：

```java
// Example 5.20 — AST interpreter (Java 21+)
sealed interface Statement permits
    Assignment, Print, IfStatement, Block {}

record Assignment(String var, Expr value) implements Statement {}
record Print(Expr value)                  implements Statement {}
record IfStatement(Expr cond, Statement then, Statement else_) implements Statement {}
record Block(List<Statement> stmts)       implements Statement {}

void execute(Statement stmt, Map<String, Object> env) {
    switch (stmt) {
        case Assignment(String var, Expr val) ->
            env.put(var, evaluate(val, env));
        case Print(Expr val) ->
            System.out.println(evaluate(val, env));
        case IfStatement(Expr cond, Statement then, Statement else_) -> {
            boolean test = (boolean) evaluate(cond, env);
            execute(test ? then : else_, env);
        }
        case Block(List<Statement> stmts) ->
            stmts.forEach(s -> execute(s, env));
    }
}
```

**状态机**

事件驱动的状态机受益于穷尽性检查与模式匹配的结合：

```java
// Example 5.21 — Order state machine (Java 21+)
sealed interface OrderEvent permits
    PaymentReceived, ItemShipped, DeliveryConfirmed, Cancelled {}

record PaymentReceived(String txId)      implements OrderEvent {}
record ItemShipped(String trackingCode)  implements OrderEvent {}
record DeliveryConfirmed(Instant time)   implements OrderEvent {}
record Cancelled(String reason)          implements OrderEvent {}

enum OrderState { PENDING, PAID, SHIPPED, DELIVERED, CANCELLED }

OrderState transition(OrderState current, OrderEvent event) {
    return switch (current) {
        case PENDING -> switch (event) {
            case PaymentReceived p -> {
                log.info("Payment {}", p.txId());
                yield OrderState.PAID;
            }
            case Cancelled c -> OrderState.CANCELLED;
            default          -> throw new IllegalStateException(
                "Event " + event + " invalid in PENDING state");
        };
        case PAID -> switch (event) {
            case ItemShipped s -> {
                log.info("Shipped: {}", s.trackingCode());
                yield OrderState.SHIPPED;
            }
            case Cancelled c -> OrderState.CANCELLED;
            default          -> throw new IllegalStateException(
                "Event " + event + " invalid in PAID state");
        };
        case SHIPPED -> switch (event) {
            case DeliveryConfirmed d -> {
                log.info("Delivered at {}", d.time());
                yield OrderState.DELIVERED;
            }
            default -> throw new IllegalStateException(
                "Event " + event + " invalid in SHIPPED state");
        };
        case DELIVERED, CANCELLED ->
            throw new IllegalStateException(
                "No transitions from terminal state " + current);
    };
}
```

这种嵌套 switch 的构造使每个有效的状态/事件组合都变得显式。编译器确保外层 switch 对 `OrderState` 是穷尽的。你保留了完整的类型安全——每个内层 switch 中的 `event` 仍然是密封的 `OrderEvent` 类型，内层 switch 也可以通过覆盖所有事件类型来实现穷尽。

---

## 5.14 总结

`switch` 从 Java 1 到 Java 21 的演变代表了该语言历史上设计最为精心的特性演进之一。这些变化以渐进的方式到来，每一步都建立在前一步的基础上：

- **Switch 表达式（JEP 361，Java 14）** 通过箭头标签消除了正常路径上的贯穿，通过 `yield` 实现了产生值的 switch，并为枚举选择器引入了编译时穷尽性检查。
- **Switch 的模式匹配（JEP 406/420/441）** 将 switch 选择器扩展到任意引用类型，将 case 标签扩展到类型模式、守卫模式和空值模式，在 Java 21 中达到其最终形式。
- **记录模式（JEP 440，Java 21）** 在 case 标签中直接添加了结构解构功能，实现了对记录层次结构的深层嵌套模式匹配。

这些特性共同使 Java 与 Scala、Kotlin 以及函数式语言中长期可用的模式匹配能力对齐——同时以 Java 工程师一眼即可辨识的语法实现，并与现有代码保持向后兼容。

实践指南非常直接：对于产生值的分发，优先使用 switch 表达式而非 switch 语句；使用密封接口来定义封闭的类型层次结构；依赖编译器的穷尽性检查来防止领域模型演进中的遗漏 case 缺陷。密封类型、记录和模式匹配 switch 的组合是现代 Java 中类型安全变体分发的惯用写法，它应当成为每位经验丰富的 Java 工程师日常工具箱的一部分。

---

*下一章：第6章将探讨 Java 17 的其余特性——增强的伪随机数生成器（enhanced pseudorandom number generators）、JDK 内部 API 的强封装（strong encapsulation），以及在升级之前需要关注的弃用和移除项。*


---

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


---

# 第7章：虚拟线程（Virtual Threads）——线程革命

虚拟线程（Virtual Threads，JEP 444，在 Java 21 中正式发布）是自泛型（Generics）以来对 Java 影响最为深远的一项新特性。它从根本上改变了并发代码的编写方式——并非引入新的抽象，而是让*现有的*阻塞式 API 能够扩展到数百万并发任务。如果你曾经花费多年时间与响应式编程（Reactive Programming）、回调地狱（Callback Hell）或复杂的线程池调优作斗争，虚拟线程就是这些问题的解决方案。

---

## 7.1 虚拟线程出现之前的线程模型

在 Java 21 之前，每个 Java 线程都直接映射到一个**操作系统线程**（即"平台线程（Platform Thread）"）。操作系统线程的开销很大：

- 每个平台线程需要约 1MB 的内核栈空间
- 操作系统线程之间的上下文切换（Context Switching）涉及内核调用
- 一个典型的 JVM 进程在维持约数千个平台线程后，性能就会开始下降

这给线程-每请求（Thread-per-Request）模型设定了一个硬性的可扩展性上限。一台需要处理 10,000 个并发 HTTP 请求的服务器就需要 10,000 个线程——而 10,000 个平台线程大约消耗 10GB 的内存，并产生严重的调度压力。

业界的应对方案是**响应式编程**：使用回调（Callback）、Future 或响应式流（Reactive Streams，如 Project Reactor、RxJava）进行非阻塞、事件驱动的编程。响应式代码可以仅用数十个线程处理 10,000 个并发请求——但它要求你围绕非阻塞 API 重构整个应用程序，面对跨越 30 个操作符链的堆栈追踪苦苦挣扎，并失去直线式代码的简洁性。

虚拟线程提供了第三条路径：保持简单、易读的线程-每请求模型，让 JVM 来处理其余的一切。

---

## 7.2 什么是虚拟线程？

**虚拟线程**是由 JVM 而非操作系统管理的轻量级线程。它的实现基于续体（Continuation）——一段可以被低成本挂起和恢复的调用栈。

JVM 在一个**载体线程（Carrier Thread）**池（即平台线程池）上运行虚拟线程。默认情况下，每个 CPU 核心对应一个载体线程。当虚拟线程阻塞时（如 I/O、sleep、锁等操作），JVM 会将其从载体线程上*卸载（Unmount）*——该载体线程随即变为空闲状态，可以运行另一个虚拟线程。当阻塞操作完成后，虚拟线程会被重新调度并*挂载（Mount）*到某个载体线程上。

```
Virtual Thread A (running)
       │
  [carrier thread 1] ──── CPU core 1

Virtual Thread A blocks on I/O
       │
  Carrier thread 1 picks up Virtual Thread B

  [carrier thread 1] ──── CPU core 1 (now running B)

I/O completes, Virtual Thread A is scheduled
       │
  [carrier thread 2] ──── CPU core 2 (now running A again)
```

结果就是：只要大多数虚拟线程处于等待状态，单个载体线程就可以服务数千个虚拟线程。

---

## 7.3 创建虚拟线程

虚拟线程使用我们熟悉的 `Thread` API：

```java
// 方式1：Thread.ofVirtual().start() —— 即发即忘
Thread vt = Thread.ofVirtual()
    .name("request-handler")
    .start(() -> processRequest(request));

// 方式2：Thread.ofVirtual().unstarted() —— 先创建，稍后启动
Thread unstarted = Thread.ofVirtual()
    .name("batch-worker-", 1)  // 名称前缀 + 序号
    .unstarted(() -> processBatch(batch));
unstarted.start();

// 方式3：Thread.startVirtualThread() —— 简写形式
Thread vt2 = Thread.startVirtualThread(() -> {
    System.out.println("Running in: " + Thread.currentThread());
    // 输出：Running in: VirtualThread[#42]/runnable@ForkJoinPool-1-worker-1
});

// 检查线程是否为虚拟线程
System.out.println(vt.isVirtual()); // true
System.out.println(Thread.currentThread().isVirtual()); // 取决于上下文
```

### 配合 ExecutorService 使用

最符合惯用法的方式——用于替代 I/O 密集型工作中的固定线程池：

```java
// 旧方式：固定线程池，限制并发数
ExecutorService oldPool = Executors.newFixedThreadPool(200);

// 新方式：每个任务一个虚拟线程，并发数无限制
ExecutorService virtualExecutor = Executors.newVirtualThreadPerTaskExecutor();

// API 完全相同——只需替换执行器
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futures = new ArrayList<>();

    for (String url : urls) {
        futures.add(executor.submit(() -> fetchUrl(url)));  // 每个任务获得自己的虚拟线程
    }

    for (Future<String> f : futures) {
        System.out.println(f.get());
    }
}  // try-with-resources 关闭并等待所有任务完成
```

---

## 7.4 虚拟线程的生命周期与挂载/卸载机制

虚拟线程与平台线程具有相同的状态（`NEW`、`RUNNABLE`、`WAITING`、`TIMED_WAITING`、`BLOCKED`、`TERMINATED`），但多了一个额外的概念：**挂载（Mounted）与卸载（Unmounted）**。

虚拟线程的状态：
- **已挂载（Mounted）**：当前正在某个载体线程上执行
- **已卸载（Unmounted）**：已挂起，其栈存储在堆内存（Heap Memory）中，不占用任何载体线程

当虚拟线程调用以下操作时，卸载会自动发生：
- 任何阻塞式 I/O 操作（`InputStream.read()`、`OutputStream.write()`、`Socket.connect()` 等）
- `Thread.sleep()`
- `Object.wait()`
- 获取一个当前被其他线程持有的 `ReentrantLock`
- 在 `Future.get()`、`CompletableFuture.join()`、`Semaphore.acquire()` 等上阻塞

```java
// 卸载演示
Thread.ofVirtual().start(() -> {
    System.out.println("Before sleep: " + Thread.currentThread()); // 已挂载
    Thread.sleep(1000);   // 卸载——在这一秒内载体线程被释放
    System.out.println("After sleep: " + Thread.currentThread());  // 重新挂载，可能在不同的载体线程上
});
```

---

## 7.5 阻塞式 I/O——如今几乎零成本

最具变革性的结果：**阻塞式 I/O 调用在虚拟线程上开销极低**。以前需要异步/响应式重写的代码现在可以保持同步风格：

```java
// 改造前：复杂的异步代码来处理 1000 个并发 HTTP 调用
// 使用 HttpClient 的异步 API 来避免阻塞线程
List<CompletableFuture<String>> futures = urls.stream()
    .map(url -> httpClient.sendAsync(
        HttpRequest.newBuilder(URI.create(url)).build(),
        HttpResponse.BodyHandlers.ofString()
    ).thenApply(HttpResponse::body))
    .toList();
CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new)).join();
List<String> results = futures.stream().map(CompletableFuture::join).toList();

// 改造后：简洁的同步代码，同样的可扩展性
List<String> results;
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    results = urls.stream()
        .map(url -> executor.submit(() -> {
            // 这个阻塞调用是零成本的——虚拟线程在等待期间会卸载
            HttpResponse<String> response = httpClient.send(
                HttpRequest.newBuilder(URI.create(url)).build(),
                HttpResponse.BodyHandlers.ofString()
            );
            return response.body();
        }))
        .toList()
        .stream()
        .map(future -> {
            try { return future.get(); }
            catch (Exception e) { throw new RuntimeException(e); }
        })
        .toList();
}
```

### 数据库查询示例

```java
// 每个虚拟线程处理一个请求——阻塞式 JDBC 完全没问题
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<Order>> orderFutures = orderIds.stream()
        .map(id -> executor.submit(() -> {
            // 这些阻塞式 JDBC 调用在虚拟线程上完全没问题
            Order order = orderRepository.findById(id);  // 在网络上阻塞
            order = enrichWithCustomerData(order);        // 在网络上阻塞
            return order;
        }))
        .toList();

    List<Order> orders = orderFutures.stream()
        .map(f -> {
            try { return f.get(); }
            catch (Exception e) { throw new RuntimeException(e); }
        })
        .toList();
}
```

---

## 7.6 钉住（Pinning）：虚拟线程无法卸载的情况

在以下两种情况下，虚拟线程会被**钉住（Pin）**在载体线程上，无法卸载：

1. **在 `synchronized` 代码块或方法内部**
2. **在本地方法调用（JNI）内部**

当被钉住时，虚拟线程会在阻塞操作期间一直占用载体线程——这就失去了虚拟线程的意义。

```java
// 问题：synchronized 代码块会钉住虚拟线程
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;  // 没问题——这里没有阻塞操作
    }

    public synchronized int getAndReset() {
        Thread.sleep(100);  // 钉住：占用载体线程 100 毫秒！
        int val = count;
        count = 0;
        return val;
    }
}

// 解决方案：使用 ReentrantLock 代替 synchronized
public class BetterCounter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }

    public int getAndReset() {
        lock.lock();
        try {
            Thread.sleep(100);  // 不会钉住——虚拟线程可以卸载
            int val = count;
            count = 0;
            return val;
        } finally {
            lock.unlock();
        }
    }
}
```

**关键建议**：在运行于虚拟线程上的代码中，优先使用 `java.util.concurrent.locks.ReentrantLock` 而非 `synchronized`。在 Java 24+ 中，`synchronized` 正在被增强以不再钉住虚拟线程（JEP 491）。

使用 JFR 检测钉住现象：

```bash
java -XX:+FlightRecorder \
     -XX:StartFlightRecording=filename=recording.jfr \
     -Djdk.tracePinnedThreads=full \
     -jar myapp.jar
```

---

## 7.7 虚拟线程中的线程局部变量：内存问题

线程局部变量（`ThreadLocal<T>`）可以在虚拟线程中使用，但存在内存方面的影响。如果你创建了数百万个虚拟线程，且每个线程都继承或创建了线程局部变量值，就可能消耗大量的堆内存。

```java
// 问题：开销高昂的逐虚拟线程初始化
static final ThreadLocal<DatabaseConnection> DB_CONN =
    ThreadLocal.withInitial(() -> openDatabaseConnection());  // 100万个连接?!

// 方案1：不要使用 ThreadLocal 存储昂贵的资源
// 使用连接池（如 HikariCP 等）在线程间共享

// 方案2：使用作用域值（Scoped Values，第9章）代替 ThreadLocal
// 作用域值是只读的，能被高效继承，作用域结束时会被垃圾回收

// 方案3：谨慎地池化逐线程状态
static final ThreadLocal<SimpleDateFormat> DATE_FORMAT =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
// 这样内存占用较低（每个虚拟线程一个 SDF），但如果有数百万个虚拟线程就很浪费
// 更好的做法：使用 DateTimeFormatter（线程安全，无需 ThreadLocal）
```

---

## 7.8 将 Spring Boot 迁移到虚拟线程

Spring Boot 3.2+ 使得启用虚拟线程变得极为简单：

```yaml
# application.yml —— 一行配置即可启用虚拟线程
spring:
  threads:
    virtual:
      enabled: true
```

启用后，Spring Boot 会将 Tomcat（以及 Jetty、Undertow）配置为使用虚拟线程来处理请求。每个 HTTP 请求获得自己的虚拟线程——数百万并发请求仅需 O(核心数) 个载体线程。

```java
// Spring MVC 控制器——阻塞式代码现在可以高效扩展
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private CustomerService customerService;
    @Autowired private InventoryService inventoryService;

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable String id) {
        // 这些阻塞调用完全没问题——请求运行在虚拟线程上
        Order order = orderService.findById(id);           // 在数据库上阻塞
        Customer customer = customerService.findById(order.customerId()); // 在数据库上阻塞
        boolean inStock = inventoryService.check(order.items());          // 在数据库上阻塞
        return new OrderResponse(order, customer, inStock);
    }
}
```

在没有虚拟线程的情况下，这个处理器在每次数据库调用期间都会阻塞一个平台线程。使用虚拟线程后，载体线程在每次阻塞调用期间都是空闲的——相同的代码，显著提高的吞吐量。

---

## 7.9 虚拟线程 vs 响应式编程

| 方面 | 响应式（WebFlux 等） | 虚拟线程 |
|------|----------------------|----------|
| 代码风格 | 函数式管道，`Mono<T>`/`Flux<T>` | 标准的顺序式代码 |
| 堆栈追踪 | 通常晦涩难懂，充斥操作符链噪音 | 正常、可读的堆栈追踪 |
| 可调试性 | 具有挑战性 | 标准调试器即可使用 |
| 阻塞式 I/O | 禁止使用（必须使用异步变体） | 可以使用 |
| CPU 密集型工作 | 无优势 | 无优势 |
| 学习曲线 | 陡峭 | 几乎没有（现有代码直接可用） |
| 背压（Backpressure） | 内置支持 | 需要显式实现 |
| 适用场景 | CPU 密集型 + I/O 混合工作负载、流处理 | I/O 密集型工作负载 |

**经验法则**：对于新的 I/O 密集型服务，使用虚拟线程。对于现有的响应式代码，除非有特定理由，否则不要重写。对于 CPU 密集型工作，响应式和虚拟线程都无法提供帮助——请使用并行流（Parallel Streams）或 `ForkJoinPool`。

---

## 7.10 调试虚拟线程

虚拟线程在线程转储（Thread Dump）中会显示其名称和载体线程信息：

```
#119 "" virtual
      java.base/java.lang.VirtualThread$VThreadContinuation.onPinned(VirtualThread.java:183)
      java.base/jdk.internal.vm.Continuation.pin(Continuation.java:392)
      java.base/java.lang.VirtualThread.park(VirtualThread.java:595)
      ...
```

使用 JFR 进行性能分析：

```java
// 编程方式的 JFR 记录
import jdk.jfr.Recording;
import jdk.jfr.consumer.RecordingFile;

try (Recording rec = new Recording()) {
    rec.enable("jdk.VirtualThreadStart");
    rec.enable("jdk.VirtualThreadEnd");
    rec.enable("jdk.VirtualThreadPinned");  // 检测钉住事件
    rec.start();

    // ... 运行你的工作负载 ...

    rec.stop();
    rec.dump(Path.of("vthread-recording.jfr"));
}
```

---

## 7.11 常见陷阱

### 不要池化虚拟线程

```java
// 错误：线程池对虚拟线程毫无意义
// 虚拟线程本身就是轻量级的——创建一个有界的池违背了其初衷
ExecutorService pool = new ThreadPoolExecutor(
    0, 1000, 60, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(),
    Thread.ofVirtual().factory()  // 将虚拟线程工厂与线程池搭配使用——毫无意义
);

// 正确：每个任务一个虚拟线程
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
```

### 不要在长时间阻塞的代码段中使用 synchronized

已在 7.6 节中讨论——优先使用 `ReentrantLock`。

### CPU 密集型任务仍然会阻塞载体线程

虚拟线程对 CPU 密集型工作没有帮助。执行大量计算的虚拟线程会在计算期间一直占用载体线程：

```java
// 对于 CPU 密集型任务：使用并行流或 ForkJoinPool.commonPool()
// 而非虚拟线程
List<Result> results = data.parallelStream()
    .map(this::heavyComputation)
    .toList();
```

---

## 7.12 总结

虚拟线程是一次没有范式变化的范式转换：

- **编写阻塞式代码**——它会自动扩展
- **数百万并发任务**仅需少量载体线程
- **无需 API 变更**——同样的 `Thread`、同样的 `ExecutorService`、同样的 `BlockingQueue`
- **避免在长时间阻塞的代码段中使用 `synchronized`**——改用 `ReentrantLock`
- **在 Spring Boot 3.2+ 中启用**只需一行 YAML 配置
- **并非响应式编程的替代品**——当需要背压控制时仍需响应式
- **对 CPU 密集型工作无益**——请使用并行流

虚拟线程是 Java 最初承诺的实现：编写简洁的、顺序式的代码，使其正确运行并能高效扩展。在响应式编程领域长达十年的迂回探索在操作系统线程限制下是必要的——但这些限制现在已经消除了。


---

# 第8章：结构化并发

结构化并发（Structured Concurrency）（JEP 453，Java 21 中为预览特性；持续演进至 Java 25，参见第16章）解决了并发编程中的一个根本问题：**任务生命周期管理（task lifetime management）**。当你将工作拆分到多个线程时，如何确保所有派生的任务在离开外层作用域之前全部完成（或干净地失败）？没有结构化并发，并发代码会泄漏线程、产生令人困惑的错误传播，并且众所周知难以可靠地取消。

---

## 8.1 非结构化并发的问题

考虑获取订单详情时需要三个并行的服务调用：

```java
// BEFORE: unstructured concurrency with CompletableFuture
public OrderDetail getOrderDetail(String orderId) throws Exception {
    CompletableFuture<Order> orderFuture =
        CompletableFuture.supplyAsync(() -> orderService.find(orderId));
    CompletableFuture<Customer> customerFuture =
        CompletableFuture.supplyAsync(() -> customerService.find(orderId));
    CompletableFuture<List<Shipment>> shipmentFuture =
        CompletableFuture.supplyAsync(() -> shipmentService.find(orderId));

    Order order = orderFuture.get();         // what if this throws?
    Customer customer = customerFuture.get(); // customerFuture is still running!
    List<Shipment> shipments = shipmentFuture.get();

    return new OrderDetail(order, customer, shipments);
}
```

这段代码存在以下问题：
1. 如果 `orderFuture` 抛出异常，`customerFuture` 和 `shipmentFuture` 会继续运行（线程泄漏）
2. 如果调用线程被中断，派生的任务仍会继续运行
3. 错误处理很复杂——哪个异常会被传播？应该取消哪个 future？
4. 线程转储（thread dump）显示任务正在运行，但看不出它们之间的结构关系

---

## 8.2 结构化并发范式

结构化并发将结构化编程（Structured Programming）的理念（代码块具有单一入口和出口，内部代码完全被包含在块内）应用于并发编程：**在某个作用域内派生的任务必须在该作用域退出之前完成**。

可以做一个类比：正如 Java 中的 `{ ... }` 保证内部所有代码在执行下一条语句之前完成一样，`StructuredTaskScope` 保证所有派生的任务在作用域关闭之前完成。

---

## 8.3 StructuredTaskScope：核心 API

```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Subtask;

// Basic pattern: ShutdownOnFailure — if any task fails, cancel all
public OrderDetail getOrderDetail(String orderId) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

        // Fork subtasks — each runs in its own virtual thread
        Subtask<Order>          orderTask    = scope.fork(() -> orderService.find(orderId));
        Subtask<Customer>       customerTask = scope.fork(() -> customerService.find(orderId));
        Subtask<List<Shipment>> shipmentTask = scope.fork(() -> shipmentService.find(orderId));

        // Wait for all to complete (or for one to fail)
        scope.join()
             .throwIfFailed();  // re-throws the first failure, cancels all others

        // All tasks have completed successfully here
        return new OrderDetail(
            orderTask.get(),
            customerTask.get(),
            shipmentTask.get()
        );
    }
    // Scope closes: all forked tasks are guaranteed complete
}
```

其结构如下：
1. 打开一个作用域（`new StructuredTaskScope.ShutdownOnFailure()`）
2. 派生子任务（每个任务运行在一个虚拟线程中）
3. `join()` —— 等待关闭条件满足
4. 处理结果
5. 关闭作用域（try-with-resources）—— 确保所有任务已完成

---

## 8.4 ShutdownOnFailure —— 快速失败模式

`ShutdownOnFailure` 实现了最常见的策略：如果**任何**子任务失败，则取消所有剩余子任务并传播该失败。

```java
record FlightBooking(String flightId, String seatClass, BigDecimal price) {}
record HotelBooking(String hotelId, String roomType, BigDecimal pricePerNight) {}
record CarRental(String carId, String category, BigDecimal pricePerDay) {}

public TravelPackage bookTravel(TravelRequest request) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

        Subtask<FlightBooking> flightTask =
            scope.fork(() -> flightService.book(request.origin(),
                                                 request.destination(),
                                                 request.dates()));

        Subtask<HotelBooking> hotelTask =
            scope.fork(() -> hotelService.book(request.destination(),
                                                request.dates()));

        Subtask<CarRental> carTask =
            scope.fork(() -> carService.book(request.destination(),
                                              request.dates()));

        scope.join().throwIfFailed(e -> new BookingException("Travel booking failed", e));

        // If we reach here, all three bookings succeeded
        return new TravelPackage(flightTask.get(), hotelTask.get(), carTask.get());
    }
    // If any service threw an exception, all others are cancelled and
    // BookingException is thrown — no leaked background tasks
}
```

---

## 8.5 ShutdownOnSuccess —— 先到先赢模式

`ShutdownOnSuccess` 实现了"对冲请求（hedged request）"或"竞赛（race）"模式：派生多个相互竞争的任务，使用第一个成功的结果，取消其余任务。

```java
// Hedge a database read: query primary, then replica if primary is slow
public User findUserFast(String userId) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnSuccess<User>()) {

        scope.fork(() -> primaryDb.findUser(userId));    // try primary first
        scope.fork(() -> {
            Thread.sleep(50);                            // small delay before trying replica
            return replicaDb.findUser(userId);
        });

        scope.join();
        return scope.result();  // returns the first successful result
    }
}

// Load balancing: try multiple backends, use fastest response
public String callBackend(String request) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnSuccess<String>()) {
        for (String backend : backendUrls) {
            scope.fork(() -> httpClient.send(request, backend));
        }

        scope.join();
        return scope.result();  // whichever backend responded first
    }
}
```

---

## 8.6 错误处理与异常传播

`Subtask` 承载了派生任务的结果，在 `join()` 之后它可能处于三种状态之一：

```java
// Subtask.State enum:
// SUCCESS — completed normally
// FAILED  — completed with an exception
// UNAVAILABLE — cancelled (because scope shut down)

try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask<String> taskA = scope.fork(() -> serviceA.call());
    Subtask<String> taskB = scope.fork(() -> serviceB.call());
    Subtask<String> taskC = scope.fork(() -> serviceC.call());

    scope.join();  // Wait — does NOT throw yet

    // Inspect each task's state
    for (Subtask<String> task : List.of(taskA, taskB, taskC)) {
        switch (task.state()) {
            case SUCCESS     -> System.out.println("Result: " + task.get());
            case FAILED      -> System.out.println("Failed: " + task.exception());
            case UNAVAILABLE -> System.out.println("Was cancelled");
        }
    }

    scope.throwIfFailed();  // Now throw if any failed
}
```

自定义异常映射（Custom exception mapping）：

```java
scope.join().throwIfFailed(cause -> {
    if (cause instanceof TimeoutException) {
        return new ServiceTimeoutException("Downstream service timed out", cause);
    }
    return new ServiceException("Downstream service failed", cause);
});
```

---

## 8.7 嵌套 StructuredTaskScope

作用域可以嵌套——每个子作用域必须在父作用域继续之前完成：

```java
public DashboardData loadDashboard(String userId) throws Exception {
    try (var outerScope = new StructuredTaskScope.ShutdownOnFailure()) {

        // Task 1: load profile (simple)
        Subtask<UserProfile> profileTask =
            outerScope.fork(() -> profileService.load(userId));

        // Task 2: load analytics (which itself forks sub-tasks)
        Subtask<Analytics> analyticsTask = outerScope.fork(() -> {
            // Nested scope inside a forked task
            try (var innerScope = new StructuredTaskScope.ShutdownOnFailure()) {
                Subtask<OrderHistory> orders =
                    innerScope.fork(() -> orderService.history(userId));
                Subtask<SearchHistory> searches =
                    innerScope.fork(() -> searchService.history(userId));
                Subtask<WishList> wishlist =
                    innerScope.fork(() -> wishlistService.get(userId));

                innerScope.join().throwIfFailed();
                return new Analytics(orders.get(), searches.get(), wishlist.get());
            }
        });

        outerScope.join().throwIfFailed();

        return new DashboardData(profileTask.get(), analyticsTask.get());
    }
}
```

---

## 8.8 结构化并发与可观测性

结构化并发一个被低估的优势是：**线程转储能够清晰地展示任务层级结构**。使用非结构化的 `CompletableFuture` 时，线程转储只显示一个扁平的线程列表，无法看出哪些任务派生了哪些任务。而使用结构化并发时：

```
Thread[#77,<unnamed virtual>,5,main]
└── StructuredTaskScope$ShutdownOnFailure
    ├── Thread[#78,<unnamed virtual>,...] - orderService.find(orderId)
    ├── Thread[#79,<unnamed virtual>,...] - customerService.find(orderId)
    └── Thread[#80,<unnamed virtual>,...] - shipmentService.find(orderId)
```

父子关系在线程转储中是显式的——这对于调试生产环境的问题是一个巨大的改进。

---

## 8.9 取消与超时

为整个作用域添加截止时间（deadline）：

```java
public OrderDetail getOrderDetailWithTimeout(String orderId) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

        Subtask<Order> orderTask     = scope.fork(() -> orderService.find(orderId));
        Subtask<Customer> custTask   = scope.fork(() -> customerService.find(orderId));

        // Deadline: give the whole operation 500ms
        scope.joinUntil(Instant.now().plusMillis(500));
        scope.throwIfFailed();

        // Check for timeout: if deadline passed, subtasks are in UNAVAILABLE state
        if (orderTask.state() == Subtask.State.UNAVAILABLE) {
            throw new TimeoutException("Order detail fetch timed out");
        }

        return new OrderDetail(orderTask.get(), custTask.get());
    }
}
```

---

## 8.10 实际应用模式：并行数据丰富管道

一种常见的微服务（microservice）模式：加载核心实体，然后从多个服务并行丰富其数据：

```java
public EnrichedProduct enrichProduct(String productId) throws Exception {
    // Step 1: load core product (sequential — subsequent calls depend on this)
    Product product = productRepository.findById(productId);

    // Step 2: enrich in parallel
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        Subtask<PricingInfo> pricingTask =
            scope.fork(() -> pricingService.getPricing(productId, product.category()));

        Subtask<InventoryStatus> inventoryTask =
            scope.fork(() -> inventoryService.getStatus(productId));

        Subtask<List<Review>> reviewsTask =
            scope.fork(() -> reviewService.getTopReviews(productId, 5));

        Subtask<List<String>> imagesTask =
            scope.fork(() -> mediaService.getImageUrls(productId));

        scope.join().throwIfFailed();

        return new EnrichedProduct(
            product,
            pricingTask.get(),
            inventoryTask.get(),
            reviewsTask.get(),
            imagesTask.get()
        );
    }
}
```

---

## 8.11 结构化并发 vs CompletableFuture vs 响应式编程

| 特性 | StructuredTaskScope | CompletableFuture | 响应式（Reactive）（Reactor/RxJava） |
|---------|---------------------|-------------------|--------------------------|
| 任务生命周期保证 | 是——作用域强制确保完成 | 否——任务可能比调用方存活更久 | 取决于订阅方式 |
| 取消 | 作用域关闭时自动取消 | 手动取消 | 自动取消（dispose） |
| 错误传播 | 显式且清晰 | 复杂的链式调用 | 基于操作符 |
| 背压（Backpressure） | 否 | 否 | 是 |
| 代码风格 | 顺序式/命令式 | 函数式链式调用 | 函数式管道 |
| 调试 | 优秀（虚拟线程转储） | 一般 | 困难 |
| 适用场景 | 有明确结果的并行 I/O | 简单的异步任务 | 流式数据处理 |

---

## 8.12 总结

结构化并发将结构化编程的纪律性引入并发代码：

- **`ShutdownOnFailure`**：全有或全无的并行执行——最常见的模式
- **`ShutdownOnSuccess`**：对冲请求和竞赛——使用最快的结果
- **作用域保证**：没有任何任务能存活超过其所在的作用域——不会发生线程泄漏
- **与虚拟线程完美配合**：每次 `fork()` 都会获得一个轻量级的虚拟线程（virtual thread）
- **改进的可观测性**：线程转储展示任务层级结构
- **Java 21 中为预览特性**，正在向正式版演进——使用时需添加 `--enable-preview`

结构化并发是虚拟线程的伴侣：虚拟线程提供了扩展能力，结构化并发提供了纪律性。二者结合，使得并发代码像顺序代码一样易于推理。


---

# 第9章：作用域值（Scoped Values）

作用域值（Scoped Values，JEP 446，在 Java 21 中作为预览功能；在 Java 25 中通过 JEP 506 正式发布）提供了一种在有限作用域内共享不可变数据的机制——既可以在线程内部使用，也可以传递到子线程中。它们解决了 `ThreadLocal` 存在的内存和正确性问题，同时在虚拟线程（Virtual Thread）和结构化并发（Structured Concurrency）的世界中实现了安全的数据传播。

---

## 9.1 ThreadLocal：优点、缺点与内存泄漏

`ThreadLocal<T>` 数十年来一直被用于传播每个请求的上下文信息（用户身份、事务 ID、安全上下文、日志 MDC），而无需将其作为参数逐层传递。但它存在严重的问题：

```java
// Classic ThreadLocal usage: per-request user context
public class RequestContext {
    private static final ThreadLocal<User> CURRENT_USER = new ThreadLocal<>();

    public static void setUser(User user) { CURRENT_USER.set(user); }
    public static User getUser()          { return CURRENT_USER.get(); }
    public static void clear()            { CURRENT_USER.remove(); }
}

// Filter sets context at start of request
public class AuthFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
        User user = authenticate(req);
        RequestContext.setUser(user);
        try {
            chain.doFilter(req, res);
        } finally {
            RequestContext.clear();  // CRITICAL: forget this and you leak memory
        }
    }
}
```

`ThreadLocal` 的问题：
1. **内存泄漏**：在线程池中忘记调用 `.remove()` 会导致对象被无限期持有
2. **可变性**：任何代码都可以在任何时候调用 `.set()`——无法保证不可变性
3. **与虚拟线程不兼容**：当存在数百万个虚拟线程时，就会有数百万个 `ThreadLocal` 副本
4. **隐式耦合**：调用者和被调用者之间隐式共享状态——难以推理

---

## 9.2 什么是作用域值？

`ScopedValue<T>` 是一种不可变绑定（Immutable Binding）：一个值与一个 `ScopedValue` 键在*特定词法作用域的持续期间*相关联，然后自动释放。运行时负责清理——你不可能忘记调用 `.remove()`。

关键属性：
- **不可变**：一旦在某个作用域中绑定，该值在该作用域内不可更改
- **有限生命周期**：绑定仅存在于 `ScopedValue.where(...).run(...)` 代码块内
- **子线程继承**：结构化并发任务自动继承父作用域的绑定
- **可重新绑定**：内部作用域可以用不同的值进行遮蔽（但外部绑定不受影响）

---

## 9.3 ScopedValue API：where() 与 run()/call()

```java
import java.lang.ScopedValue;

// Declare a ScopedValue key — typically a public static final
public class RequestContext {
    public static final ScopedValue<User>   CURRENT_USER   = ScopedValue.newInstance();
    public static final ScopedValue<String> REQUEST_ID     = ScopedValue.newInstance();
    public static final ScopedValue<String> TRANSACTION_ID = ScopedValue.newInstance();
}

// Bind and use:
User authenticatedUser = authenticate(request);
String requestId = generateRequestId();

ScopedValue.where(RequestContext.CURRENT_USER, authenticatedUser)
           .where(RequestContext.REQUEST_ID,   requestId)
           .run(() -> {
               // Within this scope, CURRENT_USER and REQUEST_ID are bound
               handleRequest(request);
           });
// After run() returns, bindings are gone — no cleanup needed
```

对于需要返回值的代码，使用 `call()`：

```java
ScopedValue.where(RequestContext.CURRENT_USER, user)
           .where(RequestContext.REQUEST_ID, requestId)
           .call(() -> {
               return processOrder(orderId);  // returns a value
           });
```

---

## 9.4 读取作用域值：get() 与 orElse()

```java
// In any code called within the scope (no matter how deeply nested):
public void auditLog(String action) {
    User user      = RequestContext.CURRENT_USER.get();    // throws if not bound
    String reqId   = RequestContext.REQUEST_ID.orElse("unknown"); // safe fallback

    System.out.printf("[%s] User %s performed: %s%n", reqId, user.name(), action);
}

// Check if bound before reading:
if (RequestContext.CURRENT_USER.isBound()) {
    User user = RequestContext.CURRENT_USER.get();
    // ...
}
```

---

## 9.5 结构化并发中的继承

相比 `ThreadLocal` 的关键优势在于：作用域值会被结构化并发中的子线程**自动继承**。无需显式传递：

```java
public static final ScopedValue<String> TENANT_ID = ScopedValue.newInstance();

public TenantData loadTenantData(String tenantId) throws Exception {
    return ScopedValue.where(TENANT_ID, tenantId).call(() -> {
        // TENANT_ID is bound here

        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            // Each forked virtual thread AUTOMATICALLY inherits TENANT_ID binding
            Subtask<Config>       configTask = scope.fork(() -> loadConfig());     // sees TENANT_ID
            Subtask<List<User>>   usersTask  = scope.fork(() -> loadUsers());      // sees TENANT_ID
            Subtask<BillingInfo>  billingTask = scope.fork(() -> loadBilling());   // sees TENANT_ID

            scope.join().throwIfFailed();

            return new TenantData(configTask.get(), usersTask.get(), billingTask.get());
        }
    });
}

// Callee doesn't need the tenantId parameter — it reads it from the scope
private Config loadConfig() {
    String tenant = TENANT_ID.get();  // inherited from parent scope
    return configRepository.findByTenant(tenant);
}
```

与 `ThreadLocal` 不同的是，子线程不会自动继承父线程的值（除非使用 `InheritableThreadLocal`，但它有自己的一系列问题）。

---

## 9.6 重新绑定：在内部作用域中遮蔽值

内部作用域可以将不同的值绑定到同一个 `ScopedValue` 键。外部绑定不会改变，并在内部作用域退出时恢复：

```java
public static final ScopedValue<String> LOG_LEVEL = ScopedValue.newInstance();

public void processRequest() {
    ScopedValue.where(LOG_LEVEL, "INFO").run(() -> {
        // LOG_LEVEL = "INFO" here

        System.out.println(LOG_LEVEL.get()); // INFO

        ScopedValue.where(LOG_LEVEL, "DEBUG").run(() -> {
            // LOG_LEVEL = "DEBUG" here (shadowing)
            System.out.println(LOG_LEVEL.get()); // DEBUG
            doDetailedProcessing();
        });

        // LOG_LEVEL = "INFO" again — outer binding restored
        System.out.println(LOG_LEVEL.get()); // INFO
    });
}
```

这在需要临时提升特定代码路径的日志详细程度、同时不影响请求其余部分时特别有用。

---

## 9.7 作用域值与 ThreadLocal：直接对比

```java
// ThreadLocal approach — mutable, leak-prone
static final ThreadLocal<User> TL_USER = new ThreadLocal<>();

void handleRequest(User user) {
    TL_USER.set(user);
    try {
        process();
    } finally {
        TL_USER.remove(); // must not forget
    }
}

void process() {
    User u = TL_USER.get(); // mutable — could have been changed by someone else
}

// ----

// ScopedValue approach — immutable, automatic cleanup
static final ScopedValue<User> SV_USER = ScopedValue.newInstance();

void handleRequest(User user) {
    ScopedValue.where(SV_USER, user).run(() -> process()); // cleanup is automatic
}

void process() {
    User u = SV_USER.get(); // immutable — guaranteed to be exactly what was bound
}
```

| 特性 | `ThreadLocal` | `ScopedValue` |
|---------|---------------|---------------|
| 可变性 | 可变（任何位置均可调用 `.set()`） | 在作用域内不可变 |
| 清理 | 手动（`.remove()`） | 自动 |
| 虚拟线程下的内存开销 | O(线程数) 份副本——可达数百万 | O(作用域深度)——有界 |
| 子线程继承 | 不自动 | 自动（结构化并发） |
| JVM 优化 | 有限 | JVM 可进行常量折叠（Constant Folding） |

---

## 9.8 用例：每请求 Web 上下文

```java
public class WebContext {
    public static final ScopedValue<User>       USER         = ScopedValue.newInstance();
    public static final ScopedValue<String>     REQUEST_ID   = ScopedValue.newInstance();
    public static final ScopedValue<HttpRequest> HTTP_REQUEST = ScopedValue.newInstance();
}

// Framework/filter layer (e.g., a custom Servlet filter):
@Component
public class ContextPropagationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws Exception {
        User user = authService.resolveUser(request);
        String requestId = UUID.randomUUID().toString();

        ScopedValue.where(WebContext.USER,       user)
                   .where(WebContext.REQUEST_ID, requestId)
                   .run(() -> chain.doFilter(request, response));
    }
}

// Deep in the call stack — no parameters needed
@Service
public class AuditService {
    public void log(String event) {
        User user      = WebContext.USER.get();
        String reqId   = WebContext.REQUEST_ID.get();
        auditRepository.save(new AuditEntry(reqId, user.id(), event, Instant.now()));
    }
}
```

---

## 9.9 将作用域值与结构化并发结合使用

这是最典型的使用模式——绑定一次上下文，然后派生多个任务，所有任务都能看到相同的上下文：

```java
public static final ScopedValue<TraceContext> TRACE = ScopedValue.newInstance();

public OrderSummary processOrderBatch(List<String> orderIds, TraceContext trace)
        throws Exception {
    return ScopedValue.where(TRACE, trace).call(() -> {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            // All tasks inherit TRACE binding automatically
            List<Subtask<Order>> tasks = orderIds.stream()
                .map(id -> scope.fork(() -> {
                    TRACE.get().span("process-order-" + id); // visible in each task
                    return orderService.process(id);
                }))
                .toList();

            scope.join().throwIfFailed();

            List<Order> orders = tasks.stream()
                .map(Subtask::get)
                .toList();
            return new OrderSummary(orders);
        }
    });
}
```

---

## 9.10 总结

作用域值解决了 `ThreadLocal` 多年来一直困扰的上下文数据传递问题：

- **不可变绑定**防止了共享上下文的意外修改
- **自动清理**消除了内存泄漏
- **虚拟线程安全**——内存开销为 O(作用域深度)，而非 O(线程数)
- **结构化并发继承**——子任务自动继承父绑定
- **重新绑定**允许在内部作用域中进行受控的遮蔽
- **Java 21 中为预览功能**，在 Java 25 中正式发布（第15章）

对于任何在虚拟线程上运行或使用结构化并发的新代码，都应优先采用作用域值而非 `ThreadLocal`。这种编程模型更清晰、更安全，且扩展性大幅提升。


---

# 第10章：有序集合（Sequenced Collections）

有序集合（Sequenced Collections，JEP 431，在 Java 21 中正式发布）解决了 Java 集合框架（Java Collections Framework）中一个令人意外的缺陷：缺乏统一的 API 来访问有序集合的首尾元素，以及进行反向迭代。在 Java 21 之前，不同的类型需要使用不同的方法——`list.get(0)` 与 `deque.peekFirst()` 与 `sortedSet.first()`，没有多态的方式来编写适用于所有有序集合的代码。

---

## 10.1 问题所在：不一致的首尾元素访问

```java
// 获取第一个元素——每种集合类型的方式都不同
List<String> list = List.of("a", "b", "c");
String firstFromList = list.get(0);              // 索引访问

Deque<String> deque = new ArrayDeque<>(List.of("a", "b", "c"));
String firstFromDeque = deque.peekFirst();        // 或 getFirst()

SortedSet<String> sortedSet = new TreeSet<>(List.of("a", "b", "c"));
String firstFromSet = sortedSet.first();          // SortedSet 特有方法

LinkedHashSet<String> linkedSet = new LinkedHashSet<>(List.of("a", "b", "c"));
String firstFromLinked = linkedSet.iterator().next(); // 迭代器的变通写法！

// 获取最后一个元素——同样不一致
String lastFromList = list.get(list.size() - 1); // 容易出错
String lastFromDeque = deque.peekLast();
String lastFromSet = sortedSet.last();
String lastFromLinked = /* ... 不遍历整个集合就没有简洁的方法 */;
```

这种碎片化使得编写能统一适用于所有有序集合的通用代码成为不可能。

---

## 10.2 三个新接口

Java 21 在 `java.util` 中引入了三个新接口：

```
SequencedCollection<E>   extends Collection<E>
SequencedSet<E>          extends SequencedCollection<E>, Set<E>
SequencedMap<K,V>        extends Map<K,V>
```

---

## 10.3 SequencedCollection

```java
public interface SequencedCollection<E> extends Collection<E> {
    // 添加到开头/末尾
    void addFirst(E e);
    void addLast(E e);

    // 获取首/尾元素（集合为空时抛出 NoSuchElementException）
    E getFirst();
    E getLast();

    // 移除首/尾元素（集合为空时抛出 NoSuchElementException）
    E removeFirst();
    E removeLast();

    // 反转视图（不是副本——对其中一个的修改会反映到另一个）
    SequencedCollection<E> reversed();
}
```

所有有序集合现在都统一实现了此接口：

```java
List<String>       list       = new ArrayList<>(List.of("a", "b", "c"));
Deque<String>      deque      = new ArrayDeque<>(List.of("a", "b", "c"));
LinkedHashSet<String> linked  = new LinkedHashSet<>(List.of("a", "b", "c"));

// 统一的 API——同样的代码适用于所有三种类型！
for (SequencedCollection<String> coll : List.of(list, deque, linked)) {
    System.out.println(coll.getFirst());  // "a"
    System.out.println(coll.getLast());   // "c"
}
```

### reversed() 视图

`reversed()` 返回一个**实时视图（live view）**——它不会复制集合。对原始集合的修改会反映在反转视图中，反之亦然：

```java
List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5));
List<Integer> reversed = (List<Integer>) numbers.reversed();

System.out.println(reversed.getFirst()); // 5
System.out.println(reversed.getLast());  // 1

numbers.add(6);
System.out.println(reversed.getFirst()); // 6 — 实时视图反映了变化

// 反向迭代——简洁且符合惯用写法
for (String item : list.reversed()) {
    System.out.println(item); // c, b, a
}

// 反向流操作
list.reversed().stream()
    .filter(s -> !s.isEmpty())
    .forEach(System.out::println);
```

### 实践：高效的双端队列操作

```java
// 使用 Deque 作为 SequencedCollection 的 LRU 缓存骨架
class LruCache<K, V> {
    private final int capacity;
    private final LinkedHashMap<K, V> cache;

    LruCache(int capacity) {
        this.capacity = capacity;
        // LinkedHashMap 的访问顺序模式
        this.cache = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > capacity;
            }
        };
    }

    // 使用 SequencedMap 获取最近使用的条目
    public Map.Entry<K, V> getMostRecent() {
        return cache.sequencedEntrySet().getLast();  // Java 21 SequencedMap API
    }
}
```

---

## 10.4 SequencedSet

`SequencedSet<E>` 没有添加新方法，但它表明该集合既是一个 `Set`（不含重复元素），也是一个 `SequencedCollection`（具有确定的顺序）。`reversed()` 的返回类型为 `SequencedSet<E>`。

```java
// LinkedHashSet 现在实现了 SequencedSet
LinkedHashSet<String> set = new LinkedHashSet<>(List.of("banana", "apple", "cherry"));

System.out.println(set.getFirst()); // "banana"（插入顺序）
System.out.println(set.getLast());  // "cherry"

// TreeSet（有序集合）也实现了 SequencedSet
TreeSet<String> sorted = new TreeSet<>(Set.of("banana", "apple", "cherry"));
System.out.println(sorted.getFirst()); // "apple"（排序顺序）
System.out.println(sorted.getLast());  // "cherry"

// 对有序集合进行反向迭代
for (String s : sorted.reversed()) {
    System.out.println(s); // cherry, banana, apple
}
```

---

## 10.5 SequencedMap

`SequencedMap<K,V>` 添加了首尾条目访问和反转视图：

```java
public interface SequencedMap<K, V> extends Map<K, V> {
    Map.Entry<K,V> firstEntry();   // 空安全（为空时返回 null）
    Map.Entry<K,V> lastEntry();    // 空安全

    Map.Entry<K,V> pollFirstEntry(); // 移除并返回，或返回 null
    Map.Entry<K,V> pollLastEntry();  // 移除并返回，或返回 null

    K firstKey();   // 为空时抛出 NoSuchElementException
    K lastKey();

    V putFirst(K k, V v);  // 插入到开头
    V putLast(K k, V v);   // 插入到末尾

    SequencedMap<K,V> reversed();

    // 键、值、条目的有序视图：
    SequencedSet<K>            sequencedKeySet();
    SequencedCollection<V>     sequencedValues();
    SequencedSet<Map.Entry<K,V>> sequencedEntrySet();
}
```

用法：

```java
// LinkedHashMap 保持插入顺序——现在它是一个 SequencedMap
LinkedHashMap<String, Integer> scores = new LinkedHashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Carol", 92);

System.out.println(scores.firstEntry()); // Alice=95
System.out.println(scores.lastEntry());  // Carol=92
System.out.println(scores.firstKey());   // Alice

// 反向迭代——对 LRU 和"最近优先"排序至关重要
scores.reversed().forEach((name, score) ->
    System.out.println(name + ": " + score));
// Carol: 92, Bob: 87, Alice: 95

// 有序视图的流操作
String topScorer = scores.sequencedEntrySet().reversed().stream()
    .max(Map.Entry.comparingByValue())
    .map(Map.Entry::getKey)
    .orElseThrow();
System.out.println("Top scorer: " + topScorer); // Alice
```

---

## 10.6 集合实现矩阵

| 集合 | 实现的接口 | 备注 |
|-----------|-----------|-------|
| `ArrayList` | `SequencedCollection` | `addFirst`/`addLast` 的时间复杂度为 O(n)/O(1) |
| `LinkedList` | `SequencedCollection`，作为 Deque 使用时也实现 `SequencedSet` | 所有操作均为 O(1) |
| `ArrayDeque` | `SequencedCollection` | 所有操作均为 O(1) |
| `LinkedHashSet` | `SequencedSet` | 按插入顺序排列的集合 |
| `TreeSet` | `SequencedSet` | 按排序顺序排列的集合 |
| `LinkedHashMap` | `SequencedMap` | 按插入顺序排列的映射 |
| `TreeMap` | `SequencedMap` | 按排序顺序排列的映射 |

**未实现的集合**：`HashSet`、`HashMap`、`ArrayList`（对于 `SequencedSet`）——无序集合不实现这些接口。

---

## 10.7 迁移：替换 Java 21 之前的变通方案

```java
// 之前：
String last = list.get(list.size() - 1);       // 容易出错，冗长
String first = deque.isEmpty() ? null : deque.peekFirst(); // 空安全检查
for (Iterator<String> it = /* 反向迭代器 */; it.hasNext();) { ... }

// 之后：
String last  = list.getLast();
String first = deque.isEmpty() ? null : deque.getFirst();
for (String s : list.reversed()) { ... }
```

---

## 10.8 总结

有序集合（Sequenced Collections）填补了集合框架中一个早该解决的空白：

- **统一的首尾元素访问**：通过 `getFirst()`、`getLast()` 适用于所有有序集合
- **统一的修改操作**：通过 `addFirst()`、`addLast()`、`removeFirst()`、`removeLast()`
- **`reversed()` 实时视图**：实现简洁的反向迭代和流操作
- **`SequencedMap`**：将同样的统一性带入映射，提供条目级别的首尾访问

其影响虽然微妙但影响广泛：编写的通用代码可以跨 `List`、`Deque`、`LinkedHashSet`、`TreeSet`、`LinkedHashMap` 和 `TreeMap` 工作，无需进行 instanceof 检查或调用特定类型的方法。


---

# 第11章：记录模式（Record Patterns）

记录模式（Record Patterns，JEP 440，在 Java 21 中正式发布）将模式匹配（Pattern Matching）扩展为支持**记录值的解构（deconstruction）**。类型模式（Type Patterns）允许你测试和提取对象的类型，而记录模式则允许你在单个表达式中同时测试类型*并*解构其组件。结合密封类（Sealed Classes），这使得穷举性的、可读性强的、编译器验证的数据导航成为可能。

---

## 11.1 从类型模式到记录模式

类型模式（在 Java 16 中正式发布，见第3章）允许：

```java
if (obj instanceof String s) {
    System.out.println(s.length()); // s 被绑定为 String 类型
}
```

记录模式对此进行了扩展：如果 `obj` 是一个记录（Record），你可以**内联解构**其组件：

```java
record Point(double x, double y) {}

// 类型模式：提取整个记录
if (obj instanceof Point p) {
    System.out.println(p.x() + ", " + p.y()); // 调用访问器
}

// 记录模式：直接解构
if (obj instanceof Point(double x, double y)) {
    System.out.println(x + ", " + y); // 组件被直接绑定
}
```

---

## 11.2 记录解构模式语法

```java
record Person(String name, int age) {}
record Address(String street, String city, String country) {}
record Employee(Person person, Address address, String department) {}

// 在 instanceof 中使用：
if (emp instanceof Employee(Person p, Address a, String dept)) {
    System.out.println(p.name() + " in " + dept + " at " + a.city());
}

// 可以使用 var 来推断组件类型：
if (emp instanceof Employee(var p, var a, var dept)) {
    System.out.println(p.name() + ", " + dept);
}
```

---

## 11.3 嵌套记录模式

记录模式的真正威力在于**嵌套**——可以深入到任意层级的记录结构中：

```java
record Point(double x, double y) {}
record Line(Point start, Point end) {}
record BoundingBox(Line horizontal, Line vertical) {}

Object shape = new BoundingBox(
    new Line(new Point(0, 0), new Point(10, 0)),
    new Line(new Point(0, 0), new Point(0, 10))
);

// 嵌套解构——一个模式，处理所有层级
if (shape instanceof BoundingBox(
        Line(Point(double x1, double y1), Point(double x2, double y2)),
        Line(Point(double x3, double y3), Point(double x4, double y4)))) {
    System.out.printf("Width: %.1f, Height: %.1f%n",
        Math.abs(x2 - x1), Math.abs(y4 - y3));
}
```

将其与记录模式出现之前的写法进行比较：

```java
// 旧写法：冗长、容易出错、缺少穷举性检查
if (shape instanceof BoundingBox bb) {
    Line h = bb.horizontal();
    Line v = bb.vertical();
    Point start = h.start();
    Point end   = h.end();
    double width  = Math.abs(end.x() - start.x());
    double height = Math.abs(v.end().y() - v.start().y());
    System.out.printf("Width: %.1f, Height: %.1f%n", width, height);
}
```

记录模式版本更加简洁，并且编译器会验证结构的正确性。

---

## 11.4 switch 中的记录模式

记录模式可以在 switch 表达式和语句中使用——这是它们最能大放异彩的地方：

```java
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
record Triangle(double base, double height, double hypotenuse) implements Shape {}

double area(Shape shape) {
    return switch (shape) {
        case Circle(double r)                  -> Math.PI * r * r;
        case Rectangle(double w, double h)     -> w * h;
        case Triangle(double b, double h, var _) -> 0.5 * b * h;
    };
}

String describe(Shape shape) {
    return switch (shape) {
        case Circle(double r)    when r < 1 -> "tiny circle (r=" + r + ")";
        case Circle(double r)               -> "circle (r=" + r + ")";
        case Rectangle(double w, double h)
            when w == h                     -> "square (" + w + "x" + h + ")";
        case Rectangle(double w, double h)  -> "rectangle (" + w + "x" + h + ")";
        case Triangle(var b, var h, var hyp) -> "triangle";
    };
}
```

---

## 11.5 使用嵌套记录模式处理 AST

最引人注目的用例之一是处理抽象语法树（Abstract Syntax Tree, AST）或层次化数据模型：

```java
sealed interface Expr permits Num, Add, Mul, Neg, Var {}
record Num(double value) implements Expr {}
record Var(String name) implements Expr {}
record Add(Expr left, Expr right) implements Expr {}
record Mul(Expr left, Expr right) implements Expr {}
record Neg(Expr expr) implements Expr {}

// 计算表达式树
double eval(Expr expr, Map<String, Double> env) {
    return switch (expr) {
        case Num(double v)          -> v;
        case Var(String name)       -> env.getOrDefault(name, 0.0);
        case Neg(Expr inner)        -> -eval(inner, env);
        case Add(Expr l, Expr r)    -> eval(l, env) + eval(r, env);
        case Mul(Expr l, Expr r)    -> eval(l, env) * eval(r, env);
    };
}

// 常量折叠优化：Mul(Num(0), anything) = Num(0)
Expr simplify(Expr expr) {
    return switch (expr) {
        case Mul(Num(0.0), var _)     -> new Num(0);
        case Mul(var _, Num(0.0))     -> new Num(0);
        case Mul(Num(1.0), Expr e)    -> simplify(e);
        case Mul(Expr e, Num(1.0))    -> simplify(e);
        case Add(Num(0.0), Expr e)    -> simplify(e);
        case Add(Expr e, Num(0.0))    -> simplify(e);
        case Add(Expr l, Expr r)      -> new Add(simplify(l), simplify(r));
        case Mul(Expr l, Expr r)      -> new Mul(simplify(l), simplify(r));
        case Neg(Neg(Expr inner))     -> simplify(inner);  // 双重否定
        default                       -> expr;
    };
}
```

---

## 11.6 泛型记录模式

泛型记录（Generic Records）在模式中支持类型推断（Type Inference）：

```java
record Box<T>(T value) {}
record Pair<A, B>(A first, B second) {}

Object obj = new Box<>(new Pair<>("hello", 42));

if (obj instanceof Box(Pair(String s, Integer n))) {
    System.out.println(s + " -> " + n); // "hello -> 42"
}

// 在 switch 中使用：
String process(Object o) {
    return switch (o) {
        case Box(String s)          -> "String box: " + s;
        case Box(Integer n)         -> "Int box: " + n;
        case Box(Pair(var a, var b)) -> "Pair box: " + a + ", " + b;
        case Box(var v)             -> "Box: " + v;
        default                     -> "unknown";
    };
}
```

---

## 11.7 领域事件分发

记录模式在领域事件（Domain Event）处理方面表现出色：

```java
sealed interface OrderEvent permits
    OrderPlaced, PaymentReceived, ItemShipped, OrderCancelled {}

record OrderPlaced(String orderId, List<String> items, BigDecimal total)
    implements OrderEvent {}
record PaymentReceived(String orderId, String transactionId, BigDecimal amount)
    implements OrderEvent {}
record ItemShipped(String orderId, String trackingNumber)
    implements OrderEvent {}
record OrderCancelled(String orderId, String reason)
    implements OrderEvent {}

// 使用记录模式的事件处理器
String summarizeEvent(OrderEvent event) {
    return switch (event) {
        case OrderPlaced(var id, var items, var total) ->
            "Order %s placed: %d items, $%.2f".formatted(id, items.size(), total);

        case PaymentReceived(var id, var txnId, var amount) ->
            "Payment $%.2f received for order %s (txn: %s)".formatted(amount, id, txnId);

        case ItemShipped(var id, var tracking) ->
            "Order %s shipped, tracking: %s".formatted(id, tracking);

        case OrderCancelled(var id, var reason) ->
            "Order %s cancelled: %s".formatted(id, reason);
    };
}
```

---

## 11.8 记录模式与手动访问器调用的对比

```java
record Customer(String id, String name, Address address) {}
record Address(String street, String city, String zip) {}

// 记录模式出现之前：冗长，大量中间变量
void sendWelcome(Object obj) {
    if (obj instanceof Customer c) {
        String city = c.address().city();
        String name = c.name();
        emailService.send(c.id(), "Welcome " + name + " from " + city);
    }
}

// 使用记录模式：简洁，组件直接命名
void sendWelcomeV2(Object obj) {
    if (obj instanceof Customer(String id, String name, Address(var _, String city, var _))) {
        emailService.send(id, "Welcome " + name + " from " + city);
    }
}
```

---

## 11.9 总结

记录模式是记录（Records）和密封类（Sealed Classes）的天然补充：

- **直接在模式中解构记录组件**——无需中间变量，无需调用访问器
- **支持任意深度的嵌套**，可以深入复杂的记录层次结构
- **同时适用于 `instanceof` 和 `switch`**——与守卫模式（Guarded Patterns）无缝组合
- **结合密封接口（Sealed Interfaces）实现穷举匹配**
- **显著提升数据处理代码的可读性**——适用于 AST、领域事件、DTO 等场景
- **在 Java 21 中正式发布**——无需使用 `--enable-preview`

当你发现自己正在编写 `if (x instanceof Foo f) { var y = f.bar(); var z = y.baz(); }` 这样的代码时，那就是一个等待被改写为记录模式的信号。


---

# 第12章：Switch 的模式匹配（Pattern Matching for Switch） — 最终版

Switch 的模式匹配（Pattern Matching for Switch）（JEP 441，在 Java 21 中最终确定）完善了从 Java 16 中 `instanceof` 模式匹配开始的整个模式匹配体系。它允许 switch 表达式（switch expression）和 switch 语句（switch statement）匹配任意模式 — 类型模式（type pattern）、记录模式（record pattern）、守卫模式（guarded pattern） — 并提供完整的穷举性检查（exhaustiveness checking）。正是这一特性，使得记录类（record）+ 密封类（sealed class）+ switch 的组合成为了真正的代数数据类型（algebraic data type）系统。

---

## 12.1 演进历程：从 JEP 406（预览）到 JEP 441（最终版）

- **Java 17**（JEP 406）：第一次预览 — switch 中的类型模式
- **Java 18**（JEP 420）：第二次预览 — 改进语义，使用 `&&` 的守卫模式
- **Java 19**（JEP 427）：第三次预览 — 引入 `when` 子句用于守卫条件
- **Java 20**（JEP 433）：第四次预览 — 进一步改进
- **Java 21**（JEP 441）：**最终确定** — 无需预览标志

---

## 12.2 Switch 中的类型模式

```java
sealed interface JsonValue permits JsonNull, JsonBool, JsonNumber, JsonString,
                                   JsonArray, JsonObject {}
record JsonNull()                        implements JsonValue {}
record JsonBool(boolean value)           implements JsonValue {}
record JsonNumber(double value)          implements JsonValue {}
record JsonString(String value)          implements JsonValue {}
record JsonArray(List<JsonValue> items)  implements JsonValue {}
record JsonObject(Map<String, JsonValue> fields) implements JsonValue {}

// 类型模式 switch — 穷举匹配，无需 default
String jsonToString(JsonValue val) {
    return switch (val) {
        case JsonNull   n -> "null";
        case JsonBool   b -> String.valueOf(b.value());
        case JsonNumber n -> String.valueOf(n.value());
        case JsonString s -> "\"" + s.value().replace("\"", "\\\"") + "\"";
        case JsonArray  a -> "[" + a.items().stream()
                                    .map(this::jsonToString)
                                    .collect(Collectors.joining(", ")) + "]";
        case JsonObject o -> "{" + o.fields().entrySet().stream()
                                    .map(e -> "\"" + e.getKey() + "\": "
                                              + jsonToString(e.getValue()))
                                    .collect(Collectors.joining(", ")) + "}";
    };
}
```

---

## 12.3 守卫模式：`when` 子句

守卫模式为 case 分支添加了一个条件：

```java
double computeDiscount(Object customer) {
    return switch (customer) {
        case PremiumCustomer pc when pc.yearsActive() > 5 -> 0.25;
        case PremiumCustomer pc                           -> 0.15;
        case StandardCustomer sc when sc.totalSpend().compareTo(
                                           new BigDecimal("1000")) > 0  -> 0.10;
        case StandardCustomer sc                          -> 0.05;
        case null, default                                -> 0.0;
    };
}
```

顺序很重要：更具体的 case（带守卫条件的）必须出现在更通用的 case 之前。编译器会确保更具体的模式按照正确的顺序支配（dominate）更不具体的模式。

---

## 12.4 Switch 中的 Null 处理

在 Java 21 之前，将 `null` 传递给 switch 总是会抛出 `NullPointerException`。现在你可以显式处理它：

```java
// 显式 null case
String describe(Object obj) {
    return switch (obj) {
        case null         -> "null value";
        case Integer i    -> "integer: " + i;
        case String s     -> "string: " + s;
        case default      -> "other: " + obj;
    };
}

// 将 null 与其他 case 组合
String process(String input) {
    return switch (input) {
        case null, ""     -> "empty or null";
        case String s when s.length() > 100 -> "very long: " + s.substring(0, 20) + "...";
        case String s     -> "normal: " + s;
    };
}
```

---

## 12.5 穷举性：编译器保证

对于密封类型，编译器会验证所有情况是否都已覆盖：

```java
sealed interface Status permits Active, Inactive, Suspended {}
record Active(Instant since)                    implements Status {}
record Inactive(Instant since, String reason)   implements Status {}
record Suspended(Instant until, String cause)   implements Status {}

String statusMessage(Status status) {
    return switch (status) {
        case Active(var since)              -> "Active since " + since;
        case Inactive(var since, var reason) -> "Inactive since " + since + ": " + reason;
        case Suspended(var until, var cause) -> "Suspended until " + until + ": " + cause;
        // 无需 default — 密封类型保证了穷举性
    };
}
// 如果你向 Status 添加了新的允许子类型，
// 编译器会报错："switch expression does not cover all possible input values"
```

---

## 12.6 支配规则

模式 case 具有**支配**（dominance）顺序：如果模式 P 支配模式 Q，则 Q 必须出现在 P 之后：

```java
// 编译错误：'case Object o' 支配了 'case String s'
// String o = switch (obj) {
//     case Object o -> "object";  // 过于宽泛 — 编译器报错
//     case String s -> "string";
// };

// 正确写法：更具体的模式在前
String describe(Object obj) {
    return switch (obj) {
        case String s when s.isEmpty() -> "empty string";  // 最具体
        case String s                  -> "string: " + s;  // 较不具体
        case Integer i                 -> "integer: " + i;
        case null                      -> "null";
        default                        -> "other";
    };
}
```

---

## 12.7 使用模式匹配的完整表达式求值器

一个完整且实用的示例，结合了密封类、记录模式和 switch：

```java
sealed interface Expr permits Lit, Add, Sub, Mul, Div, Neg, Var, Let {}
record Lit(double value)             implements Expr {}
record Var(String name)              implements Expr {}
record Add(Expr left, Expr right)    implements Expr {}
record Sub(Expr left, Expr right)    implements Expr {}
record Mul(Expr left, Expr right)    implements Expr {}
record Div(Expr left, Expr right)    implements Expr {}
record Neg(Expr expr)                implements Expr {}
record Let(String var, Expr value, Expr body) implements Expr {}

// 求值器
static double eval(Expr expr, Map<String, Double> env) {
    return switch (expr) {
        case Lit(double v)                 -> v;
        case Var(String name)              -> {
            var val = env.get(name);
            if (val == null) throw new RuntimeException("Unbound variable: " + name);
            yield val;
        }
        case Add(Expr l, Expr r)           -> eval(l, env) + eval(r, env);
        case Sub(Expr l, Expr r)           -> eval(l, env) - eval(r, env);
        case Mul(Expr l, Expr r)           -> eval(l, env) * eval(r, env);
        case Div(Expr l, Expr r)           -> {
            double divisor = eval(r, env);
            if (divisor == 0.0) throw new ArithmeticException("Division by zero");
            yield eval(l, env) / divisor;
        }
        case Neg(Expr inner)               -> -eval(inner, env);
        case Let(String var, Expr val, Expr body) -> {
            var newEnv = new HashMap<>(env);
            newEnv.put(var, eval(val, env));
            yield eval(body, newEnv);
        }
    };
}

// 美化打印器
static String prettyPrint(Expr expr) {
    return switch (expr) {
        case Lit(double v)              -> String.valueOf(v);
        case Var(String name)           -> name;
        case Neg(Expr e)                -> "(-" + prettyPrint(e) + ")";
        case Add(Expr l, Expr r)        -> "(" + prettyPrint(l) + " + " + prettyPrint(r) + ")";
        case Sub(Expr l, Expr r)        -> "(" + prettyPrint(l) + " - " + prettyPrint(r) + ")";
        case Mul(Expr l, Expr r)        -> "(" + prettyPrint(l) + " * " + prettyPrint(r) + ")";
        case Div(Expr l, Expr r)        -> "(" + prettyPrint(l) + " / " + prettyPrint(r) + ")";
        case Let(String v, Expr val, Expr body) ->
            "let " + v + " = " + prettyPrint(val) + " in " + prettyPrint(body);
    };
}
```

---

## 12.8 Switch 中的 default 与 `_`

`default` 和 `_`（未命名模式，unnamed pattern）都可以捕获未匹配的情况：

```java
// 'default' — 传统方式，匹配非 null 值，如果 null 未被处理则也匹配 null
String x = switch (val) {
    case String s -> "string";
    default -> "other";
};

// '_' — 未命名模式，匹配所有剩余情况（非 null）
String y = switch (val) {
    case String s -> "string";
    case _ -> "other";
};

// 区别：如果没有模式匹配到 null，'default' 也会尝试匹配 null
// '_' 是一个模式，不匹配 null
```

---

## 12.9 总结

Switch 的模式匹配在 Java 21 中最终确定，是模式匹配演进历程的集大成之作：

- **类型模式**在 switch 中实现简洁的分发，无需强制类型转换
- **守卫模式**通过 `when` 实现条件性的 case 细化
- **Null 处理**通过显式的 `case null` 实现
- **穷举性检查**配合密封类型 — 编译器验证的完整性
- **记录模式**在 switch 分支中 — 在一个操作中完成解构和测试
- **支配规则**由编译器强制执行 — 不存在歧义的 case 排序

结合记录类和密封类，这使得 Java 成为一门实用的语言，能够构建类型安全的、穷举处理的数据模型，可与 Kotlin 的 `when` 表达式和 Scala 的 match 表达式相媲美。


---

# 第13章：外部函数和内存 API（Foreign Function and Memory API）

外部函数和内存 API（Foreign Function and Memory API，JEP 454，在 Java 21 中正式发布）是 Panama 项目（Project Panama）的成果——这是一项历时多年的工作，旨在用一套更安全、更具表达力的 API 来替代 JNI（Java Native Interface），用于调用本地代码和操作本地内存。如果你曾经被 JNI 的样板代码、手写 C 头文件或不安全的 `Unsafe` 用法所困扰，那么 FFM API 就是现代化的解决方案。

---

## 13.1 为什么 JNI 需要被替代

JNI（Java Native Interface）自 Java 1.1 起就服务于 Java，但它存在众所周知的问题：

- **冗长繁琐**：编写 JNI 需要生成 C 头文件（`javah`）、编写 C 实现、加载共享库
- **默认不安全**：本地内存操作完全没有检查
- **容易出错**：C 端的 JNI 代码将 Java 对象处理与本地代码混合在一起——很容易导致 JVM 崩溃
- **开发体验差**：没有 IDE 支持，需要手动类型映射，出错时直接崩溃退出

```c
// JNI: C code required for every native method
JNIEXPORT jstring JNICALL
Java_com_example_Native_greet(JNIEnv *env, jobject obj, jstring name) {
    const char *nativeName = (*env)->GetStringUTFChars(env, name, NULL);
    char buffer[256];
    snprintf(buffer, sizeof(buffer), "Hello, %s!", nativeName);
    (*env)->ReleaseStringUTFChars(env, name, nativeName);
    return (*env)->NewStringUTF(env, buffer);
}
```

FFM API 在许多使用场景中完全消除了 C 端代码的需要。

---

## 13.2 核心抽象

| 类 | 用途 |
|-------|---------|
| `MemorySegment` | 一段连续的内存区域（堆内或堆外） |
| `MemoryLayout` | 描述内存的结构（结构体、联合体、数组） |
| `Arena` | 控制本地内存分配的生命周期 |
| `Linker` | 将 Java 方法句柄（method handle）链接到本地函数 |
| `SymbolLookup` | 在共享库中查找本地函数符号 |
| `FunctionDescriptor` | 描述本地函数的参数类型和返回类型 |

---

## 13.3 Arena：管理本地内存生命周期

`Arena` 是关键的安全原语（safety primitive）。通过 Arena 分配的所有本地内存会在 Arena 关闭时释放——无需手动调用 `free()`：

```java
import java.lang.foreign.*;

// Confined Arena: single-threaded, closed with try-with-resources
try (Arena arena = Arena.ofConfined()) {
    // Allocate 1024 bytes of native memory, managed by this arena
    MemorySegment buffer = arena.allocate(1024);

    // Write to it
    buffer.set(ValueLayout.JAVA_INT, 0, 42);

    // Read from it
    int value = buffer.get(ValueLayout.JAVA_INT, 0);
    System.out.println(value); // 42

} // arena closes here, native memory is freed automatically

// Shared Arena: multi-threaded, closed explicitly
Arena shared = Arena.ofShared();
MemorySegment sharedBuffer = shared.allocate(4096);
// ... use from multiple threads ...
shared.close();

// Auto Arena: freed by GC when segment becomes unreachable
Arena auto = Arena.ofAuto();
MemorySegment autoBuffer = auto.allocate(512);
// Freed when GC collects — no explicit close needed (but unpredictable timing)

// Global Arena: never freed — for library-lifetime resources
MemorySegment globalBuffer = Arena.global().allocate(256);
```

---

## 13.4 MemoryLayout：描述 C 结构体

`MemoryLayout` 以类型安全的方式描述 C 数据的结构：

```java
import java.lang.foreign.*;
import java.lang.invoke.VarHandle;

// Equivalent to the C struct:
// struct Point { int32_t x; int32_t y; };
StructLayout pointLayout = MemoryLayout.structLayout(
    ValueLayout.JAVA_INT.withName("x"),
    ValueLayout.JAVA_INT.withName("y")
);

// Struct with padding
// struct Aligned { int8_t flag; /* 3 bytes padding */ int32_t value; };
StructLayout alignedLayout = MemoryLayout.structLayout(
    ValueLayout.JAVA_BYTE.withName("flag"),
    MemoryLayout.paddingLayout(3),  // explicit padding
    ValueLayout.JAVA_INT.withName("value")
);

// Array of structs
SequenceLayout arrayOfPoints = MemoryLayout.sequenceLayout(10, pointLayout);

// VarHandle for structured access
VarHandle xHandle = pointLayout.varHandle(MemoryLayout.PathElement.groupElement("x"));
VarHandle yHandle = pointLayout.varHandle(MemoryLayout.PathElement.groupElement("y"));

try (Arena arena = Arena.ofConfined()) {
    MemorySegment point = arena.allocate(pointLayout);
    xHandle.set(point, 0L, 5);    // set x = 5
    yHandle.set(point, 0L, 10);   // set y = 10

    int x = (int) xHandle.get(point, 0L); // get x
    int y = (int) yHandle.get(point, 0L); // get y
    System.out.println("x=" + x + ", y=" + y); // x=5, y=10
}
```

---

## 13.5 调用本地函数：strlen 示例

`Linker` 将 Java 方法句柄连接到本地 C 函数：

```java
import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;

public class NativeStringLength {

    private static final Linker LINKER = Linker.nativeLinker();
    private static final SymbolLookup STDLIB = LINKER.defaultLookup();

    // Load strlen from the standard C library
    private static final MethodHandle STRLEN;
    static {
        STRLEN = LINKER.downcallHandle(
            STDLIB.findOrThrow("strlen"),
            FunctionDescriptor.of(
                ValueLayout.JAVA_LONG,   // return type: size_t (long on 64-bit)
                ValueLayout.ADDRESS      // parameter: const char*
            )
        );
    }

    public static long strlen(String s) throws Throwable {
        try (Arena arena = Arena.ofConfined()) {
            // Convert Java String to C string (null-terminated)
            MemorySegment cString = arena.allocateFrom(s);
            return (long) STRLEN.invokeExact(cString);
        }
    }

    public static void main(String[] args) throws Throwable {
        System.out.println(strlen("Hello, World!")); // 13
        System.out.println(strlen("Java 21 FFM API")); // 15
    }
}
```

---

## 13.6 操作 C 结构体：分配与读取

一个更实际的示例：分配并读取 C `timespec` 结构体：

```java
import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.VarHandle;

public class TimeExample {
    private static final Linker LINKER = Linker.nativeLinker();
    private static final SymbolLookup STDLIB = LINKER.defaultLookup();

    // struct timespec { long tv_sec; long tv_nsec; };
    static final StructLayout TIMESPEC = MemoryLayout.structLayout(
        ValueLayout.JAVA_LONG.withName("tv_sec"),
        ValueLayout.JAVA_LONG.withName("tv_nsec")
    );

    static final VarHandle TV_SEC  =
        TIMESPEC.varHandle(MemoryLayout.PathElement.groupElement("tv_sec"));
    static final VarHandle TV_NSEC =
        TIMESPEC.varHandle(MemoryLayout.PathElement.groupElement("tv_nsec"));

    // clock_gettime(clockid_t, struct timespec*) -> int
    static final MethodHandle CLOCK_GETTIME = LINKER.downcallHandle(
        STDLIB.findOrThrow("clock_gettime"),
        FunctionDescriptor.of(
            ValueLayout.JAVA_INT,
            ValueLayout.JAVA_INT,
            ValueLayout.ADDRESS
        )
    );

    public static long getMonotonicNanos() throws Throwable {
        int CLOCK_MONOTONIC = 1;
        try (Arena arena = Arena.ofConfined()) {
            MemorySegment ts = arena.allocate(TIMESPEC);
            int result = (int) CLOCK_GETTIME.invokeExact(CLOCK_MONOTONIC, ts);
            if (result != 0) throw new RuntimeException("clock_gettime failed: " + result);

            long seconds = (long) TV_SEC.get(ts, 0L);
            long nanos   = (long) TV_NSEC.get(ts, 0L);
            return seconds * 1_000_000_000L + nanos;
        }
    }
}
```

---

## 13.7 加载外部库

```java
// Load a custom shared library
SymbolLookup myLib = SymbolLookup.libraryLookup(
    Path.of("/usr/local/lib/libmymath.so"),
    Arena.ofAuto()
);

// Or load by name (searches LD_LIBRARY_PATH / system paths)
SymbolLookup mathLib = SymbolLookup.libraryLookup("m", Arena.ofAuto()); // libm

// double pow(double base, double exp)
MethodHandle POW = LINKER.downcallHandle(
    mathLib.findOrThrow("pow"),
    FunctionDescriptor.of(
        ValueLayout.JAVA_DOUBLE,
        ValueLayout.JAVA_DOUBLE,
        ValueLayout.JAVA_DOUBLE
    )
);

double result = (double) POW.invokeExact(2.0, 10.0); // 1024.0
```

---

## 13.8 上行调用（Upcall）：从本地代码回调 Java

FFM API 还支持**上行调用（upcall）**——将 Java 方法句柄作为 C 函数指针传递给本地代码：

```java
import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class QSortExample {

    private static final Linker LINKER = Linker.nativeLinker();
    private static final SymbolLookup STDLIB = LINKER.defaultLookup();

    // C comparator: int compare(const void* a, const void* b)
    static int intCompare(MemorySegment a, MemorySegment b) {
        int x = a.get(ValueLayout.JAVA_INT, 0);
        int y = b.get(ValueLayout.JAVA_INT, 0);
        return Integer.compare(x, y);
    }

    public static void qsort(int[] array) throws Throwable {
        MethodHandle compareHandle = MethodHandles.lookup()
            .findStatic(QSortExample.class, "intCompare",
                MethodType.methodType(int.class, MemorySegment.class, MemorySegment.class));

        FunctionDescriptor comparatorDesc = FunctionDescriptor.of(
            ValueLayout.JAVA_INT,
            ValueLayout.ADDRESS,
            ValueLayout.ADDRESS
        );

        try (Arena arena = Arena.ofConfined()) {
            // Create a native function pointer wrapping our Java method
            MemorySegment comparatorPtr =
                LINKER.upcallStub(compareHandle, comparatorDesc, arena);

            // Allocate native array and copy Java array into it
            MemorySegment nativeArray =
                arena.allocateFrom(ValueLayout.JAVA_INT, array);

            // void qsort(void* base, size_t nmemb, size_t size, comparator)
            MethodHandle QSORT = LINKER.downcallHandle(
                STDLIB.findOrThrow("qsort"),
                FunctionDescriptor.ofVoid(
                    ValueLayout.ADDRESS,
                    ValueLayout.JAVA_LONG,
                    ValueLayout.JAVA_LONG,
                    ValueLayout.ADDRESS
                )
            );

            QSORT.invokeExact(nativeArray, (long) array.length,
                              (long) ValueLayout.JAVA_INT.byteSize(), comparatorPtr);

            // Copy sorted values back to Java array
            MemorySegment.copy(nativeArray, ValueLayout.JAVA_INT, 0,
                               array, 0, array.length);
        }
    }
}
```

---

## 13.9 FFM 与 JNI：对比

| 方面 | JNI | FFM API（Java 21） |
|--------|-----|-------------------|
| 需要 C 样板代码 | 是（每个方法都需要） | 否 |
| 类型安全 | 弱（C 端无检查） | 强（布局经过验证） |
| 内存安全 | 无——可能导致 JVM 崩溃 | Arena 管理，安全 |
| 工具支持 | javah（已废弃） | jextract（自动生成绑定） |
| 性能 | 优秀 | 相当（JIT 优化） |
| 空终止字符串 | 手动处理 | `allocateFrom(String)` |
| 结构体映射 | 手动偏移量计算 | `MemoryLayout.structLayout()` |
| 上行调用（Java 回调 C） | 复杂 | `Linker.upcallStub()` |

---

## 13.10 总结

外部函数和内存 API 消除了 JNI 的痛点：

- **`Arena`** 安全地管理本地内存生命周期——无需手动 `free()`
- **`MemorySegment`** 提供对本地内存区域的类型安全访问
- **`MemoryLayout`** 描述 C 结构体布局，包括填充（padding）和对齐（alignment）
- **`Linker`** 将 Java `MethodHandle` 连接到本地 C 函数
- **`SymbolLookup`** 在共享库中查找符号
- **上行调用（Upcall）** 允许将 Java 回调作为函数指针传递给本地代码
- **在 Java 21 中正式发布** ——已可用于生产环境，替代 JNI 用于新的互操作代码

对于有大量本地互操作需求的项目，可以将 FFM API 与 `jextract`（可从 OpenJDK 工具集获取）配合使用，从 C 头文件自动生成 Java 绑定。


---

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


---

# 第15章：作用域值（Scoped Values）— 正式定稿（JEP 506，Java 25）

作用域值（Scoped Values）在 Java 25 中完成了它的演进之旅：经过一轮孵化（Java 20）和四轮预览（Java 21–24），JEP 506 将该 API **正式定稿，与 Java 24 预览版相比没有任何变更**。这一稳定性意义重大——它意味着你可能已经在生产环境中使用的 Java 21 预览版本，可以在无需修改任何代码的情况下迁移到最终版本。

---

## 15.1 演进之路：从预览到正式定稿

| 版本 | JEP | 状态 |
|---------|-----|--------|
| Java 20 | JEP 429 | 孵化器（Incubator） |
| Java 21 | JEP 446 | 第1次预览 |
| Java 22 | JEP 464 | 第2次预览 |
| Java 23 | JEP 481 | 第3次预览 |
| Java 24 | JEP 487 | 第4次预览 |
| **Java 25** | **JEP 506** | **正式版（Final）** |

经过四轮预览，产生了一个稳定且被充分理解的 API。在 Java 25 中的正式定稿意味着不再需要 `--enable-preview`，该 API 已完全成为 `java.lang` 的一部分。

---

## 15.2 最终 API 参考

```java
// 核心类: java.lang.ScopedValue<T>
public final class ScopedValue<T> {
    // Factory
    public static <T> ScopedValue<T> newInstance();

    // Binding builder
    public static <T> Carrier where(ScopedValue<T> key, T value);

    // Reading
    public T get();                   // throws NoSuchElementException if not bound
    public Optional<T> orElse(T other); // returns other if not bound (wait — see below)
    public boolean isBound();

    // Carrier (binding builder) class
    public static final class Carrier {
        public <T> Carrier where(ScopedValue<T> key, T value);
        public void run(Runnable op);
        public <R> R call(Callable<R> op) throws Exception;
    }
}
```

关于 `orElse()` 有一个重要的 API 说明：该方法的实际签名为：
```java
public T orElse(T other);
```

如果作用域值在当前作用域中未绑定，则返回 `other` 而不是抛出异常。

---

## 15.3 不可变性保证与 JVM 优化

现在作用域值已正式定稿，JVM 可以应用更强的优化：

**常量折叠（Constant-folding）**：在绑定作用域内，JVM 将 `scopedValue.get()` 视为常量——它可以被内联到本机代码中，并在 JIT 优化的快速路径中使用。

**无易失性读取（No volatile reads）**：与需要内存屏障（Memory Barrier）的 `ThreadLocal` 不同，作用域值的读取是无锁的，在许多情况下其开销与读取局部变量一样低。

```java
// The JVM can optimize this:
static final ScopedValue<RequestConfig> CONFIG = ScopedValue.newInstance();

void innerHotPath() {
    // This get() is effectively a constant within the scope — JIT can inline it
    RequestConfig cfg = CONFIG.get();
    // Use cfg in tight loop — cfg read is essentially free
    for (int i = 0; i < 1_000_000; i++) {
        process(cfg.timeout(), cfg.retries());
    }
}
```

---

## 15.4 生产环境模式：框架集成

### Spring 风格的请求上下文

```java
public class RequestContextHolder {
    // Standard scoped values for web request context
    public static final ScopedValue<Principal> PRINCIPAL =
        ScopedValue.newInstance();
    public static final ScopedValue<String> REQUEST_ID =
        ScopedValue.newInstance();
    public static final ScopedValue<Span> TRACE_SPAN =
        ScopedValue.newInstance();
    public static final ScopedValue<String> TENANT_ID =
        ScopedValue.newInstance();

    /**
     * Execute the given operation with the specified request context.
     * All context values are automatically cleaned up when the operation completes.
     */
    public static <T> T withContext(RequestContext ctx, Callable<T> operation)
            throws Exception {
        return ScopedValue.where(PRINCIPAL,   ctx.principal())
                          .where(REQUEST_ID,  ctx.requestId())
                          .where(TRACE_SPAN,  ctx.span())
                          .where(TENANT_ID,   ctx.tenantId())
                          .call(operation);
    }
}

// Usage in a servlet filter:
public class ContextFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws Exception {
        RequestContext ctx = buildContext((HttpServletRequest) req);
        RequestContextHolder.withContext(ctx, () -> {
            chain.doFilter(req, resp);
            return null;
        });
    }
}

// Usage deep in the call stack — no parameter threading required:
@Repository
public class AuditRepository {
    public void save(String action) {
        String requestId = RequestContextHolder.REQUEST_ID.orElse("unknown");
        Principal principal = RequestContextHolder.PRINCIPAL.isBound()
            ? RequestContextHolder.PRINCIPAL.get()
            : null;
        // persist audit record...
    }
}
```

---

## 15.5 作用域值作为能力令牌（Capability Token）

作用域值可以承载类型化的能力令牌，用于控制对功能的访问：

```java
public final class AdminCapability {
    // Private constructor — only grantable through the factory
    private AdminCapability() {}

    public static final ScopedValue<AdminCapability> GRANTED =
        ScopedValue.newInstance();

    public static <T> T withAdminAccess(Callable<T> operation) throws Exception {
        return ScopedValue.where(GRANTED, new AdminCapability()).call(operation);
    }

    public static boolean hasAdminAccess() {
        return GRANTED.isBound();
    }
}

// In a service:
public void deleteAccount(String accountId) {
    if (!AdminCapability.hasAdminAccess()) {
        throw new SecurityException("Admin capability required to delete account");
    }
    // proceed with deletion
}

// In a test or admin controller:
AdminCapability.withAdminAccess(() -> {
    userService.deleteAccount(testAccountId);
    return null;
});
```

---

## 15.6 作用域值与记录载体（Record Carriers）

使用记录（Record）作为类型化的上下文载体（Carrier），使作用域值具有自文档化特性：

```java
// Rich request context as a record
record RequestContext(
    String requestId,
    String userId,
    String tenantId,
    Instant receivedAt,
    String clientIp
) {}

// Single scoped value carrying the whole context
public static final ScopedValue<RequestContext> REQUEST =
    ScopedValue.newInstance();

// In middleware:
RequestContext ctx = new RequestContext(
    UUID.randomUUID().toString(),
    extractUserId(httpRequest),
    extractTenantId(httpRequest),
    Instant.now(),
    httpRequest.getRemoteAddr()
);

ScopedValue.where(REQUEST, ctx).run(() -> handleRequest(httpRequest));

// In any downstream service:
void logAction(String action) {
    REQUEST.ifPresent(ctx ->    // hypothetical — use isBound() + get()
        auditLog.record(ctx.requestId(), ctx.userId(), action));
}

// Practical version:
void logActionV2(String action) {
    if (REQUEST.isBound()) {
        RequestContext ctx = REQUEST.get();
        auditLog.record(ctx.requestId(), ctx.userId(), action);
    }
}
```

---

## 15.7 测试使用作用域值的代码

测试依赖作用域值的代码非常简单，因为你可以完全控制绑定：

```java
class OrderServiceTest {

    private static final RequestContext TEST_CONTEXT = new RequestContext(
        "test-req-001", "user-test", "tenant-abc", Instant.now(), "127.0.0.1"
    );

    @Test
    void shouldAuditOrderPlacement() throws Exception {
        // Arrange
        ScopedValue.where(RequestContextHolder.REQUEST, TEST_CONTEXT).run(() -> {
            // Act
            orderService.placeOrder(new PlaceOrderRequest("product-1", 2));

            // Assert — audit log should contain the request context
            verify(auditLog).record(
                eq("test-req-001"),
                eq("user-test"),
                contains("ORDER_PLACED")
            );
        });
    }

    @Test
    void shouldHandleUnboundScopedValue() {
        // Test code path where scoped value is NOT bound
        // (e.g., batch processing job without HTTP context)
        assertDoesNotThrow(() -> orderService.processBackgroundJob("job-1"));
        // Verify graceful handling when REQUEST is not bound
    }
}
```

---

## 15.8 总结

在 Java 25 中正式定稿的作用域值（Scoped Values）提供了：

- **生产就绪**，无需 `--enable-preview`
- **不可变、作用域受限的上下文** —— 无需手动清理，虚拟线程（Virtual Threads）下不会发生内存泄漏
- **自动继承**结构化并发（Structured Concurrency）任务树中的值
- **JVM 优化的读取** —— 常量折叠和无锁访问
- **简洁的测试方式** —— 在测试中通过 `where(...).run(...)` 显式绑定上下文
- **从 Java 21 预览版零迁移成本** —— API 自第4次预览以来未做任何更改

对于任何需要按请求传播上下文的 Java 25+ 新代码，`ScopedValue` 就是最终答案。`ThreadLocal` 的时代已经结束。


---

# 第16章：Java 25 中的结构化并发（Structured Concurrency）（JEP 505 — 第5次预览）

结构化并发（Structured Concurrency）在 Java 25 中通过 JEP 505 继续其预览演进。与 Java 21 预览版（第8章）相比，最重要的变化是引入了新的 `StructuredTaskScope.open()` 工厂方法（Factory Method）和可插拔的 `Joiner` 接口，取代了之前基于子类化的 `ShutdownOnFailure` 和 `ShutdownOnSuccess` 模型。

---

## 16.1 自 Java 21 以来的 API 改进

Java 21 的 API 要求通过子类化 `StructuredTaskScope` 来创建自定义的合并策略（Join Policy）。Java 25 的 API 引入了更简洁的设计：

| Java 21 API | Java 25 API |
|-------------|-------------|
| `new StructuredTaskScope.ShutdownOnFailure()` | `StructuredTaskScope.open(Joiner.awaitAll())` 或 `StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())` |
| `new StructuredTaskScope.ShutdownOnSuccess<T>()` | `StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())` |
| 自定义子类 | 实现 `Joiner<T, R>` 接口 |
| `scope.join()` 然后 `scope.throwIfFailed()` | `scope.join()` 直接返回 Joiner 的结果 |

---

## 16.2 StructuredTaskScope.open() — 新的工厂方法

```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Joiner;
import java.util.concurrent.StructuredTaskScope.Subtask;

// Java 25 风格 — 使用 Joiner 的 open()
public OrderDetail getOrderDetail(String orderId) throws Exception {
    try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {

        Subtask<Order>    orderTask = scope.fork(() -> orderService.find(orderId));
        Subtask<Customer> custTask  = scope.fork(() -> customerService.find(orderId));

        // join() 返回 Joiner 的结果 — 在此例中为 Void（全部成功或全部失败）
        scope.join();

        return new OrderDetail(orderTask.get(), custTask.get());
    }
}
```

---

## 16.3 内置 Joiner

### Joiner.allSuccessfulOrThrow() — 替代 ShutdownOnFailure

```java
// 所有任务必须成功；如果任何一个失败则抛出第一个异常
try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
    var task1 = scope.fork(() -> serviceA.call());
    var task2 = scope.fork(() -> serviceB.call());
    scope.join(); // 如果任何任务失败则抛出异常

    String a = task1.get();
    String b = task2.get();
    return a + b;
}
```

### Joiner.anySuccessfulResultOrThrow() — 替代 ShutdownOnSuccess

```java
// 返回第一个成功的结果；如果所有任务都失败则抛出异常
try (var scope = StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())) {
    scope.fork(() -> primaryEndpoint.call());
    scope.fork(() -> fallbackEndpoint.call());

    String result = scope.join(); // 返回第一个成功的结果
    return result;
}
```

### Joiner.awaitAll() — 等待全部完成，不快速失败

```java
// 等待所有任务完成，不管是否有失败；手动收集结果
try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    var task1 = scope.fork(() -> serviceA.call());
    var task2 = scope.fork(() -> serviceB.call());
    var task3 = scope.fork(() -> serviceC.call());

    scope.join(); // 等待所有任务完成；失败时不抛出异常

    // 处理结果，包括部分失败的情况
    var results = new ArrayList<String>();
    var errors  = new ArrayList<String>();

    for (var task : List.of(task1, task2, task3)) {
        switch (task.state()) {
            case SUCCESS     -> results.add(task.get());
            case FAILED      -> errors.add(task.exception().getMessage());
            case UNAVAILABLE -> errors.add("cancelled");
        }
    }

    if (!errors.isEmpty()) {
        log.warn("Partial failure: {}", errors);
    }
    return results;
}
```

---

## 16.4 自定义 Joiner 实现

`Joiner<T, R>` 接口允许构建完全自定义的合并策略：

```java
// 自定义 Joiner：收集所有成功的结果，忽略失败
// T = 任务结果类型，R = Joiner 结果类型
class CollectSuccessful<T> implements Joiner<T, List<T>> {
    private final List<T> results = new CopyOnWriteArrayList<>();

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        if (subtask.state() == Subtask.State.SUCCESS) {
            results.add(subtask.get());
        }
        return false; // 不因任何单个任务完成而关闭作用域
    }

    @Override
    public List<T> result() {
        return Collections.unmodifiableList(results);
    }
}

// 用法：
try (var scope = StructuredTaskScope.open(new CollectSuccessful<String>())) {
    urls.forEach(url -> scope.fork(() -> httpClient.fetch(url)));
    List<String> successful = scope.join(); // 仅返回成功的结果
}
```

另一个自定义 Joiner — 支持超时的部分结果收集器：

```java
class TimeBoundedJoiner<T> implements Joiner<T, List<T>> {
    private final Duration timeout;
    private final List<T> results = new CopyOnWriteArrayList<>();
    private final long startNanos = System.nanoTime();

    TimeBoundedJoiner(Duration timeout) {
        this.timeout = timeout;
    }

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        if (subtask.state() == Subtask.State.SUCCESS) {
            results.add(subtask.get());
        }
        // 如果超时则关闭作用域
        long elapsed = System.nanoTime() - startNanos;
        return elapsed >= timeout.toNanos();
    }

    @Override
    public List<T> result() {
        return Collections.unmodifiableList(results);
    }
}
```

---

## 16.5 子任务状态（Subtask States）

```java
// Subtask.State 与 Java 21 中相同：
enum State {
    UNAVAILABLE, // 任务已分叉但作用域尚未合并，或任务已被取消
    SUCCESS,     // 正常完成
    FAILED       // 以异常完成
}
```

---

## 16.6 与作用域值（Scoped Values）的集成（在 Java 25 中已最终确定）

在 Java 25 中，结构化并发和作用域值（Scoped Values）要么已最终确定，要么处于后期预览阶段 — 它们可以无缝集成：

```java
public static final ScopedValue<String> TENANT = ScopedValue.newInstance();
public static final ScopedValue<User> USER     = ScopedValue.newInstance();

public TenantReport generateReport(String tenantId, User user) throws Exception {
    return ScopedValue.where(TENANT, tenantId)
                      .where(USER,   user)
                      .call(() -> {
        try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
            // 每个分叉的任务自动继承 TENANT 和 USER
            var orders   = scope.fork(() -> orderService.getOrders());
            var invoices = scope.fork(() -> invoiceService.getInvoices());
            var metrics  = scope.fork(() -> metricsService.getMetrics());

            scope.join();

            return new TenantReport(
                orders.get(), invoices.get(), metrics.get(),
                TENANT.get(), USER.get()
            );
        }
    });
}
```

---

## 16.7 生产环境模式

### 断路器模式（Circuit Breaker Pattern）

```java
class CircuitBreakerJoiner<T> implements Joiner<T, Optional<T>> {
    private final int maxFailures;
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private volatile T successResult;

    CircuitBreakerJoiner(int maxFailures) {
        this.maxFailures = maxFailures;
    }

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        return switch (subtask.state()) {
            case SUCCESS -> {
                successResult = subtask.get();
                yield true; // 已获得结果，关闭作用域
            }
            case FAILED -> failureCount.incrementAndGet() >= maxFailures;
            case UNAVAILABLE -> false;
        };
    }

    @Override
    public Optional<T> result() {
        return Optional.ofNullable(successResult);
    }
}
```

---

## 16.8 何时使用：结构化并发 vs CompletableFuture vs 响应式编程

第8章中的指导原则仍然适用，Java 25 增加了更多细微考量：

- **结构化并发（Structured Concurrency）**：适用于具有明确任务集和结构化结果的并行 I/O 操作。与虚拟线程（Virtual Threads）天然配合。
- **CompletableFuture**：当不需要完整的生命周期管理时，仍然适用于简单的异步组合。新代码建议优先使用结构化并发。
- **响应式流（Reactive Streams）（Reactor、RxJava）**：当需要**背压（Backpressure）**时使用 — 例如从慢速生产者流式传输数据、消费者控制速率的处理管道。

---

## 16.9 总结

Java 25 中的结构化并发（第5次预览）带来了：

- **`StructuredTaskScope.open(joiner)`** — 比子类化更简洁的工厂方法
- **`Joiner` 接口** — 可插拔的合并策略：`allSuccessfulOrThrow()`、`anySuccessfulResultOrThrow()`、`awaitAll()`
- **自定义 Joiner** — 可实现任意收集/关闭策略
- **自动继承作用域值（Scoped Values）** — 分叉的任务可以看到父任务的作用域值绑定
- **改进的线程转储（Thread Dumps）** — 层次化的任务结构在 JVM 诊断工具中可见

在 Java 25 中仍需使用 `--enable-preview`。预计将在 Java 27 或下一个 LTS 版本中最终确定。


---

# 第17章：灵活的构造函数体（Flexible Constructor Bodies）（JEP 492，Java 25 正式发布）

灵活的构造函数体（Flexible Constructor Bodies）——也被非正式地称为"super() 之前的语句（Statements before super()）"——在 Java 25 中正式定稿，此前曾在 Java 22（JEP 447）和 Java 23（JEP 482）中作为预览功能（Preview）发布。该特性放宽了长期以来的限制，即 `super()` 或 `this()` 必须是构造函数中的*第一条语句*，允许某些语句出现在超类构造函数调用之前。

---

## 17.1 旧规则：super() 必须放在最前面

Java 一直要求 `super()` 或 `this()` 必须是构造函数中的第一条语句。这条规则的设计初衷是确保在部分构造的对象上运行任何代码之前，实例字段（instance fields）已被正确初始化。但它造成了一个长期存在的痛点：

```java
// Java 25 之前：被迫使用丑陋的静态辅助方法模式
public class ValidatedList<E> extends ArrayList<E> {
    private final int maxSize;

    public ValidatedList(List<E> source, int maxSize) {
        // 我们想在 super() 之前验证，但做不到
        // 所以只能用静态辅助方法来转换参数
        super(ValidatedList.validate(source, maxSize));  // 权宜之计
        this.maxSize = maxSize;
    }

    private static <E> List<E> validate(List<E> source, int maxSize) {
        if (source == null) throw new NullPointerException("source is null");
        if (source.size() > maxSize)
            throw new IllegalArgumentException("source exceeds maxSize " + maxSize);
        return source;
    }
}
```

静态辅助方法模式是一种变通方案，而非设计选择。它用仅为绕过构造函数限制而存在的方法污染了类的代码。

---

## 17.2 现在允许的写法：super() 之前的语句

Java 25 允许在 `super()` 或 `this()` 之前编写语句，**前提是这些语句不访问 `this`**（既不能直接访问，也不能通过调用实例方法间接访问）：

```java
// Java 25 之后：在 super() 之前进行干净的验证
public class ValidatedList<E> extends ArrayList<E> {
    private final int maxSize;

    public ValidatedList(List<E> source, int maxSize) {
        // 这些语句现在可以出现在 super() 之前
        if (source == null) throw new NullPointerException("source is null");
        if (source.size() > maxSize)
            throw new IllegalArgumentException("source exceeds maxSize " + maxSize);

        super(source);  // 验证之后再调用 super()——不需要静态辅助方法
        this.maxSize = maxSize;
    }
}
```

---

## 17.3 主要用例：委托前的验证

最典型的用例是在将参数传递给超类构造函数之前进行验证或转换：

```java
public class BoundedChannel<T> extends ArrayBlockingQueue<T> {

    public BoundedChannel(int capacity, boolean fair, Collection<? extends T> initial) {
        // 在 super() 之前验证
        Objects.requireNonNull(initial, "initial collection must not be null");
        if (initial.size() > capacity) {
            throw new IllegalArgumentException(
                "Initial collection size (%d) exceeds capacity (%d)"
                    .formatted(initial.size(), capacity));
        }
        // 不允许元素为 null
        for (T item : initial) {
            if (item == null) throw new NullPointerException("null elements not allowed");
        }

        super(capacity, fair, initial);
    }
}
```

---

## 17.4 为 super() 准备需要复杂逻辑的参数

有时传递给 `super()` 的参数需要非平凡的计算：

```java
public class ConfigurableThreadPool extends ThreadPoolExecutor {

    public ConfigurableThreadPool(PoolConfig config) {
        // 在调用 super() 之前从 config 中计算各项值
        int coreSize = Math.max(1, config.minThreads());
        int maxSize  = Math.max(coreSize, config.maxThreads());
        long keepAlive = config.keepAliveSeconds();

        // 根据配置选择队列实现
        BlockingQueue<Runnable> workQueue = config.unbounded()
            ? new LinkedBlockingQueue<>()
            : new ArrayBlockingQueue<>(config.queueCapacity());

        ThreadFactory factory = Thread.ofVirtual()
            .name(config.threadNamePrefix() + "-", 0)
            .factory();

        super(coreSize, maxSize, keepAlive, TimeUnit.SECONDS, workQueue, factory);
    }
}
```

在 Java 25 之前，这需要将逻辑提取到多个静态辅助方法中，或者使用构建器（Builder）/工厂（Factory）模式来代替构造函数。

---

## 17.5 使用 this() 链式调用的构造函数

该特性同样适用于 `this()` 委托：

```java
public class Connection {
    private final String host;
    private final int port;
    private final int timeout;

    public Connection(String host, int port, int timeout) {
        if (host == null || host.isBlank())
            throw new IllegalArgumentException("host must not be blank");
        if (port < 1 || port > 65535)
            throw new IllegalArgumentException("port must be in range [1, 65535]: " + port);
        if (timeout < 0)
            throw new IllegalArgumentException("timeout must be non-negative");

        this.host    = host;
        this.port    = port;
        this.timeout = timeout;
    }

    // 便捷构造函数委托给经过验证的规范构造函数
    public Connection(String host, int port) {
        // 可以在 this() 之前进行验证
        if (host == null) throw new NullPointerException("host");
        this(host, port, 30_000);  // 默认超时时间
    }

    public Connection(String hostAndPort) {
        // 在 this() 之前进行复杂的解析
        String[] parts = hostAndPort.split(":", 2);
        if (parts.length != 2) {
            throw new IllegalArgumentException("Expected host:port, got: " + hostAndPort);
        }
        int parsedPort;
        try {
            parsedPort = Integer.parseInt(parts[1]);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid port: " + parts[1], e);
        }
        this(parts[0], parsedPort);
    }
}
```

---

## 17.6 在 super() 之前仍然不能做的事

对 `this` 的任何访问仍然受到限制：

```java
public class Restricted extends Base {

    private int value;

    public Restricted(int v) {
        // 在 super() 之前仍然是非法的：
        // this.value = v;              // 访问实例字段
        // this.validate(v);            // 调用实例方法
        // int x = this.value;         // 读取实例字段
        // super.someMethod();          // 调用 super 方法（会访问 this）
        // Objects.requireNonNull(this); // 传递 this 引用

        // 以下操作是合法的（不访问 this）：
        int processed = Math.abs(v);    // 局部计算
        String msg = "Value: " + v;     // 字符串操作
        if (v < 0) throw new IllegalArgumentException(msg);
        var helper = new Helper(v);     // 创建其他对象（不是 this）

        super(processed);
        this.value = processed;         // 合法：在 super() 之后
    }
}
```

编译器（Compiler）会强制执行此规则。任何在 `super()` 之前访问 `this`（直接或间接）的语句都会导致编译错误（compile error）。

---

## 17.7 实际重构案例：清理静态辅助方法

```java
// 重构前：静态辅助方法使 API 变得杂乱
public class SecureEndpoint extends HttpEndpoint {
    private final SecretKey signingKey;

    public SecureEndpoint(String url, byte[] rawKey) {
        super(url, SecureEndpoint.buildOptions(rawKey));
        this.signingKey = SecureEndpoint.deriveKey(rawKey);
    }

    private static EndpointOptions buildOptions(byte[] rawKey) {
        if (rawKey == null || rawKey.length < 32)
            throw new IllegalArgumentException("Key too short");
        return EndpointOptions.defaults().withTLS(true);
    }

    private static SecretKey deriveKey(byte[] rawKey) {
        return new SecretKeySpec(rawKey, 0, 32, "HmacSHA256");
    }
}

// 重构后：干净的构造函数，无需静态辅助方法
public class SecureEndpoint extends HttpEndpoint {
    private final SecretKey signingKey;

    public SecureEndpoint(String url, byte[] rawKey) {
        if (rawKey == null || rawKey.length < 32)
            throw new IllegalArgumentException("Key must be at least 32 bytes");

        var options = EndpointOptions.defaults().withTLS(true);
        super(url, options);

        this.signingKey = new SecretKeySpec(rawKey, 0, 32, "HmacSHA256");
    }
}
```

---

## 17.8 总结

灵活的构造函数体（JEP 492，Java 25 正式版）解决了一个真实且反复出现的痛点：

- **在委托前验证参数** —— 委托给 `super()` 或 `this()` 之前进行验证，这是最主要的用例
- **为 `super()` 计算复杂参数** —— 无需静态辅助方法
- **仍然防止不安全的访问** —— 在 `super()` 之前引用 `this` 会导致编译错误
- **同时适用于 `super()` 和 `this()`** 委托
- **无语法变更** —— 这只是对现有构造函数语法的放宽

该特性默默地提升了 Java 代码库中构造函数代码的质量。请关注它在框架代码、集合子类以及领域层构建器中的应用。


---

# 第18章：紧凑源文件与实例 Main 方法（JEP 512，Java 25 正式发布）

紧凑源文件（Compact Source Files）与实例 Main 方法（Instance Main Methods）（JEP 512）在经历四轮预览（Java 21-24）后，于 Java 25 正式发布。该特性允许 Java 程序无需传统的 `public class`、`public static void main(String[] args)` 以及 import 语句即可运行——使 Java 适用于脚本编写、快速原型开发和初学者教学，同时不会对生产代码造成任何影响。

---

## 18.1 目标：平滑的入门路径，无需妥协

Java 团队明确提出的目标是：*学生可以编写他们的第一个程序，而无需理解那些为大型程序设计的语言特性*。但对于有经验的工程师而言，这意味着：**以最少的样板代码（boilerplate）编写 Java 脚本和工具程序**。

---

## 18.2 实例 Main 方法

传统的 `main` 方法需要三个修饰符（modifier）：`public`、`static` 和 `String[] args`。在 Java 25 中，这些都是可选的：

```java
// 传统方式（仍然有效，且将一直有效）：
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Java 25：所有修饰符均为可选
class Hello {
    void main() {
        System.out.println("Hello, World!");
    }
}
```

启动器（launcher）按以下顺序尝试这些变体，使用找到的第一个匹配项：

| 优先级 | 方法签名 |
|----------|-----------|
| 1 | `public static void main(String[])` |
| 2 | `static void main(String[])` |
| 3 | `public static void main()` |
| 4 | `static void main()` |
| 5 | `public void main(String[])` |
| 6 | `public void main()` |
| 7 | `void main(String[])` |
| 8 | `void main()` |

---

## 18.3 未命名类：无需 class 声明的文件

**未命名类（unnamed class）** 是一种没有显式类声明的源文件。编译器会将其内容包装在一个合成的（synthetic）未命名类中：

```java
// 文件：Hello.java —— 没有类声明
void main() {
    System.out.println("Hello, World!");
}
```

```bash
java Hello.java   # 直接源文件启动（Java 11+）
javac Hello.java  # 编译为 Hello.class
java Hello        # 运行编译后的版本
```

未命名类可以包含：
- 方法声明（method declarations）
- 字段声明（field declarations）
- 静态初始化块（static initializers）

未命名类**不能**包含：
- 包声明（package declarations）
- 显式类/接口声明
- 模块声明（module declarations）
- 构造函数（没有类名可供构造）

---

## 18.4 隐式导入的类

未命名类会隐式导入以下内容：

```java
// 在未命名类中自动可用（Java 25）：
import java.lang.*;   // String, System, Math 等
import java.io.*;     // println() 和 java.io.IO 类
import java.util.*;   // List, Map, ArrayList 等
```

`java.io.IO` 类提供了 `println()`、`print()` 和 `readln()` 作为静态方法，用于简化 I/O 操作：

```java
// 文件：Calculator.java
void main() {
    println("Enter a number:");         // java.io.IO.println()
    String input = readln(">> ");       // java.io.IO.readln()
    double number = Double.parseDouble(input);
    println("Square root: " + Math.sqrt(number));
}
```

---

## 18.5 高级用法：脚本与工具程序

对于有经验的工程师而言，未命名类在脚本任务中非常强大：

```java
// 文件：ProcessLog.java —— 日志分析脚本
import java.nio.file.*;
import java.util.regex.*;

void main(String[] args) throws Exception {
    if (args.length == 0) {
        println("Usage: java ProcessLog.java <logfile>");
        return;
    }

    var logFile = Path.of(args[0]);
    var errorPattern = Pattern.compile("ERROR.*OutOfMemory", Pattern.CASE_INSENSITIVE);

    var errors = Files.lines(logFile)
        .filter(line -> errorPattern.matcher(line).find())
        .toList();

    println("Found " + errors.size() + " OOM errors:");
    errors.forEach(this::println);
}

void println(String s) {
    System.out.println(s);
}
```

运行方式：
```bash
java ProcessLog.java application.log
```

---

## 18.6 数据处理脚本

```java
// 文件：CsvSummary.java
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

record Sale(String region, String product, double amount) {}

void main(String[] args) throws Exception {
    var csvFile = Path.of(args.length > 0 ? args[0] : "sales.csv");

    var sales = Files.lines(csvFile)
        .skip(1)  // 跳过表头
        .map(line -> {
            var cols = line.split(",");
            return new Sale(cols[0].trim(), cols[1].trim(), Double.parseDouble(cols[2].trim()));
        })
        .toList();

    println("=== Sales Summary ===");
    sales.stream()
        .collect(Collectors.groupingBy(Sale::region,
                 Collectors.summingDouble(Sale::amount)))
        .entrySet().stream()
        .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
        .forEach(e -> println("%-15s $%,.2f".formatted(e.getKey(), e.getValue())));

    double total = sales.stream().mapToDouble(Sale::amount).sum();
    println("\nTotal: $" + "%,.2f".formatted(total));
}

void println(String s) { System.out.println(s); }
```

---

## 18.7 编译原理：底层机制

编译器将未命名类文件包装在一个合成类中：

```java
// 源文件：Hello.java
void main() {
    println("Hello!");
}

// 大致编译为：
final class Hello {
    void main() {
        System.out.println("Hello!");
    }
    // 合成的无参构造函数
    Hello() {}
}
```

类名从文件名派生。`main()` 方法是基于实例的——启动器通过无参构造函数创建实例，然后调用 `main()`。

---

## 18.8 未命名类中的模块导入声明

Java 25 的模块导入声明（Module Import Declarations）（第19章）与未命名类天然配合：

```java
// 导入 java.base 和 java.net.http 的所有导出包
import module java.base;
import module java.net.http;

void main() throws Exception {
    var client = HttpClient.newHttpClient();
    var request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.example.com/data"))
        .build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    println(response.body());
}

void println(String s) { System.out.println(s); }
```

---

## 18.9 局限性

- **无法使用包声明**：未命名类属于未命名包（unnamed package）
- **无法通过名称引用**：你无法从其他类中导入未命名类
- **不能包含嵌套类声明**（但允许使用记录类声明（record declarations））
- **IDE 支持程度不一**：IntelliJ 和 VS Code Java 扩展在 Java 25 中支持未命名类

---

## 18.10 总结

紧凑源文件与实例 Main 方法在 Java 25 中正式发布：

- **实例 `main()` 方法**：可省略 `public`、`static`、`String[] args`——全部可选
- **未命名类**：编写 Java 代码无需类声明——文件名即为类名
- **隐式导入**：`java.lang`、`java.io`、`java.util` 自动导入
- **对专业人员的价值**：无需构建系统即可编写 Java 脚本——直接运行 `.java` 文件
- **生产代码不受影响**：传统类结构仍然正确，且在生产环境中更为推荐

该特性并未改变生产环境中的 Java——它降低了脚本、教程和快速实验的入门成本，在这些场景中传统的类结构纯粹是多余的形式。


---

# 第19章：模块导入声明（Module Import Declarations）（JEP 511，Java 25 正式发布）

模块导入声明（Module Import Declarations，JEP 511）在 Java 25 中正式发布，此前在 Java 24（JEP 476）中经历了一轮预览。该特性允许通过单个 `import module` 声明导入一个模块的所有导出包——大幅减少了使用大量模块类时的导入样板代码。

---

## 19.1 问题所在：跨模块边界的冗长通配符导入

通配符导入（Wildcard Import，`import java.util.*`）可以导入单个包中的所有类型。但模块包含多个包。如果你使用了 `java.net.http` 中的许多类，就需要多条导入语句：

```java
// 传统方式：需要分别导入每个包
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpHeaders;
import java.net.http.WebSocket;
// ... 以及该模块中其他包的更多导入
```

使用模块导入后：

```java
// Java 25：一条导入语句覆盖 java.net.http 的所有导出包
import module java.net.http;
// 现在 java.net.http 中所有导出的类型均可使用
```

---

## 19.2 语法：`import module <模块名>;`

```java
import module java.base;          // 导入 java.base 的所有导出包
import module java.net.http;      // 导入 java.net.http 的所有导出包
import module java.sql;           // 导入 java.sql 的所有导出包
import module java.desktop;       // 导入 java.desktop 的所有导出包
```

模块导入（Module Import）与普通导入出现在同一位置，即包声明之后：

```java
package com.example.demo;

import module java.base;       // String、List、Map 等——实际上 java.base 已经是隐式导入的
import module java.net.http;   // HttpClient、HttpRequest、HttpResponse 等

public class ApiClient {
    public String fetch(String url) throws Exception {
        var client  = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString()).body();
    }
}
```

---

## 19.3 导入的内容

只有**已导出的**包会被导入——即从模块外部通过模块图（Module Graph）可见的那些包。未导出的包（内部实现）永远无法访问：

```java
// java.base 导出的包（部分列举）：
// java.lang、java.util、java.io、java.math、java.nio、java.net 等

import module java.base;
// 现在可用：String、List、Map、Path、Files、Optional、BigDecimal、
//           ByteBuffer、Duration、Instant 等
// 不可用：sun.misc.*、jdk.internal.* 等（未导出）
```

---

## 19.4 冲突解决

如果两个模块导入导出了相同的简单类型名（Simple Type Name），在使用时会产生编译错误（歧义）。可以通过具体的单类型导入（Single-Type Import）来解决：

```java
import module java.sql;       // 导出 java.sql.Date
import module java.util;      // ... 等等，java.util 属于 java.base，不是独立模块
                              // 让我们用一个更贴切的例子：

import module java.sql;       // 导出 java.sql.Date、java.sql.Time 等
// java.util.Date 可通过 java.base 的隐式导入获得

// 使用 'Date' 会产生歧义——可能是 java.sql.Date 或 java.util.Date
// 解决方案：具体的单类型导入优先
import java.util.Date;        // 该单类型导入优先于模块导入

Date d = new Date();          // java.util.Date——具体导入优先
```

规则是：**单类型导入始终优先于模块导入**，模块导入在解析顺序中最后被尝试。

---

## 19.5 在未命名模块（类路径代码）中使用模块导入

一个关键的设计决策：**你不需要处于命名模块（Named Module）中**就能使用 `import module`。从类路径（Classpath）运行的代码（即未命名模块，Unnamed Module）可以自由使用模块导入：

```java
// 传统类路径应用程序（不需要 module-info.java）
// 文件：OrderProcessor.java，使用类路径编译

import module java.base;       // String、List、Map、Optional 等
import module java.net.http;   // HttpClient 等
import module java.sql;        // Connection、PreparedStatement 等

public class OrderProcessor {
    public void processOrders(Connection db) throws Exception {
        var stmt = db.prepareStatement(
            "SELECT * FROM orders WHERE status = ?");
        stmt.setString(1, "PENDING");
        var rs = stmt.executeQuery();
        // ... 处理结果
    }
}
```

---

## 19.6 在命名模块中使用模块导入

在模块化应用程序中，源文件中的 `import module` 与 `module-info.java` 中的 `requires` 是**相互独立的**：

```java
// module-info.java：在模块级别声明模块依赖
module com.example.orders {
    requires java.sql;           // 仍然必须在此声明依赖
    requires java.net.http;
    exports com.example.orders;
}

// OrderService.java：import module 是源文件级别的便捷写法
import module java.sql;          // 在命名模块中同样有用
import module java.net.http;

public class OrderService {
    // 无需逐个输入每个包的导入语句
}
```

**关键区别**：`module-info.java` 中的 `requires java.sql` 是一个**模块依赖声明**——它影响模块解析、封装和类路径。源文件中的 `import module java.sql` 纯粹是一种**源码便捷写法**——它只影响该文件中哪些简单名称可以被解析。两者服务于不同的目的，在编写模块化代码时都是必需的。

---

## 19.7 实际使用：常见模块导入

```java
// java.base——隐式可用，但显式模块导入有助于表明意图
import module java.base;

// java.net.http——HTTP 客户端 API
import module java.net.http;

// java.sql——JDBC API
import module java.sql;

// java.xml——XML 处理
import module java.xml;

// java.logging——java.util.logging
import module java.logging;

// java.management——JMX
import module java.management;

// 第三方模块（使用模块系统时）
import module com.fasterxml.jackson.databind;
import module io.micrometer.core;
```

---

## 19.8 在未命名类中使用模块导入

模块导入与未命名类（Unnamed Class，见第18章）的搭配尤为出色，在这种场景下你希望使用多个 API 而不需要显式的 `module-info.java`：

```java
// 文件：HttpDemo.java——带有模块导入的未命名类
import module java.net.http;

void main() throws Exception {
    var client = HttpClient.newHttpClient();
    var request = HttpRequest.newBuilder()
        .uri(URI.create("https://httpbin.org/get"))
        .GET()
        .build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    println(response.statusCode() + ": " + response.body().substring(0, 100) + "...");
}

void println(Object o) { System.out.println(o); }
```

直接运行：
```bash
java HttpDemo.java
```

---

## 19.9 总结

模块导入声明（Module Import Declarations，JEP 511，Java 25 正式发布）：

- **`import module <名称>`** 通过一条声明导入模块的所有导出包
- **适用于所有场景**：未命名模块（类路径）、命名模块、未命名类
- **冲突解决**：单类型导入始终优先于模块导入
- **不是模块依赖**：源文件中的 `import module` 不等于 `module-info.java` 中的 `requires`
- **与未命名类完美搭配**，可编写简洁、低仪式感的 Java 脚本

在大量使用同一模块中类型的代码中，请积极采用模块导入。导入样板代码的减少在未命名类和探索性代码中尤为受欢迎。


---

# 第20章：安全增强 — 密钥派生函数 API 与 PEM 编码

Java 25 带来了两项重要的安全新特性：密钥派生函数（Key Derivation Function）API（JEP 510，正式版）和加密对象的 PEM 编码（PEM Encodings）（JEP 470，预览版）。它们共同填补了 Java 密码学体系中的重要空白 — 标准化的密钥派生和原生 PEM 格式支持。

---

## 20.1 什么是密钥派生及其重要性

密钥派生函数（Key Derivation Function, KDF）从主密钥中派生出加密密钥材料。这在以下场景中至关重要：

- **TLS 握手**：从共享密钥派生会话密钥
- **基于密码的加密**：从用户密码派生 AES 密钥（PBKDF2）
- **应用层安全**：从主密钥派生多个特定用途的密钥
- **后量子密码学（Post-quantum cryptography）**：密钥派生是许多 PQC 方案的核心

在 Java 25 之前，Java 开发者必须使用特定提供者的 API 或第三方库（如 Bouncy Castle）来执行标准化的 KDF 操作。新的 `KDF` API 将这一功能纳入了标准 JDK。

---

## 20.2 KDF API 概览（JEP 510 — Java 25 正式版）

```java
import javax.crypto.KDF;
import javax.crypto.spec.HKDFParameterSpec;
import java.security.spec.AlgorithmParameterSpec;

// The core interface
KDF kdf = KDF.getInstance("HKDF-SHA256");

// derive a SecretKey
SecretKey derivedKey = kdf.deriveKey("AES", spec);

// derive raw bytes
byte[] keyMaterial = kdf.deriveData(spec);
```

该 API 遵循已有的 `getInstance()` 工厂模式（factory pattern），这与 `Cipher`、`MessageDigest` 和 `KeyPairGenerator` 的使用方式一致。

---

## 20.3 HKDF — 基于 HMAC 的密钥派生函数

HKDF（RFC 5869）是目前最广泛使用的现代 KDF。它包含两个步骤：
1. **提取（Extract）**：使用盐值（salt）从输入密钥材料（IKM）中提炼熵
2. **扩展（Expand）**：生成任意所需长度的输出密钥材料（OKM）

```java
import javax.crypto.KDF;
import javax.crypto.SecretKey;
import javax.crypto.spec.HKDFParameterSpec;
import java.security.SecureRandom;

public class HkdfExample {

    private static final int AES_256_KEY_SIZE = 32; // 256 bits = 32 bytes

    // Extract-then-expand: the full HKDF operation
    public static SecretKey deriveAesKey(byte[] inputKeyMaterial, byte[] salt, byte[] info)
            throws Exception {
        KDF hkdf = KDF.getInstance("HKDF-SHA256");

        HKDFParameterSpec spec = HKDFParameterSpec.expandOnly(
            // First run extract to get a pseudorandom key (PRK)
            HKDFParameterSpec.ofExtract()
                .addIKM(inputKeyMaterial)
                .addSalt(salt)
                .extractExpand(info, AES_256_KEY_SIZE)
        );

        return hkdf.deriveKey("AES", spec);
    }

    // Just the Expand step (when you already have a PRK)
    public static byte[] expand(byte[] prk, byte[] info, int length) throws Exception {
        KDF hkdf = KDF.getInstance("HKDF-SHA256");

        HKDFParameterSpec spec = HKDFParameterSpec.expandOnly(prk, info, length);

        return hkdf.deriveData(spec);
    }

    // Practical example: derive AES and HMAC keys from a shared Diffie-Hellman secret
    public static void main(String[] args) throws Exception {
        // Simulated shared secret from ECDH key exchange
        byte[] sharedSecret = new byte[32];
        new SecureRandom().nextBytes(sharedSecret);

        byte[] salt = new byte[32];
        new SecureRandom().nextBytes(salt);

        // Derive AES key for encryption
        byte[] aesInfo = "encryption-key-v1".getBytes();
        SecretKey aesKey = deriveAesKey(sharedSecret, salt, aesInfo);
        System.out.println("AES key algorithm: " + aesKey.getAlgorithm());
        System.out.println("AES key length: " + aesKey.getEncoded().length + " bytes");

        // Derive HMAC key for authentication
        byte[] hmacInfo = "authentication-key-v1".getBytes();
        KDF hkdf = KDF.getInstance("HKDF-SHA256");
        HKDFParameterSpec hmacSpec = HKDFParameterSpec.expandOnly(
            HKDFParameterSpec.ofExtract().addIKM(sharedSecret).addSalt(salt)
                .extractExpand(hmacInfo, 32)
        );
        SecretKey hmacKey = hkdf.deriveKey("HmacSHA256", hmacSpec);
        System.out.println("HMAC key: " + hmacKey.getAlgorithm());
    }
}
```

---

## 20.4 PBKDF2 — 基于密码的密钥派生

PBKDF2（Password-Based Key Derivation Function 2）是从用户密码派生密钥的标准方法。新 API 比旧的 `SecretKeyFactory` 方式更加简洁：

```java
import javax.crypto.KDF;
import javax.crypto.SecretKey;
import javax.crypto.spec.PBEKeySpec;
import java.security.spec.AlgorithmParameterSpec;

public class PasswordDerivedKey {

    private static final int ITERATIONS = 600_000;  // NIST recommendation 2023
    private static final int KEY_LENGTH_BITS = 256;
    private static final int SALT_BYTES = 32;

    public static SecretKey deriveFromPassword(char[] password, byte[] salt)
            throws Exception {
        KDF pbkdf2 = KDF.getInstance("PBKDF2WithHmacSHA256");

        // New API: cleaner than the old SecretKeyFactory path
        AlgorithmParameterSpec spec = new PBEKeySpec(
            password,
            salt,
            ITERATIONS,
            KEY_LENGTH_BITS
        );

        return pbkdf2.deriveKey("AES", spec);
    }

    // Generate a cryptographically random salt
    public static byte[] generateSalt() {
        byte[] salt = new byte[SALT_BYTES];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    // Usage example: storing a user password securely
    record StoredPassword(byte[] salt, byte[] hash) {}

    public static StoredPassword hashPassword(char[] password) throws Exception {
        byte[] salt = generateSalt();
        SecretKey key = deriveFromPassword(password, salt);
        return new StoredPassword(salt, key.getEncoded());
    }

    public static boolean verifyPassword(char[] password, StoredPassword stored)
            throws Exception {
        SecretKey key = deriveFromPassword(password, stored.salt());
        return MessageDigest.isEqual(key.getEncoded(), stored.hash());
    }
}
```

---

## 20.5 PEM 编码 API（JEP 470 — Java 25 预览版）

PEM（Privacy-Enhanced Mail）格式是存储和交换加密对象的通用格式 — 包括公钥、私钥、证书和证书签名请求（CSR）。每一个 `openssl` 的输出、每一张 TLS 证书、每一个 SSH 密钥都使用 PEM 格式。

在 Java 25 之前，JDK 中没有标准的 PEM 编码/解码功能。开发者不得不使用 Bouncy Castle 或手动编写 Base64 解析代码。

### 将密钥编码为 PEM 格式

```java
import java.security.*;
import java.security.pem.PEMEncoder;
import java.security.pem.PEMDecoder;

public class PemExample {

    // Encode a key pair to PEM format
    public static void encodePem() throws Exception {
        KeyPairGenerator gen = KeyPairGenerator.getInstance("EC");
        gen.initialize(256);
        KeyPair keyPair = gen.generateKeyPair();

        PEMEncoder encoder = PEMEncoder.of();

        // Encode private key
        String privateKeyPem = encoder.encodeToString(keyPair.getPrivate());
        System.out.println(privateKeyPem);
        // -----BEGIN PRIVATE KEY-----
        // MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg...
        // -----END PRIVATE KEY-----

        // Encode public key
        String publicKeyPem = encoder.encodeToString(keyPair.getPublic());
        System.out.println(publicKeyPem);
        // -----BEGIN PUBLIC KEY-----
        // MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...
        // -----END PUBLIC KEY-----
    }

    // Encode a certificate to PEM
    public static String encodeCertificate(X509Certificate cert) throws Exception {
        PEMEncoder encoder = PEMEncoder.of();
        return encoder.encodeToString(cert);
    }

    // Decode a PEM-encoded private key
    public static PrivateKey decodePemPrivateKey(String pemString) throws Exception {
        PEMDecoder decoder = PEMDecoder.of();
        return (PrivateKey) decoder.decode(pemString).get(0);
    }

    // Decode from file
    public static PrivateKey loadPrivateKeyFromFile(Path pemFile) throws Exception {
        String pemContent = Files.readString(pemFile);
        PEMDecoder decoder = PEMDecoder.of();
        var decodedObjects = decoder.decode(pemContent);
        return decodedObjects.stream()
            .filter(o -> o instanceof PrivateKey)
            .map(o -> (PrivateKey) o)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("No private key found in PEM"));
    }
}
```

### 从 PEM 文件加载 TLS 证书

一个常见的实际使用场景：

```java
public class TlsContextBuilder {

    public static SSLContext buildFromPem(Path certPem, Path keyPem) throws Exception {
        PEMDecoder decoder = PEMDecoder.of();

        // Load certificate
        String certContent = Files.readString(certPem);
        X509Certificate cert = (X509Certificate) decoder.decode(certContent).get(0);

        // Load private key
        String keyContent = Files.readString(keyPem);
        PrivateKey privateKey = (PrivateKey) decoder.decode(keyContent).get(0);

        // Build KeyStore
        KeyStore ks = KeyStore.getInstance("PKCS12");
        ks.load(null, null);
        ks.setKeyEntry("server", privateKey, new char[0],
            new Certificate[]{cert});

        // Build SSLContext
        KeyManagerFactory kmf = KeyManagerFactory.getInstance(
            KeyManagerFactory.getDefaultAlgorithm());
        kmf.init(ks, new char[0]);

        SSLContext ctx = SSLContext.getInstance("TLS");
        ctx.init(kmf.getKeyManagers(), null, null);
        return ctx;
    }
}
```

---

## 20.6 安全最佳实践

```java
// 1. Always use appropriate iteration counts for PBKDF2
//    NIST SP 800-63B (2023) recommends >= 600,000 for SHA-256
private static final int MIN_PBKDF2_ITERATIONS = 600_000;

// 2. Always use a random, unique salt per password/key derivation
byte[] salt = new byte[32];
new SecureRandom().nextBytes(salt);

// 3. Clear sensitive data from memory after use
char[] password = getPassword();
try {
    // use password
} finally {
    Arrays.fill(password, '\0');  // clear from memory
}

// 4. Don't use HKDF Extract-only — always include Expand
// The PRK from Extract alone should not be used as a key directly

// 5. Use algorithm-specific info strings to domain-separate derived keys
byte[] aesInfo  = "v1:com.example:aes-encryption".getBytes(StandardCharsets.UTF_8);
byte[] hmacInfo = "v1:com.example:hmac-auth".getBytes(StandardCharsets.UTF_8);
```

---

## 20.7 总结

Java 25 的安全增强：

- **KDF API（JEP 510，正式版）**：标准的 `KDF.getInstance()` 工厂方法，支持 HKDF 和 PBKDF2
  - `HKDF-SHA256`：用于会话密钥和派生子密钥的现代密钥派生
  - `PBKDF2WithHmacSHA256`：支持可配置迭代次数的基于密码的密钥派生
- **PEM 编码（JEP 470，预览版）**：`PEMEncoder` 和 `PEMDecoder` 用于将加密对象编码为 PEM 格式或从 PEM 格式解码
  - 原生支持从 `.pem` 文件加载私钥、公钥和证书
  - 将密钥和证书编码用于导出/存储

这些 API 在许多常见的密码学工作流程中消除了对 Bouncy Castle 的依赖，在降低依赖复杂度的同时，通过经过充分验证的标准实现提升了安全性。


---

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


---

# 附录 A：Java 版本兼容性与迁移指南

---

## A.1 了解 Java 发布节奏

自 Java 9 起，Oracle 和 OpenJDK 社区遵循严格的 6 个月发布节奏（release cadence）：
- 每 6 个月发布新功能（3 月和 9 月）
- LTS（长期支持，Long-Term Support）版本每 3 年发布一次（Java 11、17、21、25）
- LTS 版本可获得 8 年以上（Oracle）或 5 年以上（Adoptium/Temurin）的支持

| 版本 | 发布时间 | LTS | Oracle 支持期限 |
|---------|---------|-----|----------------|
| Java 11 | 2018 年 9 月 | ✅ LTS | 至 2026 年 9 月 |
| Java 17 | 2021 年 9 月 | ✅ LTS | 至 2029 年 9 月 |
| Java 21 | 2023 年 9 月 | ✅ LTS | 至 2031 年 9 月 |
| **Java 25** | **2025 年 9 月** | **✅ LTS** | **至 2033 年 9 月** |

**企业升级建议**：从 Java 11 → Java 17 → Java 21 → Java 25 逐步升级（如果目前使用的是 Java 11，也可以直接跳到 25）。

---

## A.2 从 Java 11 迁移到 Java 17

### 破坏性变更

**强封装（Strong Encapsulation，JEP 403）**：
```bash
# Java 11: --illegal-access=permit was the default (and worked)
# Java 17: --illegal-access is REMOVED. Reflective access to JDK internals throws.

# Error you'll see:
# java.lang.reflect.InaccessibleObjectException: Unable to make ... accessible

# Short-term fix: add --add-opens
java --add-opens java.base/java.lang=ALL-UNNAMED \
     --add-opens java.base/java.util=ALL-UNNAMED \
     -jar myapp.jar
```

**需要为 Java 17 更新的常用库**：

| 库 | Java 17 最低版本要求 |
|---------|------------------------|
| Spring Boot | 2.7.x（3.0+ 完全支持） |
| Hibernate | 5.6+（6.0+ 完全支持） |
| Mockito | 4.0+ |
| ByteBuddy | 1.12+ |
| Jackson | 2.13+ |
| Lombok | 1.18.20+ |
| CGLIB | 3.3.0+（或切换到 ByteBuddy） |

### Java 17 的 Maven 配置

```xml
<project>
    <properties>
        <java.version>17</java.version>
        <maven.compiler.release>17</maven.compiler.release>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>17</release>
                    <!-- For preview features: -->
                    <!-- <compilerArgs>
                        <arg>--enable-preview</arg>
                    </compilerArgs> -->
                </configuration>
            </plugin>

            <!-- Enable preview in tests/runtime if needed -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
                <configuration>
                    <!-- Add if using preview features or need internal access -->
                    <argLine>
                        --add-opens java.base/java.lang=ALL-UNNAMED
                        --add-opens java.base/java.util=ALL-UNNAMED
                    </argLine>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Java 17 的 Gradle 配置

```kotlin
// build.gradle.kts
plugins {
    java
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

tasks.withType<JavaCompile>().configureEach {
    options.release = 17
    // For preview features:
    // options.compilerArgs.addAll(listOf("--enable-preview", "--release", "17"))
}

tasks.withType<Test>().configureEach {
    jvmArgs(
        "--add-opens", "java.base/java.lang=ALL-UNNAMED",
        "--add-opens", "java.base/java.util=ALL-UNNAMED"
    )
    // For preview at test runtime:
    // jvmArgs("--enable-preview")
}
```

---

## A.3 从 Java 17 迁移到 Java 21

对于规范的 Java 17 代码，Java 21 **没有重大破坏性变更**。迁移工作主要集中在更新框架和采用新特性上。

### Java 21 的框架版本要求

| 框架 | Java 21 最低版本要求 |
|-----------|------------------------|
| Spring Boot | 3.2+（支持虚拟线程） |
| Quarkus | 3.6+ |
| Micronaut | 4.2+ |
| Hibernate | 6.4+ |
| JUnit | 5.10+ |
| Mockito | 5.4+ |

### 启用虚拟线程（Virtual Threads）

```yaml
# Spring Boot 3.2+ — single property
spring:
  threads:
    virtual:
      enabled: true
```

```java
// Custom executor service — drop-in replacement
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
```

### Java 21 的 Maven 配置

```xml
<properties>
    <maven.compiler.release>21</maven.compiler.release>
</properties>

<!-- Spring Boot parent for Java 21 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.1</version>
</parent>
```

---

## A.4 从 Java 21 迁移到 Java 25

### 作用域值 API（Scoped Values API）（如果使用了 Java 21 的预览功能）

作用域值 API 从 Java 24 的预览版开始**最终定稿且未做更改**。如果您在 Java 21-24 中通过 `--enable-preview` 使用了 `ScopedValue`：

```bash
# Before Java 25: required --enable-preview
java --enable-preview -jar myapp.jar

# Java 25: ScopedValue is final, no flag needed
java -jar myapp.jar
```

无需修改代码。

### 结构化并发（Structured Concurrency）（如果使用了预览功能）

`StructuredTaskScope.ShutdownOnFailure` 和 `ShutdownOnSuccess` 子类在 Java 25 中被 `StructuredTaskScope.open(Joiner.*)` **所取代**。迁移方式：

```java
// Java 21 preview:
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var t1 = scope.fork(() -> serviceA.call());
    var t2 = scope.fork(() -> serviceB.call());
    scope.join().throwIfFailed();
    return new Result(t1.get(), t2.get());
}

// Java 25 preview (new API):
try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
    var t1 = scope.fork(() -> serviceA.call());
    var t2 = scope.fork(() -> serviceB.call());
    scope.join();
    return new Result(t1.get(), t2.get());
}
```

### 紧凑对象头（Compact Object Headers）

可选启用 -- 现有代码无需更改即可正常运行：
```bash
java -XX:+UseCompactObjectHeaders -jar myapp.jar
```

---

## A.5 Docker 配置

### 使用 Java 25 的多阶段构建（Multi-stage Builds）

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:25-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Extract layers for better Docker caching
FROM builder AS layers
WORKDIR /app
RUN java -Djarmode=layertools -jar target/*.jar extract

# Stage 3: Runtime image
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy layers in order of change frequency (least to most)
COPY --from=layers /app/dependencies/ ./
COPY --from=layers /app/spring-boot-loader/ ./
COPY --from=layers /app/snapshot-dependencies/ ./
COPY --from=layers /app/application/ ./

# Enable virtual threads (if not configured in application.yml)
ENV JAVA_OPTS="-XX:+UseZGC -XX:+ZGenerational -XX:+UseCompactObjectHeaders"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} org.springframework.boot.loader.launch.JarLauncher"]
```

### 生产容器的 JVM 参数

```bash
# Recommended JVM flags for Java 25 containers (adjust -Xmx to container memory)
java \
  -XX:+UseZGC -XX:+ZGenerational \
  -XX:+UseCompactObjectHeaders \
  -Xmx$(expr $CONTAINER_MEMORY_MB - 256)m \
  -XX:MaxDirectMemorySize=256m \
  -XX:+ExitOnOutOfMemoryError \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/tmp/heapdump.hprof \
  -jar myapp.jar
```

---

## A.6 常见迁移问题与解决方案

| 问题 | 根本原因 | 解决方案 |
|-------|-----------|----------|
| `InaccessibleObjectException` | 强封装（Strong Encapsulation，Java 17+） | 添加 `--add-opens` 或更新库版本 |
| `NoSuchMethodError: Thread.getId()` | `Thread.getId()` 在 Java 19 中废弃，Java 21 中移除 | 使用 `Thread.threadId()` |
| `ClassNotFoundException: sun.misc.BASE64Encoder` | 内部类，已移除 | 使用 `java.util.Base64` |
| `SecurityException: Security Manager` | 安全管理器（Security Manager）移除（Java 17 废弃，Java 24 移除） | 移除安全管理器相关代码 |
| 反射访问 JDK 内部 API 失败 | 强封装 | 更新库版本 |
| `synchronized` 代码块导致虚拟线程固定（pinning） | 虚拟线程固定（Virtual Thread Pinning） | 使用 `ReentrantLock` |
| 虚拟线程上使用 ThreadLocal 导致高内存消耗 | O(线程数) 的 ThreadLocal 副本 | 使用 `ScopedValue` |
| `--illegal-access` 参数报错 | 该参数在 Java 17 中已移除 | 移除该参数，如有需要改用 `--add-opens` |

---

## A.7 IDE 与工具支持矩阵

| 工具 | Java 17 | Java 21 | Java 25 |
|------|---------|---------|---------|
| IntelliJ IDEA | 2021.2+ | 2023.3+ | 2025.3+ |
| Eclipse | 4.21+ | 4.29+ | 4.34+ |
| VS Code (Java Ext) | 1.10+ | 1.24+ | Latest |
| Maven | 3.8+ | 3.9+ | 3.9+ |
| Gradle | 7.3+ | 8.4+ | 8.10+ |
| JUnit | 5.8+ | 5.10+ | 5.11+ |
| Checkstyle | 9.x | 10.x | 10.x |
| PMD | 6.41+ | 7.x | 7.x |
| SpotBugs | 4.4+ | 4.8+ | 4.9+ |


---

# 附录 B：完整 JEP 参考索引

---

## B.1 Java 17 JEP（全部 14 个 JEP）

| JEP | 特性 | 状态 | 章节 | 描述 |
|-----|------|------|------|------|
| 306 | 恢复始终严格的浮点语义（Restore Always-Strict Floating-Point Semantics） | ✅ 正式版 | 6 | 所有浮点运算现在遵循 IEEE 754 标准——`strictfp` 不再有效 |
| 356 | 增强的伪随机数生成器（Enhanced Pseudo-Random Number Generators） | ✅ 正式版 | 6 | 新的 `RandomGenerator` 接口层次结构；LXM、Xoshiro 生成器 |
| 382 | 新的 macOS 渲染管线（New macOS Rendering Pipeline） | ✅ 正式版 | 6 | 基于 Metal 的 macOS 渲染管线 |
| 391 | macOS/AArch64 移植（macOS/AArch64 Port） | ✅ 正式版 | 6 | 对 Apple M1/M2 芯片的原生支持 |
| 394 | instanceof 的模式匹配（Pattern Matching for instanceof） | ✅ 正式版 | 3 | 在 `instanceof` 表达式中绑定模式变量 |
| 395 | 记录类（Records） | ✅ 正式版 | 1 | 透明、不可变的数据载体类 |
| 398 | 弃用 Applet API 以便移除 | 已弃用 | 6 | `java.applet.Applet` 已弃用；在 Java 23 中移除 |
| 403 | 强封装 JDK 内部 API（Strongly Encapsulate JDK Internals） | ✅ 正式版 | 6 | `--illegal-access` 已移除；内部 API 不可访问 |
| 406 | switch 的模式匹配（Pattern Matching for switch） | 第 1 次预览 | 5 | switch 中的类型模式（在 Java 21 中正式发布） |
| 407 | 移除 RMI 激活机制（Remove RMI Activation） | 已移除 | 6 | `java.rmi.activation` 已移除 |
| 409 | 密封类（Sealed Classes） | ✅ 正式版 | 2 | 使用 `permits` 子句限制类/接口的继承 |
| 410 | 移除实验性 AOT 和 JIT 编译器 | 已移除 | 6 | `jaotc` 和 Graal JIT 已从 JDK 中移除 |
| 411 | 弃用安全管理器以便移除 | 已弃用 | 6 | 安全管理器（Security Manager）已弃用；在 Java 24 中移除 |
| 412 | 外部函数和内存 API（Foreign Function & Memory API） | 第 1 次孵化 | 13 | 访问本地代码和内存（在 Java 21 中正式发布） |
| 414 | 向量 API（Vector API） | 第 2 次孵化 | 21 | 来自 Java 的 SIMD 操作 |
| 415 | 上下文特定的反序列化过滤器（Context-Specific Deserialization Filters） | ✅ 正式版 | 6 | 用于 `ObjectInputStream` 的 JVM 级过滤器工厂 |

---

## B.2 Java 21 JEP（全部 15 个 JEP）

| JEP | 特性 | 状态 | 章节 | 描述 |
|-----|------|------|------|------|
| 430 | 字符串模板（String Templates） | 第 1 次预览 | 14 | 字符串字面量中的嵌入式表达式（在 Java 23 中撤回） |
| 431 | 有序集合（Sequenced Collections） | ✅ 正式版 | 10 | 为有序集合提供统一的首尾元素访问和 `reversed()` 方法 |
| 439 | 分代 ZGC（Generational ZGC） | ✅ 正式版 | 14 | ZGC 中的新生代/老年代支持 |
| 440 | 记录模式（Record Patterns） | ✅ 正式版 | 11 | 在模式中解构记录类的组件 |
| 441 | switch 的模式匹配（Pattern Matching for switch） | ✅ 正式版 | 12 | switch 中的类型模式、守卫模式、null 处理 |
| 442 | 外部函数和内存 API（Foreign Function & Memory API） | 第 3 次预览 → 正式版 | 13 | 访问本地函数和内存（在 Java 22 中正式发布） |
| 443 | 未命名模式和变量（Unnamed Patterns and Variables） | 第 1 次预览 | 14 | 模式和变量中的 `_` 通配符 |
| 444 | 虚拟线程（Virtual Threads） | ✅ 正式版 | 7 | JVM 管理的轻量级线程，用于 I/O 可伸缩性 |
| 445 | 未命名类和实例 main 方法（Unnamed Classes and Instance Main Methods） | 第 1 次预览 | 18 | 减少简单程序的样板代码 |
| 446 | 作用域值（Scoped Values） | 第 1 次预览 | 9 | 不可变的逐作用域线程上下文（在 Java 25 中正式发布） |
| 448 | 向量 API（Vector API） | 第 6 次孵化 | 21 | 来自 Java 的 SIMD 操作 |
| 449 | 弃用 Windows 32 位 x86 移植 | 已弃用 | — | Windows 32 位 JVM 已弃用 |
| 451 | 准备禁止动态加载代理（Prepare to Disallow the Dynamic Loading of Agents） | 警告 | — | 当代理加载到运行中的 JVM 时发出警告 |
| 452 | 密钥封装机制 API（Key Encapsulation Mechanism API） | ✅ 正式版 | 20 | 用于后量子密码学的 `javax.crypto.KEM` |
| 453 | 结构化并发（Structured Concurrency） | 第 1 次预览 | 8 | 结构化任务生命周期管理（朝 Java 27 方向演进） |
| 454 | 外部函数和内存 API（Foreign Function & Memory API） | ✅ 正式版 | 13 | 在 Java 21 中正式发布 |

---

## B.3 Java 25 JEP（全部 18 个 JEP）

| JEP | 特性 | 状态 | 章节 | 描述 |
|-----|------|------|------|------|
| 470 | 加密对象的 PEM 编码（PEM Encodings of Cryptographic Objects） | 第 1 次预览 | 20 | 用于密钥/证书 PEM 格式的 `PEMEncoder`/`PEMDecoder` |
| 492 | 灵活的构造函数体（Flexible Constructor Bodies） | ✅ 正式版 | 17 | 允许在 `super()`/`this()` 之前编写语句 |
| 502 | 稳定值（Stable Values） | 第 1 次预览 | 21 | 延迟初始化的、JVM 优化的有效 final 值 |
| 505 | 结构化并发（Structured Concurrency） | 第 5 次预览 | 16 | 新的 Joiner API；`open()` 工厂方法 |
| 506 | 作用域值（Scoped Values） | ✅ 正式版 | 15 | 经过 4 轮预览后正式发布 |
| 507 | 模式、instanceof、switch 中的原始类型（Primitive Types in Patterns, instanceof, switch） | 第 3 次预览 | — | 允许在所有模式上下文中使用原始类型 |
| 508 | 向量 API（Vector API） | 第 10 次孵化 | 21 | SIMD 操作；待 Valhalla 项目完成后接近正式发布 |
| 509 | JFR CPU 时间分析（JFR CPU-Time Profiling） | 实验性 | 21 | JFR 中的 CPU 时间与挂钟时间分析（Linux） |
| 510 | 密钥派生函数 API（Key Derivation Function API） | ✅ 正式版 | 20 | 用于 HKDF、PBKDF2 的 `KDF.getInstance()` |
| 511 | 模块导入声明（Module Import Declarations） | ✅ 正式版 | 19 | `import module java.base;` 导入所有导出的包 |
| 512 | 紧凑源文件和实例 main 方法（Compact Source Files and Instance Main Methods） | ✅ 正式版 | 18 | 无需类声明或 `public static main` |
| 519 | 紧凑对象头（Compact Object Headers） | ✅ 正式版 | 21 | 对象头从 96-128 位缩减至 64 位 |
| 520 | JFR 方法计时和跟踪（JFR Method Timing and Tracing） | ✅ 正式版 | 21 | 通过字节码插桩进行方法级跟踪 |
| 526 | 移除 32 位 x86 移植（Remove the 32-bit x86 Port） | 已移除 | 21 | 32 位 x86 JVM 代码已移除 |
| — | 分代 Shenandoah（Generational Shenandoah） | ✅ 正式版 | 21 | Shenandoah GC 的分代模式 |

---

## B.4 特性演进表

以下特性在多个版本中经历了预览，最终正式发布：

| 特性 | 预览开始 | 正式发布 | 章节 |
|------|----------|----------|------|
| 记录类（Records） | Java 14（第 1 次），Java 15（第 2 次） | **Java 16** | 1 |
| 密封类（Sealed Classes） | Java 15（第 1 次），Java 16（第 2 次） | **Java 17** | 2 |
| instanceof 的模式匹配（Pattern Matching for instanceof） | Java 14（第 1 次），Java 15（第 2 次） | **Java 16** | 3 |
| 文本块（Text Blocks） | Java 13（第 1 次），Java 14（第 2 次） | **Java 15** | 4 |
| switch 表达式（Switch Expressions） | Java 13（第 1 次），Java 14（第 2 次） | **Java 14** | 5 |
| switch 的模式匹配（Pattern Matching for switch） | Java 17（第 1 次）…Java 20（第 4 次） | **Java 21** | 12 |
| 记录模式（Record Patterns） | Java 19（第 1 次），Java 20（第 2 次） | **Java 21** | 11 |
| 外部函数和内存 API（Foreign Function & Memory API） | Java 14…Java 21（多轮） | **Java 21/22** | 13 |
| 虚拟线程（Virtual Threads） | 不适用（单次预览） | **Java 21** | 7 |
| 未命名模式和变量（Unnamed Patterns and Variables） | Java 21（第 1 次），Java 22（第 2 次） | **Java 22** | 14 |
| 作用域值（Scoped Values） | Java 20（孵化），Java 21–24（预览） | **Java 25** | 9, 15 |
| 灵活的构造函数体（Flexible Constructor Bodies） | Java 22（第 1 次），Java 23（第 2 次） | **Java 25** | 17 |
| 紧凑源文件（Compact Source Files） | Java 21–24（预览） | **Java 25** | 18 |
| 模块导入声明（Module Import Declarations） | Java 24（第 1 次预览） | **Java 25** | 19 |
| KDF API | Java 24（第 1 次预览） | **Java 25** | 20 |
| 紧凑对象头（Compact Object Headers） | Java 24（实验性） | **Java 25** | 21 |

---

## B.5 快速参考：各 Java 版本引入了哪些特性

### 语言特性

| 特性 | Java 版本 |
|------|-----------|
| 文本块（Text Blocks） | 15 |
| 记录类（Records） | 16 |
| 密封类（Sealed Classes） | 17 |
| instanceof 的模式匹配（Pattern Matching for instanceof） | 16 |
| switch 表达式（Switch Expressions） | 14 |
| switch 的模式匹配（Pattern Matching for switch） | 21 |
| 记录模式（Record Patterns） | 21 |
| 未命名模式（Unnamed Patterns）(`_`) | 22 |
| 灵活的构造函数体（Flexible Constructor Bodies） | 25 |
| 紧凑源文件 / 实例 `main()`（Compact Source Files / Instance main()） | 25 |
| 模块导入声明（Module Import Declarations） | 25 |

### 并发

| 特性 | Java 版本 |
|------|-----------|
| 虚拟线程（Virtual Threads） | 21 |
| 作用域值（Scoped Values） | 25（正式版） |
| 结构化并发（Structured Concurrency） | 预览中（Java 21–25） |

### 集合

| 特性 | Java 版本 |
|------|-----------|
| 有序集合（Sequenced Collections） | 21 |

### 安全

| 特性 | Java 版本 |
|------|-----------|
| 上下文特定的反序列化过滤器（Context-Specific Deserialization Filters） | 17 |
| 密钥封装机制（Key Encapsulation Mechanism，KEM） | 21 |
| 密钥派生函数（Key Derivation Function，KDF） | 25（正式版） |
| PEM 编码（PEM Encodings） | 25（预览） |

### JVM / GC / 性能

| 特性 | Java 版本 |
|------|-----------|
| ZGC | 11 |
| Shenandoah GC | 12 |
| 分代 ZGC（Generational ZGC） | 21 |
| 分代 Shenandoah（Generational Shenandoah） | 25 |
| 紧凑对象头（Compact Object Headers） | 25（可选启用） |
| 向量 API（Vector API） | 自 Java 16 起孵化中 |
| 外部函数和内存 API（Foreign Function & Memory API） | 21（正式版） |

### API

| 特性 | Java 版本 |
|------|-----------|
| 增强的伪随机数生成器（Enhanced PRNG）(`RandomGenerator`) | 17 |
| HTTP 客户端（HTTP Client）(`java.net.http`) | 11 |
| JFR CPU 时间分析（JFR CPU-Time Profiling） | 25（实验性） |
| JFR 方法计时/跟踪（JFR Method Timing/Tracing） | 25 |


---

# 索引

| 术语 | 英文 | 章节参考 |
|------|------|----------|
| 记录 | Records | 第1章 |
| 密封类 | Sealed Classes | 第2章 |
| 模式匹配 | Pattern Matching | 第3章, 第5章, 第11-12章 |
| 文本块 | Text Blocks | 第4章 |
| Switch 表达式 | Switch Expressions | 第5章, 第12章 |
| 虚拟线程 | Virtual Threads | 第7章 |
| 结构化并发 | Structured Concurrency | 第8章, 第16章 |
| 作用域值 | Scoped Values | 第9章, 第15章 |
| 有序集合 | Sequenced Collections | 第10章 |
| 记录模式 | Record Patterns | 第11章 |
| 外部函数与内存 API | Foreign Function & Memory API | 第13章 |
| 灵活的构造器主体 | Flexible Constructor Bodies | 第17章 |
| 精简源文件 | Compact Source Files | 第18章 |
| 模块导入声明 | Module Import Declarations | 第19章 |
| 密钥派生函数 | Key Derivation Function | 第20章 |
| ZGC | ZGC | 第14章, 第21章 |
| Shenandoah | Shenandoah | 第21章 |
| JEP | JEP | 附录B |
| LTS | LTS | 引言, 附录A |
| Project Loom | Project Loom | 第7-9章, 第15-16章 |
| Project Amber | Project Amber | 第1-5章, 第11-12章 |
| Project Panama | Project Panama | 第13章 |
