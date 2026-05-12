# 第9章：作用域值（Scoped Values）

作用域值（Scoped Values，JEP 446，在 Java 21 中作为预览功能；在 Java 25 中通过 JEP 506 正式发布）提供了一种在有限作用域内共享不可变数据的机制——既可以在线程内部使用，也可以传递到子线程中。它们解决了 `ThreadLocal` 存在的内存和正确性问题，同时在虚拟线程（Virtual Thread）和结构化并发（Structured Concurrency）的世界中实现了安全的数据传播。

---

## 9.1 ThreadLocal：优点、缺点与内存泄漏

`ThreadLocal<T>` 数十年来一直被用于传播每个请求的上下文信息（用户身份、事务 ID、安全上下文、日志 MDC），而无需将其作为参数逐层传递。但它存在严重的问题：

```java
// Classic ThreadLocal usage: per-request user context
public class RequestContext {
    private static final ThreadLocal<User> CURRENT_USER = new ThreadLocal<>();

    public static void setUser(User user) { CURRENT_USER.set(user); }
    public static User getUser()          { return CURRENT_USER.get(); }
    public static void clear()            { CURRENT_USER.remove(); }
}

// Filter sets context at start of request
public class AuthFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
        User user = authenticate(req);
        RequestContext.setUser(user);
        try {
            chain.doFilter(req, res);
        } finally {
            RequestContext.clear();  // CRITICAL: forget this and you leak memory
        }
    }
}
```

`ThreadLocal` 的问题：
1. **内存泄漏**：在线程池中忘记调用 `.remove()` 会导致对象被无限期持有
2. **可变性**：任何代码都可以在任何时候调用 `.set()`——无法保证不可变性
3. **与虚拟线程不兼容**：当存在数百万个虚拟线程时，就会有数百万个 `ThreadLocal` 副本
4. **隐式耦合**：调用者和被调用者之间隐式共享状态——难以推理

---

## 9.2 什么是作用域值？

`ScopedValue<T>` 是一种不可变绑定（Immutable Binding）：一个值与一个 `ScopedValue` 键在*特定词法作用域的持续期间*相关联，然后自动释放。运行时负责清理——你不可能忘记调用 `.remove()`。

关键属性：
- **不可变**：一旦在某个作用域中绑定，该值在该作用域内不可更改
- **有限生命周期**：绑定仅存在于 `ScopedValue.where(...).run(...)` 代码块内
- **子线程继承**：结构化并发任务自动继承父作用域的绑定
- **可重新绑定**：内部作用域可以用不同的值进行遮蔽（但外部绑定不受影响）

---

## 9.3 ScopedValue API：where() 与 run()/call()

```java
import java.lang.ScopedValue;

// Declare a ScopedValue key — typically a public static final
public class RequestContext {
    public static final ScopedValue<User>   CURRENT_USER   = ScopedValue.newInstance();
    public static final ScopedValue<String> REQUEST_ID     = ScopedValue.newInstance();
    public static final ScopedValue<String> TRANSACTION_ID = ScopedValue.newInstance();
}

// Bind and use:
User authenticatedUser = authenticate(request);
String requestId = generateRequestId();

ScopedValue.where(RequestContext.CURRENT_USER, authenticatedUser)
           .where(RequestContext.REQUEST_ID,   requestId)
           .run(() -> {
               // Within this scope, CURRENT_USER and REQUEST_ID are bound
               handleRequest(request);
           });
// After run() returns, bindings are gone — no cleanup needed
```

对于需要返回值的代码，使用 `call()`：

```java
ScopedValue.where(RequestContext.CURRENT_USER, user)
           .where(RequestContext.REQUEST_ID, requestId)
           .call(() -> {
               return processOrder(orderId);  // returns a value
           });
```

---

## 9.4 读取作用域值：get() 与 orElse()

```java
// In any code called within the scope (no matter how deeply nested):
public void auditLog(String action) {
    User user      = RequestContext.CURRENT_USER.get();    // throws if not bound
    String reqId   = RequestContext.REQUEST_ID.orElse("unknown"); // safe fallback

    System.out.printf("[%s] User %s performed: %s%n", reqId, user.name(), action);
}

// Check if bound before reading:
if (RequestContext.CURRENT_USER.isBound()) {
    User user = RequestContext.CURRENT_USER.get();
    // ...
}
```

---

## 9.5 结构化并发中的继承

相比 `ThreadLocal` 的关键优势在于：作用域值会被结构化并发中的子线程**自动继承**。无需显式传递：

```java
public static final ScopedValue<String> TENANT_ID = ScopedValue.newInstance();

public TenantData loadTenantData(String tenantId) throws Exception {
    return ScopedValue.where(TENANT_ID, tenantId).call(() -> {
        // TENANT_ID is bound here

        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            // Each forked virtual thread AUTOMATICALLY inherits TENANT_ID binding
            Subtask<Config>       configTask = scope.fork(() -> loadConfig());     // sees TENANT_ID
            Subtask<List<User>>   usersTask  = scope.fork(() -> loadUsers());      // sees TENANT_ID
            Subtask<BillingInfo>  billingTask = scope.fork(() -> loadBilling());   // sees TENANT_ID

            scope.join().throwIfFailed();

            return new TenantData(configTask.get(), usersTask.get(), billingTask.get());
        }
    });
}

// Callee doesn't need the tenantId parameter — it reads it from the scope
private Config loadConfig() {
    String tenant = TENANT_ID.get();  // inherited from parent scope
    return configRepository.findByTenant(tenant);
}
```

