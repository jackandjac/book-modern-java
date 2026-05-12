# 第1章：记录（Records）——不可变数据载体

记录（Records）是过去十年中对 Java 语言影响最深远的特性之一。它在 Java 16 中正式定稿（JEP 395），也是 Java 17 的基石特性。记录消除了数据载体类中令人疲于应付的大量样板代码，同时在类型系统中编码了*设计意图*：一个记录表明"这是一个透明的、不可变的组件聚合体"。深入理解记录——它的能力、约束以及背后的设计哲学——是每一位现代 Java 工程师的必备素养。

---

## 1.1 记录要解决的问题

考虑一个简单的 `Point` 类。在记录出现之前，你需要编写如下代码：

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

仅仅一个包含 2 个字段的数据类，就需要 30 多行代码。使用 Lombok 的 `@Value` 可以减少代码量，但这引入了注解处理器依赖，而且该类仍然不是一等语言概念——它只是一个代码生成的外观。

使用记录，同样的类变成了：

```java
public record Point(double x, double y) {}
```

一行代码。没有样板代码。没有注解处理器。完整的编译器支持。

---

## 1.2 记录声明的结构

语法非常简洁：

```
[modifiers] record <Name>(<components>) [implements <interfaces>] { [body] }
```

一个涵盖所有部分的实际示例：

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

**组件**（括号中的参数）是记录的核心定义特征。每个组件隐式声明了：
1. 一个同名同类型的 `private final` 字段
2. 一个同名的公共访问器方法（不是 `getX()`——而是 `x()`）
3. 参与自动生成的 `equals`、`hashCode` 和 `toString`

记录隐式地是 `final` 的——它们不能被继承。它们隐式地继承 `java.lang.Record`。

---

## 1.3 自动生成的方法

编译器自动合成四样东西：

**规范构造函数（Canonical constructor）**：按声明顺序接受所有组件作为参数。

**访问器方法**：每个组件一个，返回该组件的值。

**`equals()`**：使用各组件自身的 `equals()` 来比较所有组件。

**`hashCode()`**：由所有组件派生。

**`toString()`**：生成 `ClassName[comp1=val1, comp2=val2, ...]` 格式的字符串。

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

## 1.4 紧凑构造函数

**紧凑构造函数（Compact constructor）**是记录特有的功能，用于添加校验或规范化逻辑，而无需重复组件赋值：

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

紧凑构造函数体在隐式字段赋值*之前*执行。你可以在其中重新赋值组件变量：

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

这比记录出现之前在构造函数中散落 `this.address = address.strip().toLowerCase()` 的写法干净得多。

---

## 1.5 自定义构造函数与访问器重写

你可以定义额外的构造函数，但它们**必须通过 `this(...)` 委托给规范构造函数**：

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

你还可以重写访问器方法——这在需要对可变组件进行防御性复制时很有用：

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

## 1.6 记录与接口

记录可以实现接口，这是一种强大的能力表达模式：

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

在构建泛型仓储或处理管道时，这一点尤其强大：

```java
public <ID, T extends Identifiable<ID>> void save(T entity) {
    System.out.println("Saving entity with id: " + entity.id());
}
```

---

## 1.7 泛型记录

记录完全支持泛型：

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

用法：

```java
var pair = new Pair<>("hello", 42);
System.out.println(pair.swap()); // Pair[first=42, second=hello]

var result = Result.ok("user found");
System.out.println(result.getOrThrow()); // user found

var failed = Result.<String>fail("user not found");
System.out.println(failed.isOk()); // false
```

---

## 1.8 局部记录

记录可以在方法内部局部声明——这是一种极佳的工具，用于定义不应污染包命名空间的中间计算数据结构：

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

局部记录在定义上是 `static` 的——它们不能捕获外围实例的状态。

---

## 1.9 限制：记录不能做什么

理解记录*不能*做什么与了解它能做什么同样重要：

| 限制 | 原因 |
|------|------|
| 不能继承其他类 | 记录隐式继承 `java.lang.Record` |
| 不能被其他类继承 | 记录隐式为 `final` |
| 不能声明组件之外的实例字段 | 组件即完整状态 |
| 不能有可变组件（由不可变字段强制保证） | 但组件*中*的可变对象需要你自行负责 |
| 紧凑构造函数不能显式调用 `this(...)` | 它本身就是规范构造函数 |
| 组件不能是 `transient` 的（但显式字段可以） | 组件状态即记录的身份标识 |

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

## 1.10 记录与序列化

记录天然支持序列化。反序列化过程使用规范构造函数，这意味着紧凑构造函数中的校验逻辑在反序列化时同样会执行——这是相对于传统 Java 序列化的一大改进：

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

## 1.11 记录 vs Lombok @Value vs 传统 POJO

| 特性 | 传统 POJO | Lombok `@Value` | Java 记录 |
|------|----------|-----------------|-----------|
| 样板代码 | 多 | 无（生成的） | 无（原生的） |
| 需要注解处理器 | 否 | 是 | 否 |
| 不可变性 | 手动（`final` 字段） | 强制保证 | 强制保证 |
| 访问器风格 | `getX()` | `getX()` | `x()` |
| 可被继承 | 是 | 否 | 否 |
| 支持继承 | 是 | 否 | 否（仅支持接口） |
| JVM 感知度 | 无 | 无 | 一等类型 |
| 模式匹配（Pattern Matching）支持 | 否 | 否 | 是 (JEP 440) |
| IDE 支持 | 好 | 好（需要插件） | 优秀（原生） |
| 序列化安全性 | 手动 | 手动 | 构造函数始终被调用 |

关键洞见：记录是一个**语言层面的概念**，而非代码生成的技巧。JVM 理解记录，模式匹配理解记录，未来的 Java 特性也将持续与记录深度集成。

---

## 1.12 实战模式

### 领域值对象

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

### API 层的 DTO

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

### 结果类型

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

## 1.13 记录与 Stream API 和 Collectors

记录与流（Stream）完美集成：

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

使用 `Collectors.teeing()` 在单次遍历中计算多个聚合值：

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

## 1.14 总结

记录是一项一等语言特性，它能够：

- **消除样板代码**——数据载体类的构造函数、equals、hashCode、toString、访问器全部自动生成
- **编码设计意图**——记录声明了"这个类型纯粹是关于它的数据的"
- **强制不可变性**——组件始终是 `private final` 的
- **赋能模式匹配**——记录解构模式（第11章）正是建立在记录之上的
- **提升序列化安全性**——反序列化时始终会执行规范构造函数
- **良好的组合性**——与接口、泛型、流以及现代 Java 的其他特性无缝协作

关键采用原则：**如果一个类是透明的、不可变的数据载体，它就应该是一个记录**。将普通类保留给具有行为身份或需要可变状态的类型。当这一区分被一致地应用时，代码库的可读性和可维护性将获得质的提升。
