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
