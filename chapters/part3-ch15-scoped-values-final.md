# Chapter 15: Scoped Values — Finalized (JEP 506, Java 25)

Scoped Values complete their journey in Java 25: after one incubation round (Java 20) and four preview rounds (Java 21–24), JEP 506 finalizes the API **without changes from the Java 24 preview**. This stability is significant — it means the Java 21 preview version you may already be using in production will migrate to the final version with no code changes.

---

## 15.1 The Journey: From Preview to Final

| Release | JEP | Status |
|---------|-----|--------|
| Java 20 | JEP 429 | Incubator |
| Java 21 | JEP 446 | 1st Preview |
| Java 22 | JEP 464 | 2nd Preview |
| Java 23 | JEP 481 | 3rd Preview |
| Java 24 | JEP 487 | 4th Preview |
| **Java 25** | **JEP 506** | **Final** |

The four rounds of preview produced a stable, well-understood API. The finalization in Java 25 means `--enable-preview` is no longer required, and the API is now part of `java.lang` in full.

---

## 15.2 Final API Reference

```java
// Core class: java.lang.ScopedValue<T>
public final class ScopedValue<T> {
    // Factory
    public static <T> ScopedValue<T> newInstance();

    // Binding builder
    public static <T> Carrier where(ScopedValue<T> key, T value);

    // Reading
    public T get();              // throws NoSuchElementException if not bound
    public T orElse(T other);    // returns `other` if not bound (does NOT throw)
    public boolean isBound();

    // Carrier (binding builder) class
    public static final class Carrier {
        public <T> Carrier where(ScopedValue<T> key, T value);
        public void run(Runnable op);
        public <R> R call(Callable<R> op) throws Exception;
    }
}
```

---

## 15.3 Immutability Guarantees and JVM Optimizations

Now that scoped values are final, the JVM can apply stronger optimizations:

**Constant-folding**: Within a bounded scope, the JVM treats `scopedValue.get()` as a constant — it can be inlined into native code and used in JIT-optimized fast paths.

**No volatile reads**: Unlike `ThreadLocal` which requires memory barriers, scoped value reads are lock-free and optimized to be as cheap as reading a local variable in many cases.

```java
// The JVM can optimize this:
static final ScopedValue<RequestConfig> CONFIG = ScopedValue.newInstance();

void innerHotPath() {
    // This get() is effectively a constant within the scope — JIT can inline it
    RequestConfig cfg = CONFIG.get();
    // Use cfg in tight loop — cfg read is essentially free
    for (int i = 0; i < 1_000_000; i++) {
        process(cfg.timeout(), cfg.retries());
    }
}
```

---

## 15.4 Production Patterns: Framework Integration

### Spring-style Request Context

```java
public class RequestContextHolder {
    // Standard scoped values for web request context
    public static final ScopedValue<Principal> PRINCIPAL =
        ScopedValue.newInstance();
    public static final ScopedValue<String> REQUEST_ID =
        ScopedValue.newInstance();
    public static final ScopedValue<Span> TRACE_SPAN =
        ScopedValue.newInstance();
    public static final ScopedValue<String> TENANT_ID =
        ScopedValue.newInstance();

    /**
     * Execute the given operation with the specified request context.
     * All context values are automatically cleaned up when the operation completes.
     */
    public static <T> T withContext(RequestContext ctx, Callable<T> operation)
            throws Exception {
        return ScopedValue.where(PRINCIPAL,   ctx.principal())
                          .where(REQUEST_ID,  ctx.requestId())
                          .where(TRACE_SPAN,  ctx.span())
                          .where(TENANT_ID,   ctx.tenantId())
                          .call(operation);
    }
}

// Usage in a servlet filter:
public class ContextFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws Exception {
        RequestContext ctx = buildContext((HttpServletRequest) req);
        RequestContextHolder.withContext(ctx, () -> {
            chain.doFilter(req, resp);
            return null;
        });
    }
}

// Usage deep in the call stack — no parameter threading required:
@Repository
public class AuditRepository {
    public void save(String action) {
        String requestId = RequestContextHolder.REQUEST_ID.orElse("unknown");
        Principal principal = RequestContextHolder.PRINCIPAL.isBound()
            ? RequestContextHolder.PRINCIPAL.get()
            : null;
        // persist audit record...
    }
}
```

