# 第8章：结构化并发

结构化并发（Structured Concurrency）（JEP 453，Java 21 中为预览特性；持续演进至 Java 25，参见第16章）解决了并发编程中的一个根本问题：**任务生命周期管理（task lifetime management）**。当你将工作拆分到多个线程时，如何确保所有派生的任务在离开外层作用域之前全部完成（或干净地失败）？没有结构化并发，并发代码会泄漏线程、产生令人困惑的错误传播，并且众所周知难以可靠地取消。

---

## 8.1 非结构化并发的问题

考虑获取订单详情时需要三个并行的服务调用：

```java
// BEFORE: unstructured concurrency with CompletableFuture
public OrderDetail getOrderDetail(String orderId) throws Exception {
    CompletableFuture<Order> orderFuture =
        CompletableFuture.supplyAsync(() -> orderService.find(orderId));
    CompletableFuture<Customer> customerFuture =
        CompletableFuture.supplyAsync(() -> customerService.find(orderId));
    CompletableFuture<List<Shipment>> shipmentFuture =
        CompletableFuture.supplyAsync(() -> shipmentService.find(orderId));

    Order order = orderFuture.get();         // what if this throws?
    Customer customer = customerFuture.get(); // customerFuture is still running!
    List<Shipment> shipments = shipmentFuture.get();

    return new OrderDetail(order, customer, shipments);
}
```

这段代码存在以下问题：
1. 如果 `orderFuture` 抛出异常，`customerFuture` 和 `shipmentFuture` 会继续运行（线程泄漏）
2. 如果调用线程被中断，派生的任务仍会继续运行
3. 错误处理很复杂——哪个异常会被传播？应该取消哪个 future？
4. 线程转储（thread dump）显示任务正在运行，但看不出它们之间的结构关系

---

## 8.2 结构化并发范式

结构化并发将结构化编程（Structured Programming）的理念（代码块具有单一入口和出口，内部代码完全被包含在块内）应用于并发编程：**在某个作用域内派生的任务必须在该作用域退出之前完成**。

可以做一个类比：正如 Java 中的 `{ ... }` 保证内部所有代码在执行下一条语句之前完成一样，`StructuredTaskScope` 保证所有派生的任务在作用域关闭之前完成。

---

## 8.3 StructuredTaskScope：核心 API

```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Subtask;

// Basic pattern: ShutdownOnFailure — if any task fails, cancel all
public OrderDetail getOrderDetail(String orderId) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

        // Fork subtasks — each runs in its own virtual thread
        Subtask<Order>          orderTask    = scope.fork(() -> orderService.find(orderId));
        Subtask<Customer>       customerTask = scope.fork(() -> customerService.find(orderId));
        Subtask<List<Shipment>> shipmentTask = scope.fork(() -> shipmentService.find(orderId));

        // Wait for all to complete (or for one to fail)
        scope.join()
             .throwIfFailed();  // re-throws the first failure, cancels all others

        // All tasks have completed successfully here
        return new OrderDetail(
            orderTask.get(),
            customerTask.get(),
            shipmentTask.get()
        );
    }
    // Scope closes: all forked tasks are guaranteed complete
}
```

其结构如下：
1. 打开一个作用域（`new StructuredTaskScope.ShutdownOnFailure()`）
2. 派生子任务（每个任务运行在一个虚拟线程中）
3. `join()` —— 等待关闭条件满足
4. 处理结果
5. 关闭作用域（try-with-resources）—— 确保所有任务已完成

---

## 8.4 ShutdownOnFailure —— 快速失败模式

`ShutdownOnFailure` 实现了最常见的策略：如果**任何**子任务失败，则取消所有剩余子任务并传播该失败。

```java
record FlightBooking(String flightId, String seatClass, BigDecimal price) {}
record HotelBooking(String hotelId, String roomType, BigDecimal pricePerNight) {}
record CarRental(String carId, String category, BigDecimal pricePerDay) {}

public TravelPackage bookTravel(TravelRequest request) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

        Subtask<FlightBooking> flightTask =
            scope.fork(() -> flightService.book(request.origin(),
                                                 request.destination(),
                                                 request.dates()));

        Subtask<HotelBooking> hotelTask =
            scope.fork(() -> hotelService.book(request.destination(),
                                                request.dates()));

        Subtask<CarRental> carTask =
            scope.fork(() -> carService.book(request.destination(),
                                              request.dates()));

        scope.join().throwIfFailed(e -> new BookingException("Travel booking failed", e));

        // If we reach here, all three bookings succeeded
        return new TravelPackage(flightTask.get(), hotelTask.get(), carTask.get());
    }
    // If any service threw an exception, all others are cancelled and
    // BookingException is thrown — no leaked background tasks
}
```

