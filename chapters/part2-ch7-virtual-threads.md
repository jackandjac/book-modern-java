# Chapter 7: Virtual Threads — The Threading Revolution

Virtual threads (JEP 444, finalized in Java 21) are the single most impactful addition to Java since generics. They fundamentally change how you write concurrent code — not by introducing new abstractions, but by making the *existing* blocking-style API scale to millions of concurrent tasks. If you've spent years wrestling with reactive programming, callback hell, or complex thread pool tuning, virtual threads are the answer to those problems.

---

## 7.1 The Threading Model Before Virtual Threads

Every Java thread was, until Java 21, directly mapped to an **OS thread** (a "platform thread"). OS threads are expensive:

- Each platform thread requires ~1MB of kernel stack space
- Context switching between OS threads involves kernel calls
- A typical JVM process can sustain ~thousands of platform threads before performance degrades

This imposed a hard scalability ceiling on the thread-per-request model. A server with 10,000 simultaneous HTTP requests needs 10,000 threads — and 10,000 platform threads cost roughly 10GB of memory and create severe scheduling pressure.

The industry response was **reactive programming**: non-blocking, event-driven code using callbacks, Futures, or reactive streams (Project Reactor, RxJava). Reactive code can handle 10,000 concurrent requests with just tens of threads — but it requires restructuring your entire application around non-blocking APIs, fighting stack traces that span 30 operator chains, and losing the simplicity of straight-line code.

Virtual threads offer a third path: keep the simple, readable thread-per-request model, and let the JVM handle the rest.

---

## 7.2 What Are Virtual Threads?

A **virtual thread** is a lightweight thread managed by the JVM, not the OS. It's implemented as a continuation — a chunk of the call stack that can be suspended and resumed cheaply.

The JVM runs virtual threads on a pool of **carrier threads** (platform threads). By default, there is one carrier thread per CPU core. When a virtual thread blocks (on I/O, sleep, lock, etc.), the JVM *unmounts* it from its carrier thread — the carrier thread becomes free to run another virtual thread. When the blocking operation completes, the virtual thread is rescheduled and mounted on a carrier thread again.

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

The result: a single carrier thread can serve thousands of virtual threads, as long as most of them are spending time waiting.

---

## 7.3 Creating Virtual Threads

Virtual threads use the familiar `Thread` API:

```java
// Method 1: Thread.ofVirtual().start() — fire and forget
Thread vt = Thread.ofVirtual()
    .name("request-handler")
    .start(() -> processRequest(request));

// Method 2: Thread.ofVirtual().unstarted() — create, then start later
Thread unstarted = Thread.ofVirtual()
    .name("batch-worker-", 1)  // name prefix + sequential number
    .unstarted(() -> processBatch(batch));
unstarted.start();

// Method 3: Thread.startVirtualThread() — shorthand
Thread vt2 = Thread.startVirtualThread(() -> {
    System.out.println("Running in: " + Thread.currentThread());
    // Prints: Running in: VirtualThread[#42]/runnable@ForkJoinPool-1-worker-1
});

// Check if a thread is virtual
System.out.println(vt.isVirtual()); // true
System.out.println(Thread.currentThread().isVirtual()); // depends on context
```

### With ExecutorService

The most idiomatic usage — replacing fixed thread pools for I/O-bound work:

```java
// Old approach: fixed thread pool, limits concurrency
ExecutorService oldPool = Executors.newFixedThreadPool(200);

// New approach: one virtual thread per task, unlimited concurrency
ExecutorService virtualExecutor = Executors.newVirtualThreadPerTaskExecutor();

// The API is identical — just swap the executor
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futures = new ArrayList<>();

    for (String url : urls) {
        futures.add(executor.submit(() -> fetchUrl(url)));  // each gets its own VT
    }

    for (Future<String> f : futures) {
        System.out.println(f.get());
    }
}  // try-with-resources closes and awaits all tasks
```

---

## 7.4 Virtual Thread Lifecycle and Mounting/Unmounting

Virtual threads have the same states as platform threads (`NEW`, `RUNNABLE`, `WAITING`, `TIMED_WAITING`, `BLOCKED`, `TERMINATED`), but with an additional concept: **mounted vs. unmounted**.

A virtual thread is:
- **Mounted**: currently executing on a carrier thread
- **Unmounted**: suspended, its stack stored in heap memory, not occupying any carrier thread

