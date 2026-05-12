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
