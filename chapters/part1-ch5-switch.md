# Chapter 5: Switch Expressions and Pattern Matching for Switch

> **JEP 361** (finalized, Java 14) · **JEP 406** (preview, Java 17) · **JEP 420** (second preview, Java 18) · **JEP 441** (finalized, Java 21)

The `switch` construct has undergone the most dramatic evolution of any language feature in the history of Java. From a humble C-derived statement plagued by fall-through bugs to a fully expressive pattern-matching expression capable of replacing cascading `instanceof` chains, the modern `switch` is a first-class citizen of idiomatic Java. This chapter traces that evolution in full, from the failings of the classic statement to the exhaustive, type-safe pattern matching finalized in Java 21.

---

## 5.1 The Classic Switch Statement: Limitations and Fall-through Traps

For the better part of three decades, Java's `switch` statement carried the same semantics it inherited from C: execution enters at the matching `case` label and continues sequentially through every subsequent case until it hits an explicit `break` or the end of the block. This "fall-through" behavior is occasionally useful — grouping multiple values that share identical logic — but it is far more often the source of subtle, hard-to-diagnose bugs.

Consider the canonical footgun:

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

The omitted `break` on `case 1` is silent: the compiler issues no warning by default, and the test suite may not catch it until a production incident. Static analysis tools help, but the language itself bears no responsibility.

Beyond the fall-through problem, the classic `switch` statement carried three additional limitations that became increasingly painful as Java evolved toward functional idioms:

1. **No expression semantics.** A `switch` statement cannot appear on the right-hand side of an assignment or be used as a method argument. Every branch must independently assign to a pre-declared variable, leading to verbose patterns where a `final` local variable cannot be initialized from a switch without surrendering its `final`-ness or resorting to a helper method.

2. **Limited selector types.** Before Java 7, only integral types were supported. Java 7 added `String` support, but `float`, `double`, `boolean`, and arbitrary objects remained forbidden until the pattern-matching extensions arrived.

3. **No compile-time exhaustiveness.** A `switch` statement over an `enum` with no `default` branch compiles happily even when cases are missing. The compiler may emit an optional warning, but the program silently does nothing when control reaches a missing case.

These limitations were not merely inconveniences. They actively pushed developers toward `if-else` chains that are less readable and harder to optimize. The JDK team recognized this and began addressing it systematically, starting with switch expressions in JEP 361.

---

## 5.2 Switch Expressions (JEP 361): Arrow Labels and `yield`

JEP 361, finalized in Java 14 after preview periods in Java 12 and 13, introduced two critical innovations:

- **Switch expressions**: a `switch` construct that produces a value
- **Arrow labels** (`case X ->`): a non-fall-through, concise form of case label

Arrow labels are the simpler change to grasp. Each `case X -> expression` arm is self-contained: only the expression or block on the right-hand side of the arrow executes. There is no fall-through to the next arm, no `break` required, and no implicit sequencing.

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

Several points merit attention. The entire `switch` block is an expression: it yields a value (a `String` here) that is directly assigned to `dayName`. The `default` arm throws an exception, which is legal — an expression arm may be a `throw` statement. The variable `dayName` can be declared `final` because the switch expression initializes it in a single, definitive evaluation.

Multiple labels can share a single arm using a comma-separated list:

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

This replaces what previously required either multiple fall-through `case` labels with shared `break` points or a `Map` lookup — a significant readability win.

---

## 5.3 Switch Expressions vs. Switch Statements: When to Use Which

The introduction of switch expressions does not deprecate switch statements. Both forms remain valid Java, and understanding when to reach for each is an important part of mastering modern Java.

**Use a switch expression** when:

- The switch arms each produce a value and you want to capture that value.
- You want the compiler to enforce exhaustiveness (see Section 5.5).
- The arms are pure computations with no side effects: domain translations, category lookups, state machine transitions that return a new state.

**Use a switch statement** when:

- The switch arms perform side-effectful operations: writing to a database, publishing an event, updating mutable state.
- Not every arm needs to produce the same type of value.
- You genuinely need fall-through behavior (rare, but it still exists in the colon-label form of switch expressions too, though it is discouraged).

```java
// Example 5.4 — Switch statement is appropriate for side effects
switch (event.type()) {
    case ORDER_PLACED   -> orderService.reserve(event.orderId());
    case ORDER_CANCELLED -> orderService.release(event.orderId());
    case ORDER_SHIPPED  -> notificationService.notifyShipped(event.orderId());
    default             -> log.warn("Unknown event type: {}", event.type());
}
```

Note that arrow labels are also valid in switch statements; they eliminate fall-through while keeping the statement semantics (no value produced). This is the preferred style for all new switch statements — the old colon-label form should be reserved for the rare situation where intentional fall-through is required, and that intent should be documented with a `// falls through` comment.

---