Unmounting happens automatically when a virtual thread calls:
- Any blocking I/O operation (`InputStream.read()`, `OutputStream.write()`, `Socket.connect()`, etc.)
- `Thread.sleep()`
- `Object.wait()`
- Acquiring a `ReentrantLock` that is currently held by another thread
- Blocking on a `Future.get()`, `CompletableFuture.join()`, `Semaphore.acquire()`, etc.

```java
// Demonstration of unmounting
Thread.ofVirtual().start(() -> {
    System.out.println("Before sleep: " + Thread.currentThread()); // mounted
    Thread.sleep(1000);   // unmounts — carrier thread is free during this second
    System.out.println("After sleep: " + Thread.currentThread());  // remounted, possibly different carrier
});
```

---

## 7.5 Blocking I/O — Now Virtually Free

The most transformative consequence: **blocking I/O calls are cheap on virtual threads**. Code that previously required async/reactive rewrites can remain synchronous:

```java
// BEFORE: Complex async code to handle 1000 concurrent HTTP calls
// Using HttpClient async API to avoid blocking threads
List<CompletableFuture<String>> futures = urls.stream()
    .map(url -> httpClient.sendAsync(
        HttpRequest.newBuilder(URI.create(url)).build(),
        HttpResponse.BodyHandlers.ofString()
    ).thenApply(HttpResponse::body))
    .toList();
CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new)).join();
List<String> results = futures.stream().map(CompletableFuture::join).toList();

// AFTER: Simple synchronous code, same scalability
List<String> results;
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    results = urls.stream()
        .map(url -> executor.submit(() -> {
            // This blocking call is free — virtual thread unmounts during wait
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

### Database Query Example

```java
// Each virtual thread handles one request — blocking JDBC is fine
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<Order>> orderFutures = orderIds.stream()
        .map(id -> executor.submit(() -> {
            // These blocking JDBC calls are fine on virtual threads
            Order order = orderRepository.findById(id);  // blocks on network
            order = enrichWithCustomerData(order);        // blocks on network
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

## 7.6 Pinning: When Virtual Threads Can't Unmount

A virtual thread is **pinned** to its carrier and cannot unmount in two situations:

1. **Inside a `synchronized` block or method**
2. **Inside a native method call (JNI)**

When pinned, the virtual thread holds the carrier thread for the duration of the blocking operation — defeating the purpose of virtual threads.

```java
// PROBLEM: synchronized blocks pin virtual threads
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;  // fine — no blocking here
    }

    public synchronized int getAndReset() {
        Thread.sleep(100);  // PINNING: holds carrier thread for 100ms!
        int val = count;
        count = 0;
        return val;
    }
}

// SOLUTION: use ReentrantLock instead of synchronized
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
            Thread.sleep(100);  // NOT pinned — virtual thread can unmount
            int val = count;
            count = 0;
            return val;
        } finally {
            lock.unlock();
        }
    }
}
```

**Key advice**: In code that runs on virtual threads, prefer `java.util.concurrent.locks.ReentrantLock` over `synchronized`. In Java 24+, `synchronized` is being enhanced to not pin virtual threads (JEP 491).

Detect pinning with JFR:

```bash
java -XX:+FlightRecorder \
     -XX:StartFlightRecording=filename=recording.jfr \
     -Djdk.tracePinnedThreads=full \
     -jar myapp.jar
```

---

## 7.7 Thread Locals with Virtual Threads: Memory Concerns

Thread-local variables (`ThreadLocal<T>`) work with virtual threads, but there are memory implications. If you create millions of virtual threads and each inherits or creates thread-local values, you can consume significant heap memory.

```java
// Problem: expensive per-VT initialization
static final ThreadLocal<DatabaseConnection> DB_CONN =
    ThreadLocal.withInitial(() -> openDatabaseConnection());  // 1M connections?!

// Solution 1: Don't use ThreadLocal for expensive resources
// Use connection pools (HikariCP, etc.) that are shared across threads

// Solution 2: Use Scoped Values (Chapter 9) instead of ThreadLocal
// Scoped Values are read-only, inherited efficiently, GC'd when scope ends

// Solution 3: Pool per-thread state carefully
static final ThreadLocal<SimpleDateFormat> DATE_FORMAT =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
// This is low memory (1 SDF per VT) but wasteful if you have millions of VTs
// Better: use DateTimeFormatter (thread-safe, no ThreadLocal needed)
```

---

## 7.8 Migrating Spring Boot to Virtual Threads

Spring Boot 3.2+ makes virtual threads trivially easy to enable:

```yaml
# application.yml — single line to enable virtual threads
spring:
  threads:
    virtual:
      enabled: true
```

With this enabled, Spring Boot configures Tomcat (and Jetty, Undertow) to use virtual threads for request handling. Each HTTP request gets its own virtual thread — millions of concurrent requests with O(cores) carrier threads.

```java
// Spring MVC controller — blocking code is now scalable
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private CustomerService customerService;
    @Autowired private InventoryService inventoryService;

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable String id) {
        // These blocking calls are fine — request runs on a virtual thread
        Order order = orderService.findById(id);           // blocks on DB
        Customer customer = customerService.findById(order.customerId()); // blocks on DB
        boolean inStock = inventoryService.check(order.items());          // blocks on DB
        return new OrderResponse(order, customer, inStock);
    }
}
```

Without virtual threads, this handler blocks a platform thread during each DB call. With virtual threads, the carrier thread is free during each blocking call — the same code, dramatically higher throughput.

---

## 7.9 Virtual Threads vs Reactive Programming

| Aspect | Reactive (WebFlux, etc.) | Virtual Threads |
|--------|--------------------------|-----------------|
| Code style | Functional pipelines, `Mono<T>`/`Flux<T>` | Standard sequential code |
| Stack traces | Often cryptic, operator-chain noise | Normal, readable stack traces |
| Debuggability | Challenging | Standard debugger works |
| Blocking I/O | Forbidden (must use async variants) | Fine |
| CPU-bound work | No benefit | No benefit |
| Learning curve | High | None (existing code just works) |
| Backpressure | Built-in | Must implement explicitly |
| When to use | CPU-bound + I/O mixed workloads, streaming | I/O-bound workloads |

**Rule of thumb**: For new I/O-bound services, use virtual threads. For existing reactive code, don't rewrite unless you have a specific reason. For CPU-bound work, neither reactive nor virtual threads help — use parallel streams or ForkJoinPool.

---

## 7.10 Debugging Virtual Threads

Virtual threads appear in thread dumps with their own names and carrier thread information:

```
#119 "" virtual
      java.base/java.lang.VirtualThread$VThreadContinuation.onPinned(VirtualThread.java:183)
      java.base/jdk.internal.vm.Continuation.pin(Continuation.java:392)
      java.base/java.lang.VirtualThread.park(VirtualThread.java:595)
      ...
```

Use JFR for profiling:

```java
// Programmatic JFR recording
import jdk.jfr.Recording;
import jdk.jfr.consumer.RecordingFile;

try (Recording rec = new Recording()) {
    rec.enable("jdk.VirtualThreadStart");
    rec.enable("jdk.VirtualThreadEnd");
    rec.enable("jdk.VirtualThreadPinned");  // detect pinning events
    rec.start();

    // ... run your workload ...

    rec.stop();
    rec.dump(Path.of("vthread-recording.jfr"));
}
```

---

## 7.11 Common Pitfalls

### Don't pool virtual threads

```java
// WRONG: thread pools make no sense for virtual threads
// They're already lightweight — creating a bounded pool defeats the purpose
ExecutorService pool = new ThreadPoolExecutor(
    0, 1000, 60, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(),
    Thread.ofVirtual().factory()  // Using VT factory with a pool — pointless
);

// RIGHT: one virtual thread per task
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
```

### Don't use synchronized for long blocking sections

Already covered in Section 7.6 — prefer `ReentrantLock`.

### CPU-bound tasks still block carrier threads

Virtual threads don't help with CPU-bound work. A virtual thread performing heavy computation holds its carrier thread for the duration:

```java
// For CPU-bound tasks: use parallel streams or ForkJoinPool.commonPool()
// NOT virtual threads
List<Result> results = data.parallelStream()
    .map(this::heavyComputation)
    .toList();
```

---

## 7.12 Summary

Virtual threads are a paradigm shift without a paradigm change:

- **Write blocking code** — it scales automatically
- **Millions of concurrent tasks** on just a handful of carrier threads
- **No API changes** — same `Thread`, same `ExecutorService`, same `BlockingQueue`
- **Avoid `synchronized`** for long blocking sections — use `ReentrantLock`
- **Enable in Spring Boot 3.2+** with a single YAML property
- **Not a replacement for reactive** when backpressure control is needed
- **Not useful for CPU-bound work** — use parallel streams for that

Virtual threads represent the realization of Java's original promise: write simple, sequential code that runs correctly and scales. The decade-long detour through reactive programming was necessary given the OS thread constraints — but those constraints are now gone.
