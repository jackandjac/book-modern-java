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
