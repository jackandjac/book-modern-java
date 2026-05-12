# 第16章：Java 25 中的结构化并发（Structured Concurrency）（JEP 505 — 第5次预览）

结构化并发（Structured Concurrency）在 Java 25 中通过 JEP 505 继续其预览演进。与 Java 21 预览版（第8章）相比，最重要的变化是引入了新的 `StructuredTaskScope.open()` 工厂方法（Factory Method）和可插拔的 `Joiner` 接口，取代了之前基于子类化的 `ShutdownOnFailure` 和 `ShutdownOnSuccess` 模型。

---

## 16.1 自 Java 21 以来的 API 改进

Java 21 的 API 要求通过子类化 `StructuredTaskScope` 来创建自定义的合并策略（Join Policy）。Java 25 的 API 引入了更简洁的设计：

| Java 21 API | Java 25 API |
|-------------|-------------|
| `new StructuredTaskScope.ShutdownOnFailure()` | `StructuredTaskScope.open(Joiner.awaitAll())` 或 `StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())` |
| `new StructuredTaskScope.ShutdownOnSuccess<T>()` | `StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())` |
| 自定义子类 | 实现 `Joiner<T, R>` 接口 |
| `scope.join()` 然后 `scope.throwIfFailed()` | `scope.join()` 直接返回 Joiner 的结果 |

---

## 16.2 StructuredTaskScope.open() — 新的工厂方法

```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Joiner;
import java.util.concurrent.StructuredTaskScope.Subtask;

// Java 25 风格 — 使用 Joiner 的 open()
public OrderDetail getOrderDetail(String orderId) throws Exception {
    try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {

        Subtask<Order>    orderTask = scope.fork(() -> orderService.find(orderId));
        Subtask<Customer> custTask  = scope.fork(() -> customerService.find(orderId));

        // join() 返回 Joiner 的结果 — 在此例中为 Void（全部成功或全部失败）
        scope.join();

        return new OrderDetail(orderTask.get(), custTask.get());
    }
}
```

---

## 16.3 内置 Joiner

### Joiner.allSuccessfulOrThrow() — 替代 ShutdownOnFailure

```java
// 所有任务必须成功；如果任何一个失败则抛出第一个异常
try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
    var task1 = scope.fork(() -> serviceA.call());
    var task2 = scope.fork(() -> serviceB.call());
    scope.join(); // 如果任何任务失败则抛出异常

    String a = task1.get();
    String b = task2.get();
    return a + b;
}
```

### Joiner.anySuccessfulResultOrThrow() — 替代 ShutdownOnSuccess

```java
// 返回第一个成功的结果；如果所有任务都失败则抛出异常
try (var scope = StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())) {
    scope.fork(() -> primaryEndpoint.call());
    scope.fork(() -> fallbackEndpoint.call());

    String result = scope.join(); // 返回第一个成功的结果
    return result;
}
```

### Joiner.awaitAll() — 等待全部完成，不快速失败

```java
// 等待所有任务完成，不管是否有失败；手动收集结果
try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    var task1 = scope.fork(() -> serviceA.call());
    var task2 = scope.fork(() -> serviceB.call());
    var task3 = scope.fork(() -> serviceC.call());

    scope.join(); // 等待所有任务完成；失败时不抛出异常

    // 处理结果，包括部分失败的情况
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

## 16.4 自定义 Joiner 实现

`Joiner<T, R>` 接口允许构建完全自定义的合并策略：

```java
// 自定义 Joiner：收集所有成功的结果，忽略失败
// T = 任务结果类型，R = Joiner 结果类型
class CollectSuccessful<T> implements Joiner<T, List<T>> {
    private final List<T> results = new CopyOnWriteArrayList<>();

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        if (subtask.state() == Subtask.State.SUCCESS) {
            results.add(subtask.get());
        }
        return false; // 不因任何单个任务完成而关闭作用域
    }

    @Override
    public List<T> result() {
        return Collections.unmodifiableList(results);
    }
}

// 用法：
try (var scope = StructuredTaskScope.open(new CollectSuccessful<String>())) {
    urls.forEach(url -> scope.fork(() -> httpClient.fetch(url)));
    List<String> successful = scope.join(); // 仅返回成功的结果
}
```

另一个自定义 Joiner — 支持超时的部分结果收集器：

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
        // 如果超时则关闭作用域
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

## 16.5 子任务状态（Subtask States）

```java
// Subtask.State 与 Java 21 中相同：
enum State {
    UNAVAILABLE, // 任务已分叉但作用域尚未合并，或任务已被取消
    SUCCESS,     // 正常完成
    FAILED       // 以异常完成
}
```

---

## 16.6 与作用域值（Scoped Values）的集成（在 Java 25 中已最终确定）

在 Java 25 中，结构化并发和作用域值（Scoped Values）要么已最终确定，要么处于后期预览阶段 — 它们可以无缝集成：

```java
public static final ScopedValue<String> TENANT = ScopedValue.newInstance();
public static final ScopedValue<User> USER     = ScopedValue.newInstance();

public TenantReport generateReport(String tenantId, User user) throws Exception {
    return ScopedValue.where(TENANT, tenantId)
                      .where(USER,   user)
                      .call(() -> {
        try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
            // 每个分叉的任务自动继承 TENANT 和 USER
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

## 16.7 生产环境模式

### 断路器模式（Circuit Breaker Pattern）

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
                yield true; // 已获得结果，关闭作用域
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

## 16.8 何时使用：结构化并发 vs CompletableFuture vs 响应式编程

第8章中的指导原则仍然适用，Java 25 增加了更多细微考量：

- **结构化并发（Structured Concurrency）**：适用于具有明确任务集和结构化结果的并行 I/O 操作。与虚拟线程（Virtual Threads）天然配合。
- **CompletableFuture**：当不需要完整的生命周期管理时，仍然适用于简单的异步组合。新代码建议优先使用结构化并发。
- **响应式流（Reactive Streams）（Reactor、RxJava）**：当需要**背压（Backpressure）**时使用 — 例如从慢速生产者流式传输数据、消费者控制速率的处理管道。

---

## 16.9 总结

Java 25 中的结构化并发（第5次预览）带来了：

- **`StructuredTaskScope.open(joiner)`** — 比子类化更简洁的工厂方法
- **`Joiner` 接口** — 可插拔的合并策略：`allSuccessfulOrThrow()`、`anySuccessfulResultOrThrow()`、`awaitAll()`
- **自定义 Joiner** — 可实现任意收集/关闭策略
- **自动继承作用域值（Scoped Values）** — 分叉的任务可以看到父任务的作用域值绑定
- **改进的线程转储（Thread Dumps）** — 层次化的任务结构在 JVM 诊断工具中可见

在 Java 25 中仍需使用 `--enable-preview`。预计将在 Java 27 或下一个 LTS 版本中最终确定。