---

## 15.5 Scoped Value as a Capability Token

Scoped values can carry typed capabilities that gate access to features:

```java
public final class AdminCapability {
    // Private constructor — only grantable through the factory
    private AdminCapability() {}

    public static final ScopedValue<AdminCapability> GRANTED =
        ScopedValue.newInstance();

    public static <T> T withAdminAccess(Callable<T> operation) throws Exception {
        return ScopedValue.where(GRANTED, new AdminCapability()).call(operation);
    }

    public static boolean hasAdminAccess() {
        return GRANTED.isBound();
    }
}

// In a service:
public void deleteAccount(String accountId) {
    if (!AdminCapability.hasAdminAccess()) {
        throw new SecurityException("Admin capability required to delete account");
    }
    // proceed with deletion
}

// In a test or admin controller:
AdminCapability.withAdminAccess(() -> {
    userService.deleteAccount(testAccountId);
    return null;
});
```

---

## 15.6 Scoped Values with Record Carriers

Using records as typed context carriers makes scoped values self-documenting:

```java
// Rich request context as a record
record RequestContext(
    String requestId,
    String userId,
    String tenantId,
    Instant receivedAt,
    String clientIp
) {}

// Single scoped value carrying the whole context
public static final ScopedValue<RequestContext> REQUEST =
    ScopedValue.newInstance();

// In middleware:
RequestContext ctx = new RequestContext(
    UUID.randomUUID().toString(),
    extractUserId(httpRequest),
    extractTenantId(httpRequest),
    Instant.now(),
    httpRequest.getRemoteAddr()
);

ScopedValue.where(REQUEST, ctx).run(() -> handleRequest(httpRequest));

// In any downstream service:
void logAction(String action) {
    REQUEST.ifPresent(ctx ->    // hypothetical — use isBound() + get()
        auditLog.record(ctx.requestId(), ctx.userId(), action));
}

// Practical version:
void logActionV2(String action) {
    if (REQUEST.isBound()) {
        RequestContext ctx = REQUEST.get();
        auditLog.record(ctx.requestId(), ctx.userId(), action);
    }
}
```

---

## 15.7 Testing Code that Uses Scoped Values

Testing scoped-value-dependent code is straightforward since you control the binding:

```java
class OrderServiceTest {

    private static final RequestContext TEST_CONTEXT = new RequestContext(
        "test-req-001", "user-test", "tenant-abc", Instant.now(), "127.0.0.1"
    );

    @Test
    void shouldAuditOrderPlacement() throws Exception {
        // Arrange
        ScopedValue.where(RequestContextHolder.REQUEST, TEST_CONTEXT).run(() -> {
            // Act
            orderService.placeOrder(new PlaceOrderRequest("product-1", 2));

            // Assert — audit log should contain the request context
            verify(auditLog).record(
                eq("test-req-001"),
                eq("user-test"),
                contains("ORDER_PLACED")
            );
        });
    }

    @Test
    void shouldHandleUnboundScopedValue() {
        // Test code path where scoped value is NOT bound
        // (e.g., batch processing job without HTTP context)
        assertDoesNotThrow(() -> orderService.processBackgroundJob("job-1"));
        // Verify graceful handling when REQUEST is not bound
    }
}
```

---

## 15.8 Summary

Scoped Values finalized in Java 25 provide:

- **Production-ready**, no `--enable-preview` required
- **Immutable, scope-bounded context** — no manual cleanup, no memory leaks with virtual threads
- **Automatic inheritance** in structured concurrency task trees
- **JVM-optimized reads** — constant-folding and lock-free access
- **Clean testing** — bind context explicitly in tests with `where(...).run(...)`
- **Zero migration** from Java 21 preview — API unchanged from 4th preview

For any new Java 25+ code that needs per-request context propagation, `ScopedValue` is the definitive answer. The `ThreadLocal` era is over.
