# Chapter 2: Sealed Classes and Interfaces

Sealed classes (JEP 409, finalized in Java 17) answer a question that Java developers have struggled with for decades: *how do I define a type hierarchy that is intentionally closed?* This question arises constantly in domain modeling — a `Shape` is always a `Circle`, `Rectangle`, or `Triangle`; a `PaymentMethod` is always `CreditCard`, `BankTransfer`, or `Crypto`; an HTTP response is either `Success` or `Failure`. Before sealed classes, Java offered no way to express this constraint in the type system. Now it does.

---

## 2.1 Motivation: The Problem with Open Class Hierarchies

Consider a classic shape hierarchy:

```java
// Before sealed classes: completely open hierarchy
public abstract class Shape {
    public abstract double area();
}

public class Circle extends Shape { ... }
public class Rectangle extends Shape { ... }
public class Triangle extends Shape { ... }
```

This hierarchy is *open* — anyone can add a `Pentagon`, a `Hexagon`, or even a `MaliciousShape` anywhere in any package. This openness creates several problems:

**Exhaustiveness checking is impossible.** If you write a method that handles each known shape:

```java
// Pre-Java 17: the compiler cannot verify this is exhaustive
double describe(Shape shape) {
    if (shape instanceof Circle c) return c.area();
    if (shape instanceof Rectangle r) return r.area();
    if (shape instanceof Triangle t) return t.area();
    throw new IllegalArgumentException("Unknown shape: " + shape);  // runtime crash
}
```

The `throw` at the end is a runtime time bomb. The compiler has no idea whether the `if` chain is exhaustive.

**Library authors cannot guarantee invariants.** A library that returns `Shape` values can't guarantee callers will only encounter the three known subclasses.

**Pattern matching switch cannot be exhaustive.** Without sealed classes, switch on an abstract type always requires a `default` clause, even when you've handled all meaningful cases.

---

## 2.2 Declaring Sealed Classes with the permits Clause

```java
public abstract sealed class Shape permits Circle, Rectangle, Triangle {
    public abstract double area();
    public abstract double perimeter();
}
```

The `sealed` modifier combined with `permits` enumerates every allowed direct subclass. The compiler enforces this bidirectionally: the permits clause must list exactly the classes that actually extend `Shape`.

Permitted subclasses must be in the same **compilation unit** (same package if unnamed module, or same module). They must also explicitly declare their relationship using one of three modifiers:

```java
// Option 1: final — no further extension
public final class Circle extends Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    public double radius() { return radius; }

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

    public double width() { return width; }
    public double height() { return height; }

    @Override public double area() { return width * height; }
    @Override public double perimeter() { return 2 * (width + height); }
}

public final class Square extends Rectangle {
    public Square(double side) { super(side, side); }

    public double side() { return width(); }
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

    public double base() { return base; }
    public double height() { return height; }
    public double hypotenuse() { return hypotenuse; }

    @Override public double area() { return 0.5 * base * height; }
    @Override public double perimeter() { return base + height + hypotenuse; }
}
```

---

## 2.3 Sealed Interfaces

Interfaces can be sealed too — a critical feature for expressing closed algebraic data types with records:

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

This pattern — sealed interface + record implementations — is now idiomatic Java for **algebraic data types (ADTs)**. It's the Java equivalent of Haskell's `data` types or Scala's `sealed trait`.

---

## 2.4 Subclass Constraints: final, sealed, non-sealed

Each permitted subclass **must** choose its stance:

| Modifier | Meaning | Use when |
|----------|---------|----------|
| `final` | No extension allowed | The leaf of the hierarchy, completely closed |
| `sealed` | Further extension with permits | You want a sub-hierarchy with its own closure |
| `non-sealed` | Open extension allowed | You want one arm of the hierarchy to be extensible |

`non-sealed` is the "escape hatch" that deliberately reopens the hierarchy. It's rarely the right choice for domain types, but it exists for frameworks and extensibility points.

---

## 2.5 Exhaustiveness in Sealed Hierarchies — the Compiler's Guarantee

The killer feature of sealed classes is **exhaustiveness checking** in `switch` expressions:

```java
// With sealed hierarchy — NO default needed, compiler checks exhaustiveness!
// Note: Square extends Rectangle, so Square must appear before Rectangle
double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Square s    -> s.side() * s.side();      // Square before Rectangle (more specific)
        case Rectangle r -> r.width() * r.height();
        case Triangle t  -> 0.5 * t.base() * t.height();
    };
}
```

If you add a new permitted subclass (say `Pentagon`) and forget to update this switch, the **compiler fails the build**. No more runtime crashes from missed cases.

---

## 2.6 Sealed Classes as Algebraic Data Types

The most powerful application of sealed classes is encoding **sum types** (a value is *one of* these alternatives) in a type-safe way. Combined with records, this produces clean, composable domain models:

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

Usage:

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

## 2.7 Domain Modeling with Sealed Classes

### HTTP Response modeling

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

### Event sourcing

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

## 2.8 Combining Sealed Classes with Pattern Matching

Sealed classes and pattern matching are designed to work together:

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

## 2.9 Sealed Classes in Error/Option Modeling

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

## 2.10 Migrating Existing Hierarchies to Sealed

If you have an existing open hierarchy:

```java
// Before: open hierarchy
public abstract class Notification {
    abstract void send();
}
public class EmailNotification extends Notification { ... }
public class SmsNotification extends Notification { ... }
public class PushNotification extends Notification { ... }
```

Migration steps:
1. Add `sealed` and `permits` to the parent
2. Add `final` (or `sealed` / `non-sealed`) to each subclass
3. Let the compiler tell you if you missed any permitted subclass
4. Update any `if-instanceof` chains to exhaustive `switch`

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

## 2.11 Summary

Sealed classes are a pivotal language feature that:

- **Close hierarchies** intentionally, making them self-documenting
- **Enable exhaustiveness checking** in switch expressions and pattern matching
- **Support algebraic data types** (sum types) idiomatically in Java
- **Pair with records** to produce clean, immutable, type-safe domain models
- **Integrate with pattern matching** (Chapters 3, 11, 12) for surgical, readable data dispatch

The rule of thumb: whenever a type has a *fixed set of known subtypes* and callers should handle all of them, reach for `sealed`. Combined with records, it's the foundation of modern Java data modeling.