## 5.4 Returning Values from Switch: The `yield` Keyword

When a switch expression arm requires more than a single expression — when you need local variables, loops, or conditional logic inside the arm — you use a block arm combined with the `yield` keyword:

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

The `yield` statement exits the block arm and provides the value of the entire switch expression. It is not a general `return`; it only works inside a switch expression arm. This distinction matters: `yield` does not exit the enclosing method, and its scope is strictly the switch expression.

The keyword `yield` was chosen carefully. Because `yield` was not a reserved keyword before Java 14, existing code using `yield` as an identifier continues to compile — the keyword is context-sensitive. The compiler distinguishes `yield(value)` (a method call to a hypothetical `yield` method) from the `yield value;` statement by examining the syntactic context.

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

While this compiles, naming a variable `yield` is confusing and should be avoided in new code.

---

## 5.5 Exhaustiveness in Switch Expressions

Switch expressions impose a constraint that switch statements do not: the compiler requires the switch to be **exhaustive** — every possible value of the selector must be covered. This is checked at compile time, and failure to cover all cases is a compile error, not a warning.

For primitive selectors and `String`, a `default` arm satisfies exhaustiveness trivially. The real benefit emerges with `enum` types:

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

If you add a new constant to `Status` — say, `ARCHIVED` — the compiler immediately flags all switch expressions over `Status` that lack coverage, turning a runtime oversight into a compile-time error. This is a profound advantage over the equivalent `if-else` chain or `Map`-based dispatch, where a missing entry silently does nothing at runtime.

The exhaustiveness guarantee is an opt-in: switch statements over enums do not require exhaustiveness. Only switch expressions do. This asymmetry is intentional — it preserves backward compatibility while offering stronger guarantees when you choose the expression form.

---

## 5.6 Pattern Matching for Switch (JEP 406 — Preview in Java 17)

JEP 406, previewed in Java 17, extended the switch selector from the narrow set of integral types, strings, and enums to **any reference type**, and extended the case labels from constants to **patterns**. This is the cornerstone of modern Java's type-safe dispatch mechanism.

To compile preview features in Java 17, you must pass the `--enable-preview` flag to both `javac` and `java`:

```bash
# Compiling with preview features enabled (Java 17)
javac --enable-preview --release 17 PatternSwitch.java

# Running the compiled class
java --enable-preview PatternSwitch
```

With pattern matching for switch, you can dispatch on the dynamic type of an object in a single, readable construct:

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

Compare this to the pre-Java 17 equivalent:

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

The switch version is not just more concise; it is semantically richer. The compiler can verify exhaustiveness for sealed types (as discussed in Section 5.10), eliminating the defensive `else` branch entirely.

---

## 5.7 Type Patterns in Switch

A **type pattern** in a `case` label consists of a type and a binding variable: `case SomeType varName`. When the selector matches the pattern, `varName` is bound to the selector value cast to `SomeType`, and the binding is in scope for the arm's expression or block.

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

Type patterns in switch follow the same dominance rules as patterns in `instanceof`: a more specific pattern must appear before a more general one, or the compiler reports a dominance error.

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

## 5.8 Guarded Patterns with `when` Clauses (Java 21 Final Syntax)

Pattern matching for switch is most powerful when combined with additional boolean guards. In the final Java 21 syntax (JEP 441), guards are expressed with a `when` clause appended to the pattern:

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

The `when` clause is evaluated only after the type test succeeds. The binding variable introduced by the pattern is in scope within the `when` expression, enabling precise sub-classification without nested `if` statements.

Note that during the preview period in Java 17 and 18, guards used the `&&` syntax: `case Integer i && i < 0`. The `when` keyword replaced this in Java 19 preview and was finalized in Java 21. When reading older code or preview-era tutorials, be aware of this syntactic difference.

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

## 5.9 Null Handling in Switch

Historically, passing `null` to a switch statement caused a `NullPointerException` at runtime. This was a consistent source of defensive null checks surrounding switch blocks. Pattern matching for switch (finalized in Java 21) addresses this directly by allowing a `case null` arm:

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

Without the `case null` arm, passing `null` still throws `NullPointerException`. The `case null` arm must be handled explicitly — the compiler does not insert implicit null handling. This design preserves backward compatibility: existing switches without `case null` throw `NullPointerException` for null selectors, exactly as before.

`case null` can also be combined with `default`:

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

## 5.10 Combining Switch with Sealed Classes: Exhaustiveness Guarantee

Sealed classes (JEP 409, finalized in Java 17) and pattern matching for switch are designed to work together. When a sealed interface or class is the selector type, the compiler knows the complete set of permitted subtypes and can verify that all of them are covered without requiring a `default` arm.

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

Note that the `case Literal(double v)` syntax uses **record deconstruction patterns**, which are part of JEP 440 (finalized in Java 21). We cover these in detail in Section 5.11.

