# 第7章：虚拟线程（Virtual Threads）——线程革命

虚拟线程（Virtual Threads，JEP 444，在 Java 21 中正式发布）是自泛型（Generics）以来对 Java 影响最为深远的一项新特性。它从根本上改变了并发代码的编写方式——并非引入新的抽象，而是让*现有的*阻塞式 API 能够扩展到数百万并发任务。如果你曾经花费多年时间与响应式编程（Reactive Programming）、回调地狱（Callback Hell）或复杂的线程池调优作斗争，虚拟线程就是这些问题的解决方案。

---

## 7.1 虚拟线程出现之前的线程模型

在 Java 21 之前，每个 Java 线程都直接映射到一个**操作系统线程**（即"平台线程（Platform Thread）"）。操作系统线程的开销很大：

- 每个平台线程需要约 1MB 的内核栈空间
- 操作系统线程之间的上下文切换（Context Switching）涉及内核调用
- 一个典型的 JVM 进程在维持约数千个平台线程后，性能就会开始下降

这给线程-每请求（Thread-per-Request）模型设定了一个硬性的可扩展性上限。一台需要处理 10,000 个并发 HTTP 请求的服务器就需要 10,000 个线程——而 10,000 个平台线程大约消耗 10GB 的内存，并产生严重的调度压力。

业界的应对方案是**响应式编程**：使用回调（Callback）、Future 或响应式流（Reactive Streams，如 Project Reactor、RxJava）进行非阻塞、事件驱动的编程。响应式代码可以仅用数十个线程处理 10,000 个并发请求——但它要求你围绕非阻塞 API 重构整个应用程序，面对跨越 30 个操作符链的堆栈追踪苦苦挣扎，并失去直线式代码的简洁性。

虚拟线程提供了第三条路径：保持简单、易读的线程-每请求模型，让 JVM 来处理其余的一切。

---

## 7.2 什么是虚拟线程？

**虚拟线程**是由 JVM 而非操作系统管理的轻量级线程。它的实现基于续体（Continuation）——一段可以被低成本挂起和恢复的调用栈。

JVM 在一个**载体线程（Carrier Thread）**池（即平台线程池）上运行虚拟线程。默认情况下，每个 CPU 核心对应一个载体线程。当虚拟线程阻塞时（如 I/O、sleep、锁等操作），JVM 会将其从载体线程上*卸载（Unmount）*——该载体线程随即变为空闲状态，可以运行另一个虚拟线程。当阻塞操作完成后，虚拟线程会被重新调度并*挂载（Mount）*到某个载体线程上。

```
Virtual Thread A (running)
       │
  [carrier thread 1] ──── CPU core 1

Virtual Thread A blocks on I/O
       │
  Carrier thread 1 picks up Virtual Thread B

  [carrier thread 1] ──── CPU core 1 (now running B)

I/O completes, Virtual Thread A is scheduled
       │
  [carrier thread 2] ──── CPU core 2 (now running A again)
```

结果就是：只要大多数虚拟线程处于等待状态，单个载体线程就可以服务数千个虚拟线程。

---

## 7.3 创建虚拟线程

虚拟线程使用我们熟悉的 `Thread` API：

```java
// 方式1：Thread.ofVirtual().start() —— 即发即忘
Thread vt = Thread.ofVirtual()
    .name("request-handler")
    .start(() -> processRequest(request));

// 方式2：Thread.ofVirtual().unstarted() —— 先创建，稍后启动
Thread unstarted = Thread.ofVirtual()
    .name("batch-worker-", 1)  // 名称前缀 + 序号
    .unstarted(() -> processBatch(batch));
unstarted.start();

// 方式3：Thread.startVirtualThread() —— 简写形式
Thread vt2 = Thread.startVirtualThread(() -> {
    System.out.println("Running in: " + Thread.currentThread());
    // 输出：Running in: VirtualThread[#42]/runnable@ForkJoinPool-1-worker-1
});

// 检查线程是否为虚拟线程
System.out.println(vt.isVirtual()); // true
System.out.println(Thread.currentThread().isVirtual()); // 取决于上下文
```

