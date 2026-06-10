# Chapter 12: Pattern Matching for Switch — Finalized

Pattern matching for switch (JEP 441, finalized in Java 21) completes the pattern matching story that began with `instanceof` in Java 16. It allows switch expressions and statements to match against arbitrary patterns — type patterns, record patterns, guarded patterns — with full exhaustiveness checking. This is the feature that makes the combination of records + sealed classes + switch into a genuine algebraic data type system.

---

## 12.1 The Journey: From JEP 406 (Preview) to JEP 441 (Final)

- **Java 17** (JEP 406): First preview — type patterns in switch
- **Java 18** (JEP 420): Second preview — refined semantics, guarded patterns with `&&`
- **Java 19** (JEP 427): Third preview — introduced `when` clause for guards
- **Java 20** (JEP 433): Fourth preview — further refinements
- **Java 21** (JEP 441): **Finalized** — no preview flag needed

---

## 12.2 Type Patterns in Switch

```java
sealed interface JsonValue permits JsonNull, JsonBool, JsonNumber, JsonString,
                                   JsonArray, JsonObject {}
record JsonNull()                        implements JsonValue {}
record JsonBool(boolean value)           implements JsonValue {}
record JsonNumber(double value)          implements JsonValue {}
record JsonString(String value)          implements JsonValue {}
record JsonArray(List<JsonValue> items)  implements JsonValue {}
record JsonObject(Map<String, JsonValue> fields) implements JsonValue {}

// Type-pattern switch — exhaustive, no default needed
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

## 12.3 Guarded Patterns: The `when` Clause

Guarded patterns add a condition to a case arm:

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

Order matters: more specific cases (with guards) must come before more general cases. The compiler enforces that more specific patterns dominate less specific ones in the correct order.

---

## 12.4 Null Handling in Switch

Before Java 21, passing `null` to a switch always threw `NullPointerException`. Now you can handle it explicitly:

```java
// Explicit null case
String describe(Object obj) {
    return switch (obj) {
        case null         -> "null value";
        case Integer i    -> "integer: " + i;
        case String s     -> "string: " + s;
        default           -> "other: " + obj;  // 'default', not 'case default'
    };
}

// Combine null with default (valid — case null can share a label with default)
String process(String input) {
    return switch (input) {
        case null         -> "null";           // null must be its own case label
        case ""           -> "empty";          // constant string is a separate case
        case String s when s.length() > 100 -> "very long: " + s.substring(0, 20) + "...";
        case String s     -> "normal: " + s;
    };
}
```

---

## 12.5 Exhaustiveness: Compiler Guarantees

With sealed types, the compiler verifies that all cases are covered:

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
        // No default needed — sealed type guarantees exhaustiveness
    };
}
// If you add a new permitted subtype to Status,
// the compiler FAILS with "switch expression does not cover all possible input values"
```

---

## 12.6 Dominance Rules

Pattern cases have a **dominance** order: if pattern P dominates pattern Q, Q must come after P:

```java
// COMPILE ERROR: 'case Object o' dominates 'case String s'
// String o = switch (obj) {
//     case Object o -> "object";  // too general — compiler error
//     case String s -> "string";
// };

// CORRECT: more specific first
String describe(Object obj) {
    return switch (obj) {
        case String s when s.isEmpty() -> "empty string";  // most specific
        case String s                  -> "string: " + s;  // less specific
        case Integer i                 -> "integer: " + i;
        case null                      -> "null";
        default                        -> "other";
    };
}
```

---

## 12.7 Full Expression Evaluator with Patterns

A complete, realistic example combining sealed classes, record patterns, and switch:

```java
sealed interface Expr permits Lit, Add, Sub, Mul, Div, Neg, Var, Let {}
record Lit(double value)             implements Expr {}
record Var(String name)              implements Expr {}
record Add(Expr left, Expr right)    implements Expr {}
record Sub(Expr left, Expr right)    implements Expr {}
record Mul(Expr left, Expr right)    implements Expr {}
record Div(Expr left, Expr right)    implements Expr {}
record Neg(Expr expr)                implements Expr {}
record Let(String varName, Expr value, Expr body) implements Expr {}

// Evaluator
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
        case Let(String varName, Expr val, Expr body) -> {
            // 'var' is a context-sensitive keyword — safe as a record field name,
            // but naming it 'varName' here avoids confusion with the 'var' type-inference keyword
            var newEnv = new HashMap<>(env);
            newEnv.put(varName, eval(val, env));
            yield eval(body, newEnv);
        }
    };
}

// Pretty printer
static String prettyPrint(Expr expr) {
    return switch (expr) {
        case Lit(double v)              -> String.valueOf(v);
        case Var(String name)           -> name;
        case Neg(Expr e)                -> "(-" + prettyPrint(e) + ")";
        case Add(Expr l, Expr r)        -> "(" + prettyPrint(l) + " + " + prettyPrint(r) + ")";
        case Sub(Expr l, Expr r)        -> "(" + prettyPrint(l) + " - " + prettyPrint(r) + ")";
        case Mul(Expr l, Expr r)        -> "(" + prettyPrint(l) + " * " + prettyPrint(r) + ")";
        case Div(Expr l, Expr r)        -> "(" + prettyPrint(l) + " / " + prettyPrint(r) + ")";
        case Let(String varName, Expr val, Expr body) ->
            "let " + varName + " = " + prettyPrint(val) + " in " + prettyPrint(body);
    };
}
```

---

## 12.8 The default vs `_` in Switch

Both `default` and `_` (unnamed pattern) catch unmatched cases:

```java
// 'default' — traditional, matches non-null and null if not handled
String x = switch (val) {
    case String s -> "string";
    default -> "other";
};

// '_' — unnamed pattern, matches all remaining (non-null)
String y = switch (val) {
    case String s -> "string";
    case _ -> "other";
};

// Difference: 'default' is also tried if no pattern matches for null
// '_' is a pattern and doesn't match null
```

---

## 12.9 Summary

Pattern matching for switch, finalized in Java 21, is the culmination of the pattern matching journey:

- **Type patterns** in switch for concise dispatch without casts
- **Guarded patterns** with `when` for conditional case refinement
- **Null handling** with explicit `case null`
- **Exhaustiveness checking** with sealed types — compiler-verified completeness
- **Record patterns** in switch arms — destructure and test in one operation
- **Dominance rules** enforced by the compiler — no ambiguous case ordering

Combined with records and sealed classes, this makes Java a practical language for building type-safe, exhaustively-handled data models that rival Kotlin's `when` expressions and Scala's match expressions.