---

## 8.5 ShutdownOnSuccess —— 先到先赢模式

`ShutdownOnSuccess` 实现了"对冲请求（hedged request）"或"竞赛（race）"模式：派生多个相互竞争的任务，使用第一个成功的结果，取消其余任务。

```java
// Hedge a database read: query primary, then replica if primary is slow
public User findUserFast(String userId) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnSuccess<User>()) {

        scope.fork(() -> primaryDb.findUser(userId));    // try primary first
        scope.fork(() -> {
            Thread.sleep(50);                            // small delay before trying replica
            return replicaDb.findUser(userId);
        });

        scope.join();
        return scope.result();  // returns the first successful result
    }
}

// Load balancing: try multiple backends, use fastest response
public String callBackend(String request) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnSuccess<String>()) {
        for (String backend : backendUrls) {
            scope.fork(() -> httpClient.send(request, backend));
        }

        scope.join();
        return scope.result();  // whichever backend responded first
    }
}
```

---

## 8.6 错误处理与异常传播

`Subtask` 承载了派生任务的结果，在 `join()` 之后它可能处于三种状态之一：

```java
// Subtask.State enum:
// SUCCESS — completed normally
// FAILED  — completed with an exception
// UNAVAILABLE — cancelled (because scope shut down)

try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask<String> taskA = scope.fork(() -> serviceA.call());
    Subtask<String> taskB = scope.fork(() -> serviceB.call());
    Subtask<String> taskC = scope.fork(() -> serviceC.call());

    scope.join();  // Wait — does NOT throw yet

    // Inspect each task's state
    for (Subtask<String> task : List.of(taskA, taskB, taskC)) {
        switch (task.state()) {
            case SUCCESS     -> System.out.println("Result: " + task.get());
            case FAILED      -> System.out.println("Failed: " + task.exception());
            case UNAVAILABLE -> System.out.println("Was cancelled");
        }
    }

    scope.throwIfFailed();  // Now throw if any failed
}
```

自定义异常映射（Custom exception mapping）：

```java
scope.join().throwIfFailed(cause -> {
    if (cause instanceof TimeoutException) {
        return new ServiceTimeoutException("Downstream service timed out", cause);
    }
    return new ServiceException("Downstream service failed", cause);
});
```

---

## 8.7 嵌套 StructuredTaskScope

作用域可以嵌套——每个子作用域必须在父作用域继续之前完成：

```java
public DashboardData loadDashboard(String userId) throws Exception {
    try (var outerScope = new StructuredTaskScope.ShutdownOnFailure()) {

        // Task 1: load profile (simple)
        Subtask<UserProfile> profileTask =
            outerScope.fork(() -> profileService.load(userId));

        // Task 2: load analytics (which itself forks sub-tasks)
        Subtask<Analytics> analyticsTask = outerScope.fork(() -> {
            // Nested scope inside a forked task
            try (var innerScope = new StructuredTaskScope.ShutdownOnFailure()) {
                Subtask<OrderHistory> orders =
                    innerScope.fork(() -> orderService.history(userId));
                Subtask<SearchHistory> searches =
                    innerScope.fork(() -> searchService.history(userId));
                Subtask<WishList> wishlist =
                    innerScope.fork(() -> wishlistService.get(userId));

                innerScope.join().throwIfFailed();
                return new Analytics(orders.get(), searches.get(), wishlist.get());
            }
        });

        outerScope.join().throwIfFailed();

        return new DashboardData(profileTask.get(), analyticsTask.get());
    }
}
```

---

## 8.8 结构化并发与可观测性

结构化并发一个被低估的优势是：**线程转储能够清晰地展示任务层级结构**。使用非结构化的 `CompletableFuture` 时，线程转储只显示一个扁平的线程列表，无法看出哪些任务派生了哪些任务。而使用结构化并发时：