### 配合 ExecutorService 使用

最符合惯用法的方式——用于替代 I/O 密集型工作中的固定线程池：

```java
// 旧方式：固定线程池，限制并发数
ExecutorService oldPool = Executors.newFixedThreadPool(200);

// 新方式：每个任务一个虚拟线程，并发数无限制
ExecutorService virtualExecutor = Executors.newVirtualThreadPerTaskExecutor();

// API 完全相同——只需替换执行器
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futures = new ArrayList<>();

    for (String url : urls) {
        futures.add(executor.submit(() -> fetchUrl(url)));  // 每个任务获得自己的虚拟线程
    }

    for (Future<String> f : futures) {
        System.out.println(f.get());
    }
}  // try-with-resources 关闭并等待所有任务完成
```

---

## 7.4 虚拟线程的生命周期与挂载/卸载机制

虚拟线程与平台线程具有相同的状态（`NEW`、`RUNNABLE`、`WAITING`、`TIMED_WAITING`、`BLOCKED`、`TERMINATED`），但多了一个额外的概念：**挂载（Mounted）与卸载（Unmounted）**。

虚拟线程的状态：
- **已挂载（Mounted）**：当前正在某个载体线程上执行
- **已卸载（Unmounted）**：已挂起，其栈存储在堆内存（Heap Memory）中，不占用任何载体线程

当虚拟线程调用以下操作时，卸载会自动发生：
- 任何阻塞式 I/O 操作（`InputStream.read()`、`OutputStream.write()`、`Socket.connect()` 等）
- `Thread.sleep()`
- `Object.wait()`
- 获取一个当前被其他线程持有的 `ReentrantLock`
- 在 `Future.get()`、`CompletableFuture.join()`、`Semaphore.acquire()` 等上阻塞

```java
// 卸载演示
Thread.ofVirtual().start(() -> {
    System.out.println("Before sleep: " + Thread.currentThread()); // 已挂载
    Thread.sleep(1000);   // 卸载——在这一秒内载体线程被释放
    System.out.println("After sleep: " + Thread.currentThread());  // 重新挂载，可能在不同的载体线程上
});
```

---

## 7.5 阻塞式 I/O——如今几乎零成本

最具变革性的结果：**阻塞式 I/O 调用在虚拟线程上开销极低**。以前需要异步/响应式重写的代码现在可以保持同步风格：

```java
// 改造前：复杂的异步代码来处理 1000 个并发 HTTP 调用
// 使用 HttpClient 的异步 API 来避免阻塞线程
List<CompletableFuture<String>> futures = urls.stream()
    .map(url -> httpClient.sendAsync(
        HttpRequest.newBuilder(URI.create(url)).build(),
        HttpResponse.BodyHandlers.ofString()
    ).thenApply(HttpResponse::body))
    .toList();
CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new)).join();
List<String> results = futures.stream().map(CompletableFuture::join).toList();

// 改造后：简洁的同步代码，同样的可扩展性
List<String> results;
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    results = urls.stream()
        .map(url -> executor.submit(() -> {
            // 这个阻塞调用是零成本的——虚拟线程在等待期间会卸载
            HttpResponse<String> response = httpClient.send(
                HttpRequest.newBuilder(URI.create(url)).build(),
                HttpResponse.BodyHandlers.ofString()
            );
            return response.body();
        }))
        .toList()
        .stream()
        .map(future -> {
            try { return future.get(); }
            catch (Exception e) { throw new RuntimeException(e); }
        })
        .toList();
}
```

### 数据库查询示例

```java
// 每个虚拟线程处理一个请求——阻塞式 JDBC 完全没问题
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<Order>> orderFutures = orderIds.stream()
        .map(id -> executor.submit(() -> {
            // 这些阻塞式 JDBC 调用在虚拟线程上完全没问题
            Order order = orderRepository.findById(id);  // 在网络上阻塞
            order = enrichWithCustomerData(order);        // 在网络上阻塞
            return order;
        }))
        .toList();

    List<Order> orders = orderFutures.stream()
        .map(f -> {
            try { return f.get(); }
            catch (Exception e) { throw new RuntimeException(e); }
        })
        .toList();
}
```