The key implication for software design is powerful: **you can model variant types in Java using sealed interfaces and pattern-matched switch expressions, obtaining the same structural guarantees as algebraic data types in functional languages**. Adding a new permitted subtype to the sealed interface breaks all exhaustive switches at compile time, forcing you to handle the new case explicitly. This is the closest Java has come to the "make illegal states unrepresentable" principle that Haskell and Rust developers rely on.

If you do add a `default` arm to a switch over a sealed type, the compiler's exhaustiveness checking is satisfied but the compile-time guarantee is lost: the `default` arm silently absorbs any new subtypes you add later.

---

## 5.11 Switch with Records and Deconstruction (Preview Path)

Record patterns, finalized in Java 21 (JEP 440), allow case labels to destructure record instances directly, binding the record's components to named variables:

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

Record patterns can be nested, enabling deep structural matching:

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

Nested record patterns are an area of active evolution. In Java 25, further refinements to deconstruction are expected, particularly for generics and primitive patterns. Watch this space closely.

---

## 5.12 Performance: Switch vs. If-Else Chains

A common question from experienced Java engineers is whether the more expressive modern switch comes at a performance cost. The answer is nuanced, and understanding it requires knowing how the JVM translates switch constructs at the bytecode level.

**Classic integer switch statements** compile to either `tableswitch` (for dense integer ranges) or `lookupswitch` (for sparse integer sets). Both are O(1) or O(log n) operations respectively — significantly faster than a linear `if-else` chain for many values.

**Switch expressions with arrow labels** compile to the same `tableswitch`/`lookupswitch` bytecodes as classic switch statements when the selector is an integral type or enum. There is no runtime overhead from adopting the expression form.

**Pattern-matching switch** is more complex. Because the JVM's bytecode does not natively support type-pattern dispatch, the compiler generates type tests (`instanceof` checks) under the hood, which the JIT compiler then optimizes aggressively. In practice, for small numbers of alternatives (fewer than ~10), the performance of pattern-matching switch is indistinguishable from a hand-written `if-else instanceof` chain. For larger alternatives, the switch form may be faster due to JIT-level dispatch table optimizations.

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

In JMH benchmarks run on Java 21, pattern-matching switch and equivalent `if-else instanceof` chains perform within 2-5% of each other, well within the noise floor for most applications. **Prefer switch for readability and correctness guarantees; resort to performance profiling only if measurements indicate a bottleneck.**

---

## 5.13 Real-World Use: Command Processors, Parsers, State Machines

The practical value of modern switch emerges most clearly in three canonical domains: command dispatch, data format translation, and finite state machines.

**Command Processors**

A typical command-line or message-driven application receives commands as records or sealed types and dispatches them to handlers:

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

The compiler guarantees that every command type is handled. Adding a new command type without updating `dispatch` is a compile error.

**Expression Parsers / Interpreters**

Recursive interpreters for expression trees are a classic use case for structural dispatch:

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

**State Machines**

Event-driven state machines benefit from the combination of exhaustiveness checking and pattern matching:

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

This nested switch construction makes every valid state/event combination explicit. The compiler ensures the outer switch is exhaustive over `OrderState`. You retain full type safety — `event` inside each inner switch is still the sealed `OrderEvent` type, and the inner switches can also be made exhaustive by covering all event types.

---

## 5.14 Summary

The evolution of `switch` from Java 1 to Java 21 represents one of the most carefully designed feature progressions in the language's history. The changes arrived incrementally, each building on the last:

- **Switch expressions (JEP 361, Java 14)** eliminated fall-through from the happy path with arrow labels, enabled value-producing switches with `yield`, and introduced compile-time exhaustiveness for enum selectors.
- **Pattern matching for switch (JEP 406/420/441)** extended the switch selector to arbitrary reference types and the case labels to type patterns, guarded patterns, and null patterns, reaching its final form in Java 21.
- **Record patterns (JEP 440, Java 21)** added structural deconstruction directly in case labels, enabling deep, nested pattern matching on record hierarchies.

Together, these features bring Java into alignment with the pattern-matching capabilities long available in Scala, Kotlin, and functional languages — while doing so with a syntax that is immediately recognizable to Java engineers and backward compatible with existing code.

The practical guidance is straightforward: prefer switch expressions over switch statements for value-producing dispatches, use sealed interfaces to define closed type hierarchies, and rely on the compiler's exhaustiveness checking to prevent missing-case bugs as your domain model evolves. The combination of sealed types, records, and pattern-matching switch is the modern Java idiom for type-safe variant dispatch, and it should be in every experienced Java engineer's daily toolkit.

---

*Next: Chapter 6 examines the remaining Java 17 features — enhanced pseudorandom number generators, strong encapsulation of JDK internals, and the deprecations and removals that demand attention before upgrading.*
