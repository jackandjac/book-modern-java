# Chapter 17: Flexible Constructor Bodies (JEP 492, Finalized Java 25)

Flexible Constructor Bodies — also known informally as "Statements before super()" — finalize in Java 25 after preview rounds in Java 22 (JEP 447) and Java 23 (JEP 482). This feature relaxes the long-standing restriction that `super()` or `this()` must be the *first statement* in a constructor, allowing certain statements to precede the super-constructor call.

---

## 17.1 The Old Rule: super() Must Come First

Java has always required `super()` or `this()` to be the first statement in a constructor. This rule was designed to ensure that instance fields are properly initialized before any code runs on the partially-constructed object. But it created a persistent pain point:

```java
// BEFORE Java 25: forced into ugly static helper pattern
public class ValidatedList<E> extends ArrayList<E> {
    private final int maxSize;

    public ValidatedList(List<E> source, int maxSize) {
        // We WANT to validate before super(), but we CAN'T
        // So we use a static helper to transform the argument
        super(ValidatedList.validate(source, maxSize));  // HACK
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

The static helper pattern is a workaround, not a design choice. It pollutes the class with methods that exist only to work around a constructor restriction.

---

## 17.2 What's Now Allowed: Statements Before super()

Java 25 allows statements before `super()` or `this()` **as long as they don't access `this`** (neither directly nor indirectly through instance method calls):

```java
// AFTER Java 25: clean validation before super()
public class ValidatedList<E> extends ArrayList<E> {
    private final int maxSize;

    public ValidatedList(List<E> source, int maxSize) {
        // These statements can now precede super()
        if (source == null) throw new NullPointerException("source is null");
        if (source.size() > maxSize)
            throw new IllegalArgumentException("source exceeds maxSize " + maxSize);

        super(source);  // super() called after validation — no static helper needed
        this.maxSize = maxSize;
    }
}
```

---

## 17.3 The Primary Use Case: Validation Before Delegation

The canonical use case is validating or transforming arguments before passing them to the super-constructor:

```java
public class BoundedChannel<T> extends ArrayBlockingQueue<T> {

    public BoundedChannel(int capacity, boolean fair, Collection<? extends T> initial) {
        // Validate before super()
        Objects.requireNonNull(initial, "initial collection must not be null");
        if (initial.size() > capacity) {
            throw new IllegalArgumentException(
                "Initial collection size (%d) exceeds capacity (%d)"
                    .formatted(initial.size(), capacity));
        }
        // No nulls allowed in elements
        for (T item : initial) {
            if (item == null) throw new NullPointerException("null elements not allowed");
        }

        super(capacity, fair, initial);
    }
}
```

---

## 17.4 Preparing Arguments for super() with Complex Logic

Sometimes the argument to `super()` needs non-trivial computation:

```java
public class ConfigurableThreadPool extends ThreadPoolExecutor {

    public ConfigurableThreadPool(PoolConfig config) {
        // Compute values from config before calling super()
        int coreSize = Math.max(1, config.minThreads());
        int maxSize  = Math.max(coreSize, config.maxThreads());
        long keepAlive = config.keepAliveSeconds();

        // Choose the queue implementation based on config
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

Before Java 25, this required extracting logic into multiple static helper methods, or using a builder/factory pattern instead of a constructor.

---

## 17.5 Constructors with this() Chaining

The feature also works with `this()` delegation:

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

    // Convenience constructors delegate to the validated canonical constructor
    public Connection(String host, int port) {
        // Can validate before this()
        if (host == null) throw new NullPointerException("host");
        this(host, port, 30_000);  // default timeout
    }

    public Connection(String hostAndPort) {
        // Complex parsing before this()
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

## 17.6 What You Still CANNOT Do Before super()

The restriction remains for any access to `this`:

```java
public class Restricted extends Base {

    private int value;

    public Restricted(int v) {
        // Still ILLEGAL before super():
        // this.value = v;              // accessing instance field
        // this.validate(v);            // calling instance method
        // int x = this.value;         // reading instance field
        // super.someMethod();          // calling super method (accesses this)
        // Objects.requireNonNull(this); // passing this reference

        // These are all LEGAL (don't access this):
        int processed = Math.abs(v);    // local computation
        String msg = "Value: " + v;     // string operations
        if (v < 0) throw new IllegalArgumentException(msg);
        var helper = new Helper(v);     // creating other objects (not this)

        super(processed);
        this.value = processed;         // LEGAL: after super()
    }
}
```

The compiler enforces this rule. Any statement before `super()` that accesses `this` (directly or transitively) is a compile error.

---

## 17.7 Real-World Refactoring: Cleaning Up Static Helpers

```java
// BEFORE: static helper methods cluttering the API
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

// AFTER: clean constructor, no static helpers
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

## 17.8 Summary

Flexible Constructor Bodies (JEP 492, final in Java 25) solve a real, recurring pain:

- **Validate arguments before delegating** to `super()` or `this()` — the primary use case
- **Compute complex arguments** for `super()` without static helper methods
- **Still protected from unsafe access** — any reference to `this` before `super()` is a compile error
- **Applies to both `super()` and `this()`** delegation
- **No syntax changes** — it's a relaxation of the existing constructor grammar

This feature quietly improves the quality of constructor code across Java codebases. Watch for it in framework code, collection subclasses, and domain layer builders.
