# 第17章：灵活的构造函数体（Flexible Constructor Bodies）（JEP 492，Java 25 正式发布）

灵活的构造函数体（Flexible Constructor Bodies）——也被非正式地称为"super() 之前的语句（Statements before super()）"——在 Java 25 中正式定稿，此前曾在 Java 22（JEP 447）和 Java 23（JEP 482）中作为预览功能（Preview）发布。该特性放宽了长期以来的限制，即 `super()` 或 `this()` 必须是构造函数中的*第一条语句*，允许某些语句出现在超类构造函数调用之前。

---

## 17.1 旧规则：super() 必须放在最前面

Java 一直要求 `super()` 或 `this()` 必须是构造函数中的第一条语句。这条规则的设计初衷是确保在部分构造的对象上运行任何代码之前，实例字段（instance fields）已被正确初始化。但它造成了一个长期存在的痛点：

```java
// Java 25 之前：被迫使用丑陋的静态辅助方法模式
public class ValidatedList<E> extends ArrayList<E> {
    private final int maxSize;

    public ValidatedList(List<E> source, int maxSize) {
        // 我们想在 super() 之前验证，但做不到
        // 所以只能用静态辅助方法来转换参数
        super(ValidatedList.validate(source, maxSize));  // 权宜之计
        this.maxSize = maxSize;
    }

    private static <E> List<E> validate(List<E> source, int maxSize) {
        if (source == null) throw new NullPointerException("source is null");
        if (source.size() > maxSize)
            throw new IllegalArgumentException("source exceeds maxSize " + maxSize);
        return source;
    }
}
```

静态辅助方法模式是一种变通方案，而非设计选择。它用仅为绕过构造函数限制而存在的方法污染了类的代码。

---

## 17.2 现在允许的写法：super() 之前的语句

Java 25 允许在 `super()` 或 `this()` 之前编写语句，**前提是这些语句不访问 `this`**（既不能直接访问，也不能通过调用实例方法间接访问）：

```java
// Java 25 之后：在 super() 之前进行干净的验证
public class ValidatedList<E> extends ArrayList<E> {
    private final int maxSize;

    public ValidatedList(List<E> source, int maxSize) {
        // 这些语句现在可以出现在 super() 之前
        if (source == null) throw new NullPointerException("source is null");
        if (source.size() > maxSize)
            throw new IllegalArgumentException("source exceeds maxSize " + maxSize);

        super(source);  // 验证之后再调用 super()——不需要静态辅助方法
        this.maxSize = maxSize;
    }
}
```

---

## 17.3 主要用例：委托前的验证

最典型的用例是在将参数传递给超类构造函数之前进行验证或转换：

```java
public class BoundedChannel<T> extends ArrayBlockingQueue<T> {

    public BoundedChannel(int capacity, boolean fair, Collection<? extends T> initial) {
        // 在 super() 之前验证
        Objects.requireNonNull(initial, "initial collection must not be null");
        if (initial.size() > capacity) {
            throw new IllegalArgumentException(
                "Initial collection size (%d) exceeds capacity (%d)"
                    .formatted(initial.size(), capacity));
        }
        // 不允许元素为 null
        for (T item : initial) {
            if (item == null) throw new NullPointerException("null elements not allowed");
        }

        super(capacity, fair, initial);
    }
}
```

---

## 17.4 为 super() 准备需要复杂逻辑的参数

有时传递给 `super()` 的参数需要非平凡的计算：

```java
public class ConfigurableThreadPool extends ThreadPoolExecutor {

    public ConfigurableThreadPool(PoolConfig config) {
        // 在调用 super() 之前从 config 中计算各项值
        int coreSize = Math.max(1, config.minThreads());
        int maxSize  = Math.max(coreSize, config.maxThreads());
        long keepAlive = config.keepAliveSeconds();

        // 根据配置选择队列实现
        BlockingQueue<Runnable> workQueue = config.unbounded()
            ? new LinkedBlockingQueue<>()
            : new ArrayBlockingQueue<>(config.queueCapacity());

        ThreadFactory factory = Thread.ofVirtual()
            .name(config.threadNamePrefix() + "-", 0)
            .factory();

        super(coreSize, maxSize, keepAlive, TimeUnit.SECONDS, workQueue, factory);
    }
}
```

在 Java 25 之前，这需要将逻辑提取到多个静态辅助方法中，或者使用构建器（Builder）/工厂（Factory）模式来代替构造函数。