与 `ThreadLocal` 不同的是，子线程不会自动继承父线程的值（除非使用 `InheritableThreadLocal`，但它有自己的一系列问题）。

---

## 9.6 重新绑定：在内部作用域中遮蔽值

内部作用域可以将不同的值绑定到同一个 `ScopedValue` 键。外部绑定不会改变，并在内部作用域退出时恢复：

```java
public static final ScopedValue<String> LOG_LEVEL = ScopedValue.newInstance();

public void processRequest() {
    ScopedValue.where(LOG_LEVEL, "INFO").run(() -> {
        // LOG_LEVEL = "INFO" here

        System.out.println(LOG_LEVEL.get()); // INFO

        ScopedValue.where(LOG_LEVEL, "DEBUG").run(() -> {
            // LOG_LEVEL = "DEBUG" here (shadowing)
            System.out.println(LOG_LEVEL.get()); // DEBUG
            doDetailedProcessing();
        });

        // LOG_LEVEL = "INFO" again — outer binding restored
        System.out.println(LOG_LEVEL.get()); // INFO
    });
}
```

这在需要临时提升特定代码路径的日志详细程度、同时不影响请求其余部分时特别有用。

---

## 9.7 作用域值与 ThreadLocal：直接对比

```java
// ThreadLocal approach — mutable, leak-prone
static final ThreadLocal<User> TL_USER = new ThreadLocal<>();

void handleRequest(User user) {
    TL_USER.set(user);
    try {
        process();
    } finally {
        TL_USER.remove(); // must not forget
    }
}

void process() {
    User u = TL_USER.get(); // mutable — could have been changed by someone else
}

// ----

// ScopedValue approach — immutable, automatic cleanup
static final ScopedValue<User> SV_USER = ScopedValue.newInstance();

void handleRequest(User user) {
    ScopedValue.where(SV_USER, user).run(() -> process()); // cleanup is automatic
}

void process() {
    User u = SV_USER.get(); // immutable — guaranteed to be exactly what was bound
}
```

| 特性 | `ThreadLocal` | `ScopedValue` |
|---------|---------------|---------------|
| 可变性 | 可变（任何位置均可调用 `.set()`） | 在作用域内不可变 |
| 清理 | 手动（`.remove()`） | 自动 |
| 虚拟线程下的内存开销 | O(线程数) 份副本——可达数百万 | O(作用域深度)——有界 |
| 子线程继承 | 不自动 | 自动（结构化并发） |
| JVM 优化 | 有限 | JVM 可进行常量折叠（Constant Folding） |

---

## 9.8 用例：每请求 Web 上下文

```java
public class WebContext {
    public static final ScopedValue<User>       USER         = ScopedValue.newInstance();
    public static final ScopedValue<String>     REQUEST_ID   = ScopedValue.newInstance();
    public static final ScopedValue<HttpRequest> HTTP_REQUEST = ScopedValue.newInstance();
}

// Framework/filter layer (e.g., a custom Servlet filter):
@Component
public class ContextPropagationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws Exception {
        User user = authService.resolveUser(request);
        String requestId = UUID.randomUUID().toString();

        ScopedValue.where(WebContext.USER,       user)
                   .where(WebContext.REQUEST_ID, requestId)
                   .run(() -> chain.doFilter(request, response));
    }
}

// Deep in the call stack — no parameters needed
@Service
public class AuditService {
    public void log(String event) {
        User user      = WebContext.USER.get();
        String reqId   = WebContext.REQUEST_ID.get();
        auditRepository.save(new AuditEntry(reqId, user.id(), event, Instant.now()));
    }
}
```

---

## 9.9 将作用域值与结构化并发结合使用

这是最典型的使用模式——绑定一次上下文，然后派生多个任务，所有任务都能看到相同的上下文：

```java
public static final ScopedValue<TraceContext> TRACE = ScopedValue.newInstance();

public OrderSummary processOrderBatch(List<String> orderIds, TraceContext trace)
        throws Exception {
    return ScopedValue.where(TRACE, trace).call(() -> {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            // All tasks inherit TRACE binding automatically
            List<Subtask<Order>> tasks = orderIds.stream()
                .map(id -> scope.fork(() -> {
                    TRACE.get().span("process-order-" + id); // visible in each task
                    return orderService.process(id);
                }))
                .toList();

            scope.join().throwIfFailed();

            List<Order> orders = tasks.stream()
                .map(Subtask::get)
                .toList();
            return new OrderSummary(orders);
        }
    });
}
```

---

## 9.10 总结

作用域值解决了 `ThreadLocal` 多年来一直困扰的上下文数据传递问题：

- **不可变绑定**防止了共享上下文的意外修改
- **自动清理**消除了内存泄漏
- **虚拟线程安全**——内存开销为 O(作用域深度)，而非 O(线程数)
- **结构化并发继承**——子任务自动继承父绑定
- **重新绑定**允许在内部作用域中进行受控的遮蔽
- **Java 21 中为预览功能**，在 Java 25 中正式发布（第15章）

对于任何在虚拟线程上运行或使用结构化并发的新代码，都应优先采用作用域值而非 `ThreadLocal`。这种编程模型更清晰、更安全，且扩展性大幅提升。