---

## 7.6 钉住（Pinning）：虚拟线程无法卸载的情况

在以下两种情况下，虚拟线程会被**钉住（Pin）**在载体线程上，无法卸载：

1. **在 `synchronized` 代码块或方法内部**
2. **在本地方法调用（JNI）内部**

当被钉住时，虚拟线程会在阻塞操作期间一直占用载体线程——这就失去了虚拟线程的意义。

```java
// 问题：synchronized 代码块会钉住虚拟线程
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;  // 没问题——这里没有阻塞操作
    }

    public synchronized int getAndReset() {
        Thread.sleep(100);  // 钉住：占用载体线程 100 毫秒！
        int val = count;
        count = 0;
        return val;
    }
}

// 解决方案：使用 ReentrantLock 代替 synchronized
public class BetterCounter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }

    public int getAndReset() {
        lock.lock();
        try {
            Thread.sleep(100);  // 不会钉住——虚拟线程可以卸载
            int val = count;
            count = 0;
            return val;
        } finally {
            lock.unlock();
        }
    }
}
```

**关键建议**：在运行于虚拟线程上的代码中，优先使用 `java.util.concurrent.locks.ReentrantLock` 而非 `synchronized`。在 Java 24+ 中，`synchronized` 正在被增强以不再钉住虚拟线程（JEP 491）。

使用 JFR 检测钉住现象：

```bash
java -XX:+FlightRecorder \
     -XX:StartFlightRecording=filename=recording.jfr \
     -Djdk.tracePinnedThreads=full \
     -jar myapp.jar
```

---

## 7.7 虚拟线程中的线程局部变量：内存问题

线程局部变量（`ThreadLocal<T>`）可以在虚拟线程中使用，但存在内存方面的影响。如果你创建了数百万个虚拟线程，且每个线程都继承或创建了线程局部变量值，就可能消耗大量的堆内存。

```java
// 问题：开销高昂的逐虚拟线程初始化
static final ThreadLocal<DatabaseConnection> DB_CONN =
    ThreadLocal.withInitial(() -> openDatabaseConnection());  // 100万个连接?!

// 方案1：不要使用 ThreadLocal 存储昂贵的资源
// 使用连接池（如 HikariCP 等）在线程间共享

// 方案2：使用作用域值（Scoped Values，第9章）代替 ThreadLocal
// 作用域值是只读的，能被高效继承，作用域结束时会被垃圾回收

// 方案3：谨慎地池化逐线程状态
static final ThreadLocal<SimpleDateFormat> DATE_FORMAT =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
// 这样内存占用较低（每个虚拟线程一个 SDF），但如果有数百万个虚拟线程就很浪费
// 更好的做法：使用 DateTimeFormatter（线程安全，无需 ThreadLocal）
```

---

## 7.8 将 Spring Boot 迁移到虚拟线程

Spring Boot 3.2+ 使得启用虚拟线程变得极为简单：

```yaml
# application.yml —— 一行配置即可启用虚拟线程
spring:
  threads:
    virtual:
      enabled: true
```

启用后，Spring Boot 会将 Tomcat（以及 Jetty、Undertow）配置为使用虚拟线程来处理请求。每个 HTTP 请求获得自己的虚拟线程——数百万并发请求仅需 O(核心数) 个载体线程。

```java
// Spring MVC 控制器——阻塞式代码现在可以高效扩展
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private CustomerService customerService;
    @Autowired private InventoryService inventoryService;

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable String id) {
        // 这些阻塞调用完全没问题——请求运行在虚拟线程上
        Order order = orderService.findById(id);           // 在数据库上阻塞
        Customer customer = customerService.findById(order.customerId()); // 在数据库上阻塞
        boolean inStock = inventoryService.check(order.items());          // 在数据库上阻塞
        return new OrderResponse(order, customer, inStock);
    }
}
```

在没有虚拟线程的情况下，这个处理器在每次数据库调用期间都会阻塞一个平台线程。使用虚拟线程后，载体线程在每次阻塞调用期间都是空闲的——相同的代码，显著提高的吞吐量。

---

