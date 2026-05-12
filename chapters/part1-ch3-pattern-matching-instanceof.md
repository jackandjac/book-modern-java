# Chapter 3: Pattern Matching for instanceof

> JEP 394, finalized in Java 16, a cornerstone feature of Java 17

---

Pattern matching for `instanceof` is one of those language changes that looks modest in isolation but reveals its true impact only when you encounter the code it replaces. It is the first delivery of a larger, long-term pattern matching story in the Java platform — a story that continues through sealed classes, switch expressions, record patterns, and beyond. To understand where Java is going, you must understand where it started with JEP 394.

This chapter treats pattern matching for `instanceof` as the experienced Java engineer deserves: not as a syntax curiosity, but as a precise semantic tool with well-defined rules around scope, flow, generics, and performance. We will ground every concept in realistic code and conclude with a migration guide you can apply to your production codebases today.

---

## 3.1 The Tedium of the Old instanceof-cast Idiom

Every experienced Java engineer has written, reviewed, and refactored code that looks like this:

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

The smell here is not just verbosity. The cast on line three is logically redundant: the JVM has already verified the type on line two. You, the programmer, are repeating yourself to satisfy the type system, and the type system gains nothing from the repetition because it already knows. Worse, the introduction of a local variable (`Circle c`) on a separate line from the test (`shape instanceof Circle`) creates an implicit coupling that is invisible to the compiler. If a future maintainer removes or reorders the test but leaves the cast, a `ClassCastException` arrives at runtime.

The idiom also pollutes the enclosing scope. In the snippet above, `c`, `r`, and `t` are all visible throughout the method — even after their respective branches have concluded. That is rarely what you want.

Consider a more insidious variant: the double-check pattern that appeared in high-performance concurrent code before `java.util.concurrent` matured:

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

In practice this is safe because `event` is a local variable, but the cognitive overhead of reasoning about it is real. JEP 394 eliminates the entire class of problems.

---

## 3.2 Pattern Variables: Syntax and Semantics

The new syntax is compact:

```java
if (shape instanceof Circle c) {
    // c is available here, already typed as Circle
    return Math.PI * c.radius() * c.radius();
}
```

The fragment `Circle c` is called a **pattern** — specifically a **type pattern**. It consists of a type (`Circle`) and a **pattern variable** (`c`). The semantics are:

1. Evaluate `shape instanceof Circle` as before.
2. If the result is `true`, bind the pattern variable `c` to `shape` cast to `Circle`.
3. Make `c` available in the scope where the test is known to hold.

The binding is performed by the runtime using the same mechanics as a checked cast (`checkcast` bytecode), so there is no semantic difference from `(Circle) shape`. The difference is entirely in where that cast appears relative to what the programmer writes: the JVM does it implicitly, and the result is given a name you chose rather than a name you had to invent.

Rewriting the original example:

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

The cast lines are gone. Each branch is self-contained. The pattern variables `c`, `r`, and `t` do not pollute each other's scope (as we will see in the next section).

---

## 3.3 Scope of Pattern Variables — Flow-Sensitive Typing Explained

The scope rules for pattern variables are the most intellectually interesting part of JEP 394 because they use **definite assignment** analysis — the same underlying mechanism Java uses to enforce that local variables are initialized before use — but they extend it with **flow-sensitive typing**.

The compiler tracks whether a pattern variable is **definitely assigned** at each point in the control flow graph. The rule is:

- A pattern variable introduced by `e instanceof T v` is in scope in a region R if and only if `e instanceof T` is definitely true in R.

This sounds abstract, so let us build intuition through examples.

```java
// Pattern variable in scope only inside the if-block
public void inspect(Object obj) {
    if (obj instanceof String s) {
        System.out.println(s.length()); // s is in scope here
    }
    // s is NOT in scope here — the compiler rejects any reference to s
}
```

The scope does not extend past the closing brace because the compiler cannot guarantee that `obj` is a `String` at that point.

Now consider the `else` branch:

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

The scope of `s` is confined to the `true` branch. This is the right behavior: in the `else` branch, `s` would be unbound.

More subtle is the early-return idiom:

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

This is the guard-clause pattern, and Java 17 supports it fully. After the early return, the compiler knows `obj instanceof String` must have been true, so `s` is definitely assigned. This is the same reasoning that allows you to use a variable after `if (x == null) throw ...`.

The scope rule is recursive and handles nesting correctly:

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

## 3.4 Using Pattern Variables in Conditions: && and ||

The `&&` operator short-circuits: the right operand is evaluated only if the left operand is `true`. The compiler uses this to extend pattern variable scope into the right operand of `&&`:

```java
// Pattern variable usable in the same condition via &&
public boolean isNonEmptyString(Object obj) {
    return obj instanceof String s && !s.isEmpty();
    // s is in scope on the right of && because:
    // the right side is only evaluated when obj instanceof String is true
}
```

