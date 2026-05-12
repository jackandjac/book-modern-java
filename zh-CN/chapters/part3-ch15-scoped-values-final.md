# 第15章：作用域值（Scoped Values）— 正式定稿（JEP 506，Java 25）

作用域值（Scoped Values）在 Java 25 中完成了它的演进之旅：经过一轮孵化（Java 20）和四轮预览（Java 21–24），JEP 506 将该 API **正式定稿，与 Java 24 预览版相比没有任何变更**。这一稳定性意义重大——它意味着你可能已经在生产环境中使用的 Java 21 预览版本，可以在无需修改任何代码的情况下迁移到最终版本。

---

## 15.1 演进之路：从预览到正式定稿

| 版本 | JEP | 状态 |
|---------|-----|--------|
| Java 20 | JEP 429 | 孵化器（Incubator） |
| Java 21 | JEP 446 | 第1次预览 |
| Java 22 | JEP 464 | 第2次预览 |
| Java 23 | JEP 481 | 第3次预览 |
| Java 24 | JEP 487 | 第4次预览 |
| **Java 25** | **JEP 506** | **正式版（Final）** |

经过四轮预览，产生了一个稳定且被充分理解的 API。在 Java 25 中的正式定稿意味着不再需要 `--enable-preview`，该 API 已完全成为 `java.lang` 的一部分。

---

## 15.2 最终 API 参考

```java
// 核心类: java.lang.ScopedValue<T>
public final class ScopedValue<T> {
    // Factory
    public static <T> ScopedValue<T> newInstance();

    // Binding builder
    public static <T> Carrier where(ScopedValue<T> key, T value);

    // Reading
    public T get();                   // throws NoSuchElementException if not bound
    public Optional<T> orElse(T other); // returns other if not bound (wait — see below)
    public boolean isBound();

    // Carrier (binding builder) class
    public static final class Carrier {
        public <T> Carrier where(ScopedValue<T> key, T value);
        public void run(Runnable op);
        public <R> R call(Callable<R> op) throws Exception;
    }
}
```

关于 `orElse()` 有一个重要的 API 说明：该方法的实际签名为：
```java
public T orElse(T other);
```

如果作用域值在当前作用域中未绑定，则返回 `other` 而不是抛出异常。

---

## 15.3 不可变性保证与 JVM 优化

现在作用域值已正式定稿，JVM 可以应用更强的优化：

**常量折叠（Constant-folding）**：在绑定作用域内，JVM 将 `scopedValue.get()` 视为常量——它可以被内联到本机代码中，并在 JIT 优化的快速路径中使用。

**无易失性读取（No volatile reads）**：与需要内存屏障（Memory Barrier）的 `ThreadLocal` 不同，作用域值的读取是无锁的，在许多情况下其开销与读取局部变量一样低。

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

## 15.4 生产环境模式：框架集成

### Spring 风格的请求上下文

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

## 15.5 作用域值作为能力令牌（Capability Token）

作用域值可以承载类型化的能力令牌，用于控制对功能的访问：

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

## 15.6 作用域值与记录载体（Record Carriers）

使用记录（Record）作为类型化的上下文载体（Carrier），使作用域值具有自文档化特性：

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

## 15.7 测试使用作用域值的代码

测试依赖作用域值的代码非常简单，因为你可以完全控制绑定：

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

## 15.8 总结

在 Java 25 中正式定稿的作用域值（Scoped Values）提供了：

- **生产就绪**，无需 `--enable-preview`
- **不可变、作用域受限的上下文** —— 无需手动清理，虚拟线程（Virtual Threads）下不会发生内存泄漏
- **自动继承**结构化并发（Structured Concurrency）任务树中的值
- **JVM 优化的读取** —— 常量折叠和无锁访问
- **简洁的测试方式** —— 在测试中通过 `where(...).run(...)` 显式绑定上下文
- **从 Java 21 预览版零迁移成本** —— API 自第4次预览以来未做任何更改

对于任何需要按请求传播上下文的 Java 25+ 新代码，`ScopedValue` 就是最终答案。`ThreadLocal` 的时代已经结束。