## 7.9 虚拟线程 vs 响应式编程

| 方面 | 响应式（WebFlux 等） | 虚拟线程 |
|------|----------------------|----------|
| 代码风格 | 函数式管道，`Mono<T>`/`Flux<T>` | 标准的顺序式代码 |
| 堆栈追踪 | 通常晦涩难懂，充斥操作符链噪音 | 正常、可读的堆栈追踪 |
| 可调试性 | 具有挑战性 | 标准调试器即可使用 |
| 阻塞式 I/O | 禁止使用（必须使用异步变体） | 可以使用 |
| CPU 密集型工作 | 无优势 | 无优势 |
| 学习曲线 | 陡峭 | 几乎没有（现有代码直接可用） |
| 背压（Backpressure） | 内置支持 | 需要显式实现 |
| 适用场景 | CPU 密集型 + I/O 混合工作负载、流处理 | I/O 密集型工作负载 |

**经验法则**：对于新的 I/O 密集型服务，使用虚拟线程。对于现有的响应式代码，除非有特定理由，否则不要重写。对于 CPU 密集型工作，响应式和虚拟线程都无法提供帮助——请使用并行流（Parallel Streams）或 `ForkJoinPool`。

---

## 7.10 调试虚拟线程

虚拟线程在线程转储（Thread Dump）中会显示其名称和载体线程信息：

```
#119 "" virtual
      java.base/java.lang.VirtualThread$VThreadContinuation.onPinned(VirtualThread.java:183)
      java.base/jdk.internal.vm.Continuation.pin(Continuation.java:392)
      java.base/java.lang.VirtualThread.park(VirtualThread.java:595)
      ...
```

使用 JFR 进行性能分析：

```java
// 编程方式的 JFR 记录
import jdk.jfr.Recording;
import jdk.jfr.consumer.RecordingFile;

try (Recording rec = new Recording()) {
    rec.enable("jdk.VirtualThreadStart");
    rec.enable("jdk.VirtualThreadEnd");
    rec.enable("jdk.VirtualThreadPinned");  // 检测钉住事件
    rec.start();

    // ... 运行你的工作负载 ...

    rec.stop();
    rec.dump(Path.of("vthread-recording.jfr"));
}
```

---

## 7.11 常见陷阱

### 不要池化虚拟线程

```java
// 错误：线程池对虚拟线程毫无意义
// 虚拟线程本身就是轻量级的——创建一个有界的池违背了其初衷
ExecutorService pool = new ThreadPoolExecutor(
    0, 1000, 60, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(),
    Thread.ofVirtual().factory()  // 将虚拟线程工厂与线程池搭配使用——毫无意义
);

// 正确：每个任务一个虚拟线程
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
```

### 不要在长时间阻塞的代码段中使用 synchronized

已在 7.6 节中讨论——优先使用 `ReentrantLock`。

### CPU 密集型任务仍然会阻塞载体线程

虚拟线程对 CPU 密集型工作没有帮助。执行大量计算的虚拟线程会在计算期间一直占用载体线程：

```java
// 对于 CPU 密集型任务：使用并行流或 ForkJoinPool.commonPool()
// 而非虚拟线程
List<Result> results = data.parallelStream()
    .map(this::heavyComputation)
    .toList();
```

---

## 7.12 总结

虚拟线程是一次没有范式变化的范式转换：

- **编写阻塞式代码**——它会自动扩展
- **数百万并发任务**仅需少量载体线程
- **无需 API 变更**——同样的 `Thread`、同样的 `ExecutorService`、同样的 `BlockingQueue`
- **避免在长时间阻塞的代码段中使用 `synchronized`**——改用 `ReentrantLock`
- **在 Spring Boot 3.2+ 中启用**只需一行 YAML 配置
- **并非响应式编程的替代品**——当需要背压控制时仍需响应式
- **对 CPU 密集型工作无益**——请使用并行流

虚拟线程是 Java 最初承诺的实现：编写简洁的、顺序式的代码，使其正确运行并能高效扩展。在响应式编程领域长达十年的迂回探索在操作系统线程限制下是必要的——但这些限制现在已经消除了。
