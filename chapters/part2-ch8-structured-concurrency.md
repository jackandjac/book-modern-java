# Chapter 8: Structured Concurrency

Structured concurrency (JEP 453, preview in Java 21; evolving through Java 25 Chapter 16) addresses a fundamental problem in concurrent programming: **task lifetime management**. When you split work across multiple threads, how do you ensure all spawned tasks complete (or fail cleanly) before you return from the enclosing scope? Without structured concurrency, concurrent code leaks threads, produces confusing error propagation, and is notoriously hard to cancel reliably.

---

## 8.1 The Problem with Unstructured Concurrency

Consider fetching order details that requires three parallel service calls:

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

Problems with this code:
1. If `orderFuture` throws, `customerFuture` and `shipmentFuture` continue running (thread leak)
2. If the calling thread is interrupted, the spawned tasks keep running
3. Error handling is complex — which exception propagates? Which future to cancel?
4. Thread dumps show tasks running but no structural relationship between them

---

## 8.2 The Structured Concurrency Paradigm

Structured concurrency applies the insight of structured programming (blocks have a single entry and exit, inner code is fully contained) to concurrency: **tasks spawned within a scope must complete before that scope exits**.

The analogy: just as `{ ... }` in Java guarantees that all code inside runs to completion before the next statement, a `StructuredTaskScope` guarantees that all forked tasks complete before the scope closes.

---

## 8.3 StructuredTaskScope: The Core API

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

The structure is:
1. Open a scope (`new StructuredTaskScope.ShutdownOnFailure()`)
2. Fork subtasks (each runs in a virtual thread)
3. `join()` — wait for the shutdown condition to be met
4. Handle results
5. Close the scope (try-with-resources) — ensures all tasks are done

---

## 8.4 ShutdownOnFailure — Fail-Fast Pattern

`ShutdownOnFailure` implements the most common policy: if **any** subtask fails, cancel all remaining subtasks and propagate the failure.

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

## 8.5 ShutdownOnSuccess — First-to-Win Pattern

`ShutdownOnSuccess` implements the "hedged request" or "race" pattern: fork multiple competing tasks, use the first one that succeeds, cancel the rest.

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

## 8.6 Error Handling and Exception Propagation

`Subtask` carries the result of a forked task, which can be in one of three states after `join()`:

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

Custom exception mapping:

```java
scope.join().throwIfFailed(cause -> {
    if (cause instanceof TimeoutException) {
        return new ServiceTimeoutException("Downstream service timed out", cause);
    }
    return new ServiceException("Downstream service failed", cause);
});
```

---

## 8.7 Nesting StructuredTaskScopes

Scopes can be nested — each child scope must complete before the parent scope continues:

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

## 8.8 Structured Concurrency and Observability

One of the underappreciated benefits of structured concurrency: **thread dumps clearly show the task hierarchy**. With unstructured `CompletableFuture`, a thread dump shows a flat list of threads with no indication of which tasks spawned which. With structured concurrency:

```
Thread[#77,<unnamed virtual>,5,main]
└── StructuredTaskScope$ShutdownOnFailure
    ├── Thread[#78,<unnamed virtual>,...] - orderService.find(orderId)
    ├── Thread[#79,<unnamed virtual>,...] - customerService.find(orderId)
    └── Thread[#80,<unnamed virtual>,...] - shipmentService.find(orderId)
```

The parent-child relationship is explicit in the thread dump — a massive improvement for debugging production incidents.

---

## 8.9 Cancellation and Timeout

Add a deadline to the entire scope:

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

## 8.10 Real-World Pattern: Parallel Enrichment Pipeline

A common microservice pattern: load a core entity, then enrich it with data from multiple services:

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

## 8.11 Structured Concurrency vs CompletableFuture vs Reactive

| Feature | StructuredTaskScope | CompletableFuture | Reactive (Reactor/RxJava) |
|---------|---------------------|-------------------|--------------------------|
| Task lifetime guarantee | Yes — scope enforces completion | No — tasks can outlive callers | Depends on subscription |
| Cancellation | Automatic on scope close | Manual | Automatic (dispose) |
| Error propagation | Explicit, clear | Complex chaining | Operator-based |
| Backpressure | No | No | Yes |
| Code style | Sequential/imperative | Functional chains | Functional pipelines |
| Debugging | Excellent (VT thread dumps) | Moderate | Difficult |
| When to use | Parallel I/O with defined result | Simple async tasks | Streaming data flows |

---

## 8.12 Summary

Structured concurrency brings the discipline of structured programming to concurrent code:

- **`ShutdownOnFailure`**: all-or-nothing parallel execution — the most common pattern
- **`ShutdownOnSuccess`**: hedged requests and racing — use the fastest result
- **Scope guarantees**: no task outlives its enclosing scope — no thread leaks
- **Works beautifully with virtual threads**: each `fork()` gets a lightweight virtual thread
- **Improved observability**: thread dumps show the task hierarchy
- **Preview in Java 21**, evolving toward final — use with `--enable-preview`

Structured concurrency is the companion to virtual threads: VTs provide the scale, structured concurrency provides the discipline. Together, they make concurrent code as straightforward to reason about as sequential code.