---

## 17.5 使用 this() 链式调用的构造函数

该特性同样适用于 `this()` 委托：

```java
public class Connection {
    private final String host;
    private final int port;
    private final int timeout;

    public Connection(String host, int port, int timeout) {
        if (host == null || host.isBlank())
            throw new IllegalArgumentException("host must not be blank");
        if (port < 1 || port > 65535)
            throw new IllegalArgumentException("port must be in range [1, 65535]: " + port);
        if (timeout < 0)
            throw new IllegalArgumentException("timeout must be non-negative");

        this.host    = host;
        this.port    = port;
        this.timeout = timeout;
    }

    // 便捷构造函数委托给经过验证的规范构造函数
    public Connection(String host, int port) {
        // 可以在 this() 之前进行验证
        if (host == null) throw new NullPointerException("host");
        this(host, port, 30_000);  // 默认超时时间
    }

    public Connection(String hostAndPort) {
        // 在 this() 之前进行复杂的解析
        String[] parts = hostAndPort.split(":", 2);
        if (parts.length != 2) {
            throw new IllegalArgumentException("Expected host:port, got: " + hostAndPort);
        }
        int parsedPort;
        try {
            parsedPort = Integer.parseInt(parts[1]);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid port: " + parts[1], e);
        }
        this(parts[0], parsedPort);
    }
}
```

---

## 17.6 在 super() 之前仍然不能做的事

对 `this` 的任何访问仍然受到限制：

```java
public class Restricted extends Base {

    private int value;

    public Restricted(int v) {
        // 在 super() 之前仍然是非法的：
        // this.value = v;              // 访问实例字段
        // this.validate(v);            // 调用实例方法
        // int x = this.value;         // 读取实例字段
        // super.someMethod();          // 调用 super 方法（会访问 this）
        // Objects.requireNonNull(this); // 传递 this 引用

        // 以下操作是合法的（不访问 this）：
        int processed = Math.abs(v);    // 局部计算
        String msg = "Value: " + v;     // 字符串操作
        if (v < 0) throw new IllegalArgumentException(msg);
        var helper = new Helper(v);     // 创建其他对象（不是 this）

        super(processed);
        this.value = processed;         // 合法：在 super() 之后
    }
}
```

编译器（Compiler）会强制执行此规则。任何在 `super()` 之前访问 `this`（直接或间接）的语句都会导致编译错误（compile error）。

---

## 17.7 实际重构案例：清理静态辅助方法

```java
// 重构前：静态辅助方法使 API 变得杂乱
public class SecureEndpoint extends HttpEndpoint {
    private final SecretKey signingKey;

    public SecureEndpoint(String url, byte[] rawKey) {
        super(url, SecureEndpoint.buildOptions(rawKey));
        this.signingKey = SecureEndpoint.deriveKey(rawKey);
    }

    private static EndpointOptions buildOptions(byte[] rawKey) {
        if (rawKey == null || rawKey.length < 32)
            throw new IllegalArgumentException("Key too short");
        return EndpointOptions.defaults().withTLS(true);
    }

    private static SecretKey deriveKey(byte[] rawKey) {
        return new SecretKeySpec(rawKey, 0, 32, "HmacSHA256");
    }
}

// 重构后：干净的构造函数，无需静态辅助方法
public class SecureEndpoint extends HttpEndpoint {
    private final SecretKey signingKey;

    public SecureEndpoint(String url, byte[] rawKey) {
        if (rawKey == null || rawKey.length < 32)
            throw new IllegalArgumentException("Key must be at least 32 bytes");

        var options = EndpointOptions.defaults().withTLS(true);
        super(url, options);

        this.signingKey = new SecretKeySpec(rawKey, 0, 32, "HmacSHA256");
    }
}
```

---

## 17.8 总结

灵活的构造函数体（JEP 492，Java 25 正式版）解决了一个真实且反复出现的痛点：

- **在委托前验证参数** —— 委托给 `super()` 或 `this()` 之前进行验证，这是最主要的用例
- **为 `super()` 计算复杂参数** —— 无需静态辅助方法
- **仍然防止不安全的访问** —— 在 `super()` 之前引用 `this` 会导致编译错误
- **同时适用于 `super()` 和 `this()`** 委托
- **无语法变更** —— 这只是对现有构造函数语法的放宽

该特性默默地提升了 Java 代码库中构造函数代码的质量。请关注它在框架代码、集合子类以及领域层构建器中的应用。
