# Chapter 16: Structured Concurrency in Java 25 (JEP 505 — 5th Preview)

Structured concurrency continues its preview evolution in Java 25 with JEP 505. The most significant change from the Java 21 preview (Chapter 8) is the introduction of a new `StructuredTaskScope.open()` factory method and a pluggable `Joiner` interface that replaces the subclassing model of `ShutdownOnFailure` and `ShutdownOnSuccess`.

---

## 16.1 API Refinements Since Java 21

The Java 21 API required subclassing `StructuredTaskScope` to create custom join policies. The Java 25 API introduces a cleaner design:

| Java 21 API | Java 25 API |
|-------------|-------------|
| `new StructuredTaskScope.ShutdownOnFailure()` | `StructuredTaskScope.open(Joiner.awaitAll())` or `StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())` |
| `new StructuredTaskScope.ShutdownOnSuccess<T>()` | `StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())` |
| Custom subclass | Implement `Joiner<T, R>` interface |
| `scope.join()` then `scope.throwIfFailed()` | `scope.join()` returns the joiner result directly |

---

## 16.2 StructuredTaskScope.open() — The New Factory

```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Joiner;
import java.util.concurrent.StructuredTaskScope.Subtask;

// Java 25 style — open() with a Joiner
public OrderDetail getOrderDetail(String orderId) throws Exception {
    try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {

        Subtask<Order>    orderTask = scope.fork(() -> orderService.find(orderId));
        Subtask<Customer> custTask  = scope.fork(() -> customerService.find(orderId));

        // join() returns the Joiner's result — in this case Void (all-or-nothing)
        scope.join();

        return new OrderDetail(orderTask.get(), custTask.get());
    }
}
```

---

## 16.3 Built-in Joiners

### Joiner.allSuccessfulOrThrow() — Replaces ShutdownOnFailure

```java
// All tasks must succeed; throws the first exception if any fail
try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
    var task1 = scope.fork(() -> serviceA.call());
    var task2 = scope.fork(() -> serviceB.call());
    scope.join(); // throws if any task failed

    String a = task1.get();
    String b = task2.get();
    return a + b;
}
```

### Joiner.anySuccessfulResultOrThrow() — Replaces ShutdownOnSuccess

```java
// Returns the first successful result; throws if all tasks fail
try (var scope = StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())) {
    scope.fork(() -> primaryEndpoint.call());
    scope.fork(() -> fallbackEndpoint.call());

    String result = scope.join(); // returns first successful result
    return result;
}
```

### Joiner.awaitAll() — Wait, Don't Fail Fast

```java
// Wait for all tasks regardless of failures; collect results manually
try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    var task1 = scope.fork(() -> serviceA.call());
    var task2 = scope.fork(() -> serviceB.call());
    var task3 = scope.fork(() -> serviceC.call());

    scope.join(); // waits for all to finish; doesn't throw on failure

    // Process results, including partial failures
    var results = new ArrayList<String>();
    var errors  = new ArrayList<String>();

    for (var task : List.of(task1, task2, task3)) {
        switch (task.state()) {
            case SUCCESS     -> results.add(task.get());
            case FAILED      -> errors.add(task.exception().getMessage());
            case UNAVAILABLE -> errors.add("cancelled");
        }
    }

    if (!errors.isEmpty()) {
        log.warn("Partial failure: {}", errors);
    }
    return results;
}
```

---

## 16.4 Custom Joiner Implementation

The `Joiner<T, R>` interface allows building fully custom join policies:

```java
// Custom joiner: collect all successful results, ignore failures
// T = task result type, R = joiner result type
class CollectSuccessful<T> implements Joiner<T, List<T>> {
    private final List<T> results = new CopyOnWriteArrayList<>();

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        if (subtask.state() == Subtask.State.SUCCESS) {
            results.add(subtask.get());
        }
        return false; // don't shut down on any individual completion
    }

    @Override
    public List<T> result() {
        return Collections.unmodifiableList(results);
    }
}

// Usage:
try (var scope = StructuredTaskScope.open(new CollectSuccessful<String>())) {
    urls.forEach(url -> scope.fork(() -> httpClient.fetch(url)));
    List<String> successful = scope.join(); // only successful results
}
```