```
Thread[#77,<unnamed virtual>,5,main]
└── StructuredTaskScope$ShutdownOnFailure
    ├── Thread[#78,<unnamed virtual>,...] - orderService.find(orderId)
    ├── Thread[#79,<unnamed virtual>,...] - customerService.find(orderId)
    └── Thread[#80,<unnamed virtual>,...] - shipmentService.find(orderId)
```

父子关系在线程转储中是显式的——这对于调试生产环境的问题是一个巨大的改进。

---

## 8.9 取消与超时

为整个作用域添加截止时间（deadline）：

```java
public OrderDetail getOrderDetailWithTimeout(String orderId) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {

        Subtask<Order> orderTask     = scope.fork(() -> orderService.find(orderId));
        Subtask<Customer> custTask   = scope.fork(() -> customerService.find(orderId));

        // Deadline: give the whole operation 500ms
        scope.joinUntil(Instant.now().plusMillis(500));
        scope.throwIfFailed();

        // Check for timeout: if deadline passed, subtasks are in UNAVAILABLE state
        if (orderTask.state() == Subtask.State.UNAVAILABLE) {
            throw new TimeoutException("Order detail fetch timed out");
        }

        return new OrderDetail(orderTask.get(), custTask.get());
    }
}
```

---

## 8.10 实际应用模式：并行数据丰富管道

一种常见的微服务（microservice）模式：加载核心实体，然后从多个服务并行丰富其数据：

```java
public EnrichedProduct enrichProduct(String productId) throws Exception {
    // Step 1: load core product (sequential — subsequent calls depend on this)
    Product product = productRepository.findById(productId);

    // Step 2: enrich in parallel
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        Subtask<PricingInfo> pricingTask =
            scope.fork(() -> pricingService.getPricing(productId, product.category()));

        Subtask<InventoryStatus> inventoryTask =
            scope.fork(() -> inventoryService.getStatus(productId));

        Subtask<List<Review>> reviewsTask =
            scope.fork(() -> reviewService.getTopReviews(productId, 5));

        Subtask<List<String>> imagesTask =
            scope.fork(() -> mediaService.getImageUrls(productId));

        scope.join().throwIfFailed();

        return new EnrichedProduct(
            product,
            pricingTask.get(),
            inventoryTask.get(),
            reviewsTask.get(),
            imagesTask.get()
        );
    }
}
```

---

## 8.11 结构化并发 vs CompletableFuture vs 响应式编程

| 特性 | StructuredTaskScope | CompletableFuture | 响应式（Reactive）（Reactor/RxJava） |
|---------|---------------------|-------------------|--------------------------|
| 任务生命周期保证 | 是——作用域强制确保完成 | 否——任务可能比调用方存活更久 | 取决于订阅方式 |
| 取消 | 作用域关闭时自动取消 | 手动取消 | 自动取消（dispose） |
| 错误传播 | 显式且清晰 | 复杂的链式调用 | 基于操作符 |
| 背压（Backpressure） | 否 | 否 | 是 |
| 代码风格 | 顺序式/命令式 | 函数式链式调用 | 函数式管道 |
| 调试 | 优秀（虚拟线程转储） | 一般 | 困难 |
| 适用场景 | 有明确结果的并行 I/O | 简单的异步任务 | 流式数据处理 |

---

## 8.12 总结

结构化并发将结构化编程的纪律性引入并发代码：

- **`ShutdownOnFailure`**：全有或全无的并行执行——最常见的模式
- **`ShutdownOnSuccess`**：对冲请求和竞赛——使用最快的结果
- **作用域保证**：没有任何任务能存活超过其所在的作用域——不会发生线程泄漏
- **与虚拟线程完美配合**：每次 `fork()` 都会获得一个轻量级的虚拟线程（virtual thread）
- **改进的可观测性**：线程转储展示任务层级结构
- **Java 21 中为预览特性**，正在向正式版演进——使用时需添加 `--enable-preview`

结构化并发是虚拟线程的伴侣：虚拟线程提供了扩展能力，结构化并发提供了纪律性。二者结合，使得并发代码像顺序代码一样易于推理。