This is elegant. You can express multi-condition tests without intermediate variables:

```java
public boolean isValidEmailAddress(Object obj) {
    return obj instanceof String s
        && s.contains("@")
        && s.length() > 5
        && !s.startsWith("@")
        && !s.endsWith("@");
}
```

The `||` operator has the opposite semantics: the right operand is evaluated when the left is `false`. A pattern variable introduced in the left operand of `||` is NOT in scope in the right operand, because the right is reached only when the left test failed (meaning the pattern did not match):

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

The asymmetry between `&&` and `||` is a deliberate consequence of the definite-assignment rules and mirrors exactly how Java already handles boolean short-circuit evaluation. It is not arbitrary — it follows directly from the semantics.

---

## 3.5 Negation: The ! Operator with Patterns

Negation flips the scoping rules. When you negate an `instanceof` check, the pattern variable is in scope in the region where the original test would have been `false`:

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

This is the idiomatic way to write precondition checks with pattern matching. It reads exactly like the traditional `Objects.requireNonNull` pattern and integrates naturally with existing code conventions.

The interaction between `!` and `||` deserves attention:

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

## 3.6 Pattern Matching in Methods: Visitor-Like Dispatch

Before pattern matching, the canonical way to dispatch on type hierarchies was the Visitor pattern. It is powerful but expensive: it requires modifying every class in the hierarchy to accept a visitor, adding boilerplate, coupling the hierarchy to the visitor interface, and often involving double-dispatch mechanics that confuse newcomers.

Pattern matching enables a lightweight alternative that is appropriate when you do not own the hierarchy or when the dispatch logic is localized:

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

In Java 21+, the `switch` expression with pattern cases renders even this more elegant — but the `instanceof` chain is already a dramatic improvement over the Visitor that it replaces for non-hierarchical scenarios.

---

## 3.7 Combining with switch (Preview in Java 17) — A Forward Look

Java 17 shipped pattern matching for `switch` as a preview feature (JEP 406). While the full treatment of pattern switch belongs to later chapters, understanding how `instanceof` chains relate to `switch` is important context.

The `instanceof` chain:

```java
public String format(Object value) {
    if (value instanceof Integer i) return "int: " + i;
    if (value instanceof Long l)    return "long: " + l;
    if (value instanceof Double d)  return "double: " + d;
    if (value instanceof String s)  return "string: " + s;
    return "unknown: " + value;
}
```

Becomes in Java 21 (finalized):

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

The `switch` version is not just shorter — it is exhaustiveness-checked when the selector type is a sealed type or an enum. The compiler will tell you when you have missed a case. The `instanceof` chain offers no such guarantee.

The progression from `instanceof` to `switch` to `switch` with guarded patterns is the arc of Java's pattern matching story. JEP 394 is the foundation.

---

## 3.8 Null Handling with Pattern Matching

The existing `instanceof` operator returns `false` for `null`, and pattern matching preserves this semantics exactly:

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

This is the correct behavior in almost all cases: you do not want null to match any type pattern, because binding a null value to a typed pattern variable would be dangerous. However, you need to be aware of the consequence: if you want to handle null explicitly, you must do so separately.

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

In Java 21's `switch`, there is a dedicated `case null` label that makes this cleaner. But for `instanceof` chains in Java 17, the explicit null check at the top is the canonical approach.

---

## 3.9 Pattern Matching and Generics: Erasure Considerations

Java's type erasure creates a nuanced interaction with pattern matching that every experienced engineer must understand.

At runtime, generic type parameters are erased. `List<String>` and `List<Integer>` are both `List` at the bytecode level. Pattern matching operates on runtime types, so you cannot use a parameterized type in a type pattern:

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

The wildcard `List<?>` is your friend here. It allows you to match the raw structure without making unchecked claims about element types.

If you need to handle the element type, you must either use `instanceof` on individual elements or use an unchecked cast inside the branch with a `@SuppressWarnings`:

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

This is a fundamental limitation of erasure, not of pattern matching. Pattern matching makes the best of the situation by making `List<?>` ergonomic and by giving you a named variable immediately.

Arrays are not erased; their element type is a reifiable type at runtime:

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

## 3.10 Real-World Use Cases: JSON Processing, Command Dispatching, Event Handling

### JSON Processing

Consider a thin JSON model where parsed values are represented as `Object`. This is common in lower-level JSON libraries or when you receive `Object` from a dynamic deserialization layer:

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

### Command Dispatching

Command buses and CQRS architectures benefit enormously from pattern matching dispatch:

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

### Event Handling

Domain event processing is another natural fit:

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

## 3.11 Performance Considerations: No Overhead vs. Traditional instanceof+cast

