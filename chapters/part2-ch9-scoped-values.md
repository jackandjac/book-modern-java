# Chapter 9: Scoped Values

Scoped values (JEP 446, preview in Java 21; finalized in Java 25 as JEP 506) provide a mechanism for sharing immutable data within a bounded scope — within a thread and into child threads. They address the memory and correctness problems of `ThreadLocal` while enabling safe data propagation in the virtual thread and structured concurrency world.

---

## 9.1 ThreadLocal: The Good, the Bad, and the Memory Leak

`ThreadLocal<T>` has been used for decades to propagate per-request context (user identity, transaction ID, security context, logging MDC) without threading it through every method parameter. But it has serious problems:

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

Problems with `ThreadLocal`:
1. **Memory leaks**: forgetting `.remove()` in thread pools causes indefinite retention
2. **Mutability**: any code can call `.set()` at any time — no immutability guarantee
3. **Virtual thread incompatibility**: with millions of virtual threads, millions of `ThreadLocal` copies exist
4. **Hidden coupling**: callers and callees share state invisibly — hard to reason about

---

## 9.2 What Are Scoped Values?

A `ScopedValue<T>` is an immutable binding: a value is associated with a `ScopedValue` key *for the duration of a specific lexical scope*, and then automatically released. The runtime handles cleanup — you cannot forget to call `.remove()`.

Key properties:
- **Immutable**: once bound in a scope, the value cannot be changed within that scope
- **Bounded lifetime**: the binding exists only within the `ScopedValue.where(...).run(...)` block
- **Inherited by child threads**: structured concurrency tasks automatically see parent scope bindings
- **Rebindable**: inner scopes can shadow with a different value (but the outer binding is unchanged)

---

## 9.3 ScopedValue API: where() and run()/call()

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

For code that returns a value, use `call()`:

```java
ScopedValue.where(RequestContext.CURRENT_USER, user)
           .where(RequestContext.REQUEST_ID, requestId)
           .call(() -> {
               return processOrder(orderId);  // returns a value
           });
```

---

## 9.4 Reading Scoped Values: get() and orElse()

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

## 9.5 Inheritance in Structured Concurrency

The key advantage over `ThreadLocal`: scoped values are **automatically inherited** by child threads in structured concurrency. No explicit passing required:

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

Contrast with `ThreadLocal`, where child threads do NOT inherit parent values (unless you use `InheritableThreadLocal`, which has its own set of problems).

---

## 9.6 Rebinding: Shadowing a Value in an Inner Scope

An inner scope can bind a different value to the same `ScopedValue` key. The outer binding is unchanged and restored when the inner scope exits:

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

This is especially useful for temporarily elevating log verbosity in a specific code path without affecting the rest of the request.

---

## 9.7 Scoped Values vs ThreadLocal: Direct Comparison

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

| Feature | `ThreadLocal` | `ScopedValue` |
|---------|---------------|---------------|
| Mutability | Mutable (`.set()` anywhere) | Immutable within a scope |
| Cleanup | Manual (`.remove()`) | Automatic |
| Memory with VTs | O(threads) copies — can be millions | O(scope depth) — bounded |
| Child thread inheritance | Not automatic | Automatic (structured concurrency) |
| JVM optimization | Limited | JVM can constant-fold |

---

## 9.8 Use Case: Per-Request Web Context

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

## 9.9 Combining Scoped Values with Structured Concurrency

This is the canonical usage pattern — bind context once, then fork multiple tasks that all see the same context:

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

## 9.10 Summary

Scoped values solve the per-context-data problem that `ThreadLocal` has struggled with for years:

- **Immutable bindings** prevent accidental mutation of shared context
- **Automatic cleanup** eliminates memory leaks
- **Virtual thread safe** — O(scope depth) memory, not O(thread count)
- **Structured concurrency inheritance** — child tasks see parent bindings automatically
- **Rebinding** allows controlled shadowing in inner scopes
- **Preview in Java 21**, finalized in Java 25 (Chapter 15)

Adopt scoped values over `ThreadLocal` for any new code that runs on virtual threads or uses structured concurrency. The programming model is cleaner, safer, and scales dramatically better.
