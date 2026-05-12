# Chapter 1: Records — Immutable Data Carriers

Records are one of the most impactful additions to the Java language in a decade. Finalized in Java 16 (JEP 395) and a cornerstone of Java 17, records eliminate the relentless boilerplate that plagues data-carrier classes, while simultaneously encoding *intent* in the type system: a record says "this is a transparent, immutable aggregation of its components." Understanding records deeply — their capabilities, their constraints, and the design philosophy behind them — is essential for any modern Java engineer.

---

## 1.1 The Problem Records Solve

Consider a simple `Point` class. Before records, you had to write:

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

That's 30+ lines for a 2-field data class. With Lombok's `@Value`, you can reduce it, but you've introduced an annotation processor dependency, and the class still isn't a first-class language concept — it's a code-generated facade.

With records, the same class becomes:

```java
public record Point(double x, double y) {}
```

One line. No boilerplate. No annotation processor. Full compiler support.

---

## 1.2 Anatomy of a Record Declaration

The grammar is concise:

```
[modifiers] record <Name>(<components>) [implements <interfaces>] { [body] }
```

A practical example covering all parts:

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

The **components** (the parameters in parentheses) are the defining features of a record. Each component implicitly declares:
1. A `private final` field with the same name and type
2. A public accessor method with the same name (not `getX()` — just `x()`)
3. Participation in the auto-generated `equals`, `hashCode`, and `toString`

Records are implicitly `final` — they cannot be extended. They extend `java.lang.Record` implicitly.

---

## 1.3 Auto-generated Methods

The compiler synthesizes four things automatically:

**Canonical constructor**: accepts all components in declaration order.

**Accessor methods**: one per component, returning the component's value.

**`equals()`**: compares all components using their own `equals()`.

**`hashCode()`**: derived from all components.

**`toString()`**: produces `ClassName[comp1=val1, comp2=val2, ...]`.

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

## 1.4 Compact Constructors

The **compact constructor** is a record-specific feature for adding validation or normalization without repeating component assignments:

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

The compact constructor body executes *before* the implicit field assignments. You can reassign the component variables inside it:

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

This is far cleaner than the pre-record idiom of `this.address = address.strip().toLowerCase()` scattered through constructors.

---

## 1.5 Custom Constructors and Accessor Overrides

You can define additional constructors, but they **must delegate to the canonical constructor** via `this(...)`:

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

You can also override accessor methods — useful for defensive copying of mutable components:

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

## 1.6 Records and Interfaces

Records can implement interfaces, which is a powerful pattern for expressing capabilities:

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

This is particularly powerful when building generic repositories or processing pipelines:

```java
public <ID, T extends Identifiable<ID>> void save(T entity) {
    System.out.println("Saving entity with id: " + entity.id());
}
```

---

## 1.7 Generic Records

Records support generics fully:

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

Usage:

```java
var pair = new Pair<>("hello", 42);
System.out.println(pair.swap()); // Pair[first=42, second=hello]

var result = Result.ok("user found");
System.out.println(result.getOrThrow()); // user found

var failed = Result.<String>fail("user not found");
System.out.println(failed.isOk()); // false
```

---

## 1.8 Local Records

Records can be declared locally inside methods — an excellent tool for intermediate computation shapes that shouldn't pollute the package namespace:

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

Local records are `static` by definition — they cannot capture enclosing instance state.

---

## 1.9 Restrictions: What Records Can't Do

Understanding what records *cannot* do is as important as knowing what they can:

| Restriction | Reason |
|-------------|--------|
| Cannot extend another class | Records implicitly extend `java.lang.Record` |
| Cannot be extended by another class | Records are implicitly `final` |
| Cannot declare instance fields beyond components | Components are the complete state |
| Cannot have mutable components (enforced by immutable fields) | But mutable objects *in* components are your responsibility |
| Compact constructor cannot explicitly call `this(...)` | It's already the canonical constructor |
| Components cannot be `transient` (but explicit fields can) | The component state is the record's identity |

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

## 1.10 Records with Serialization

Records serialize naturally. The deserialization process uses the canonical constructor, which means compact constructor validation runs on deserialization too — a significant improvement over traditional Java serialization:

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

## 1.11 Records vs Lombok @Value vs Traditional POJOs

| Feature | Traditional POJO | Lombok `@Value` | Java Record |
|---------|-----------------|-----------------|-------------|
| Boilerplate | High | None (generated) | None (native) |
| Requires annotation processor | No | Yes | No |
| Immutability | Manual (`final` fields) | Enforced | Enforced |
| Accessor style | `getX()` | `getX()` | `x()` |
| Can be extended | Yes | No | No |
| Supports inheritance | Yes | No | No (only interfaces) |
| JVM awareness | None | None | First-class type |
| Pattern matching support | No | No | Yes (JEP 440) |
| IDE support | Good | Good (plugin needed) | Excellent (native) |
| Serialization safety | Manual | Manual | Constructor always called |

The key insight: records are a **language-level concept**, not a code generation trick. The JVM understands records, pattern matching understands records, and future Java features will continue to integrate with them deeply.

---

## 1.12 Real-World Patterns

### Domain Value Objects

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

### DTOs for API layers

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

### Result types

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

## 1.13 Records with Stream API and Collectors

Records integrate beautifully with streams:

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

Using `Collectors.teeing()` to compute multiple aggregations in one pass:

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

## 1.14 Summary

Records are a first-class language feature that:

- **Eliminate boilerplate** for data-carrier classes (constructor, equals, hashCode, toString, accessors)
- **Encode intent** — a record declares "this type is purely about its data"
- **Enforce immutability** — components are always `private final`
- **Enable pattern matching** — record deconstruction patterns (Chapter 11) are built on records
- **Improve serialization safety** — canonical constructor always runs on deserialization
- **Compose well** — with interfaces, generics, streams, and the rest of modern Java

The key adoption rule: **if a class is a transparent, immutable data carrier, it should be a record**. Reserve regular classes for types that have behavioral identity or need mutable state. This distinction, when applied consistently, produces codebases that are dramatically more readable and maintainable.
