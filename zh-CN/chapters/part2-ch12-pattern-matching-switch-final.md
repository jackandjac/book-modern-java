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
