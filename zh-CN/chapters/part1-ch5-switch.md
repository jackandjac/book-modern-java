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