A reasonable concern when adopting new syntax is whether it changes performance characteristics. For pattern matching `instanceof`, the answer is no: there is no overhead compared to the traditional `instanceof` plus explicit cast.

The JVM performs a single type check in both cases. The old idiom:

```java
if (shape instanceof Circle) {
    Circle c = (Circle) shape; // second type check at bytecode level
    ...
}
```

actually performed two type checks: one for the `instanceof` and one for the `(Circle)` cast. A JIT compiler could eliminate the redundant check (and virtually always did), but it was redundant at the source level. Pattern matching emits a single `instanceof` check and a single cast, with no null check needed (since `instanceof` already excludes null), resulting in the same or slightly better bytecode footprint.

You can verify this by examining the compiled bytecode. For the pattern matching version, `javap -c` will show an `instanceof` instruction followed by a `checkcast` or an optimized equivalent, exactly as the old idiom produced after JIT elimination. There is no new overhead.

The pattern variable is simply a local variable slot in the stack frame, allocated the same way any local variable is. The binding is as cheap as an assignment.

---

## 3.12 Pattern Matching with Interfaces and Abstract Classes

Pattern matching is not limited to concrete classes. You can match against interfaces and abstract classes exactly as you would with traditional `instanceof`:

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

Note the ordering in `summarize`: more specific types come first. If `Auditable` appeared before `Order`, the `Order` branch would never be reached for `Order` instances, because `Order` implements `Auditable`. This is the same ordering concern as with traditional `instanceof` chains, and it is a motivation for the exhaustiveness checking that `switch` with sealed types provides.

---

## 3.13 Migration Guide: Converting Existing instanceof Chains

Migrating existing code to use pattern matching is mechanical and safe. Here is a systematic approach.

**Step 1: Identify the target pattern.** Look for this structure:

```java
if (x instanceof SomeType) {
    SomeType st = (SomeType) x;
    // use st
}
```

**Step 2: Apply the transformation.** Replace with:

```java
if (x instanceof SomeType st) {
    // use st
}
```

**Step 3: Remove now-unused local variables.** The explicit cast variable is gone; delete it.

**Step 4: Look for scope-narrowing opportunities.** If the local variable was used only within the branch, the scope is already correct. If it was referenced later in the method in a way that should not compile post-migration, that is a code smell worth fixing.

Consider this before-and-after of a real-world configuration reader:

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

The `result` accumulator variable is gone. Each branch returns directly. The method is shorter, the logic is clearer, and the scope of each pattern variable is minimal.

**Step 5: Consider a future switch migration.** If the type hierarchy is sealed or logically closed, mark the migration for a follow-up pass when you adopt Java 21+ features. The `instanceof` chain converts cleanly to a `switch` expression with exhaustiveness checking.

**Automated migration.** Both IntelliJ IDEA and Eclipse offer automated inspections and quick-fixes for this transformation. The IntelliJ inspection "Pattern variable can be used" will highlight all eligible `instanceof`-cast idioms and offer a one-keystroke replacement. Use it as a discovery tool in large codebases, but review each transformation: occasionally the existing variable name is intentionally different from what the automated tool would choose, or the scope change matters.

---

## 3.14 Summary

Pattern matching for `instanceof` (JEP 394) is a focused, well-designed language feature that eliminates a specific and pervasive source of verbosity and error in Java code. Key takeaways:

- **Pattern variables** combine a type test and a binding into a single syntactic construct, removing the redundant explicit cast that the compiler previously required.

- **Scope rules** are based on definite assignment and flow-sensitive typing. Pattern variables are available only where the compiler can prove the match succeeded. This prevents a new class of variable misuse bugs.

- **`&&` extends scope** into the right operand because short-circuit evaluation guarantees the match holds there. `||` does not extend scope into the right operand because the right is evaluated when the left fails.

- **Negation** (`!`) and early return allow the guard-clause pattern, making pattern matching idiomatic for precondition checking.

- **Null** is never matched by any type pattern, preserving `instanceof`'s existing null-safe semantics.

- **Generics and erasure** limit type patterns to reifiable types. Use `List<?>` and similar wildcards to match generic containers.

- **No performance overhead**: pattern matching compiles to equivalent bytecode as the traditional idiom, with no additional runtime cost.

- **Migration is mechanical** and is supported by IDE quick-fixes. Prioritize methods with multiple `instanceof`-cast idioms for the highest readability gain.

Pattern matching for `instanceof` is the first step. Its scope rules, syntax, and semantics form the foundation for pattern matching in `switch` (Chapter 6), record patterns (Chapter 7), and the fully compositional pattern matching arriving in Java 25. The investment in understanding these fundamentals now will pay dividends throughout the rest of this book.

---

*Chapter 4 continues with Text Blocks, another Java 17 cornerstone feature that addresses a different but equally pervasive source of Java verbosity.*