Another custom joiner — timeout-aware with partial results:

```java
class TimeBoundedJoiner<T> implements Joiner<T, List<T>> {
    private final Duration timeout;
    private final List<T> results = new CopyOnWriteArrayList<>();
    private final long startNanos = System.nanoTime();

    TimeBoundedJoiner(Duration timeout) {
        this.timeout = timeout;
    }

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        if (subtask.state() == Subtask.State.SUCCESS) {
            results.add(subtask.get());
        }
        // Shut down if timeout exceeded
        long elapsed = System.nanoTime() - startNanos;
        return elapsed >= timeout.toNanos();
    }

    @Override
    public List<T> result() {
        return Collections.unmodifiableList(results);
    }
}
```

---

## 16.5 Subtask States

```java
// Subtask.State is the same as in Java 21:
enum State {
    UNAVAILABLE, // Task was forked but scope hasn't joined yet, or it was cancelled
    SUCCESS,     // Completed normally
    FAILED       // Completed with an exception
}
```

---

## 16.6 Integration with Scoped Values (Finalized in Java 25)

In Java 25, both structured concurrency and scoped values are either finalized or in late preview — and they integrate seamlessly:

```java
public static final ScopedValue<String> TENANT = ScopedValue.newInstance();
public static final ScopedValue<User> USER     = ScopedValue.newInstance();

public TenantReport generateReport(String tenantId, User user) throws Exception {
    return ScopedValue.where(TENANT, tenantId)
                      .where(USER,   user)
                      .call(() -> {
        try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
            // Each forked task inherits TENANT and USER automatically
            var orders   = scope.fork(() -> orderService.getOrders());
            var invoices = scope.fork(() -> invoiceService.getInvoices());
            var metrics  = scope.fork(() -> metricsService.getMetrics());

            scope.join();

            return new TenantReport(
                orders.get(), invoices.get(), metrics.get(),
                TENANT.get(), USER.get()
            );
        }
    });
}
```

---

## 16.7 Production Patterns

### Circuit Breaker Pattern

```java
class CircuitBreakerJoiner<T> implements Joiner<T, Optional<T>> {
    private final int maxFailures;
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private volatile T successResult;

    CircuitBreakerJoiner(int maxFailures) {
        this.maxFailures = maxFailures;
    }

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        return switch (subtask.state()) {
            case SUCCESS -> {
                successResult = subtask.get();
                yield true; // got a result, shut down
            }
            case FAILED -> failureCount.incrementAndGet() >= maxFailures;
            case UNAVAILABLE -> false;
        };
    }

    @Override
    public Optional<T> result() {
        return Optional.ofNullable(successResult);
    }
}
```

---

## 16.8 When to Use vs CompletableFuture vs Reactive

The guidance from Chapter 8 still holds, with additional nuance in Java 25:

- **Structured concurrency**: use for parallel I/O with defined task sets and structured results. Pairs with virtual threads naturally.
- **CompletableFuture**: still valid for simple async composition when you don't need the full lifecycle management. Prefer structured concurrency for new code.
- **Reactive streams (Reactor, RxJava)**: use when you need **backpressure** — streaming data from slow producers, processing pipelines where the consumer controls the rate.

---

## 16.9 Summary

Structured concurrency in Java 25 (5th preview) brings:

- **`StructuredTaskScope.open(joiner)`** — cleaner factory vs. subclassing
- **`Joiner` interface** — pluggable join policies: `allSuccessfulOrThrow()`, `anySuccessfulResultOrThrow()`, `awaitAll()`
- **Custom Joiners** — implement any collection/shutdown policy
- **Automatic scoped value inheritance** — forked tasks see parent's scoped value bindings
- **Improved thread dumps** — hierarchical task structure visible in JVM diagnostic tools

Still requires `--enable-preview` in Java 25. Expect finalization in Java 27 or the following LTS.
