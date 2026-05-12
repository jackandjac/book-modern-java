# Chapter 21: JVM and Runtime Improvements in Java 25

Java 25 delivers significant JVM-level improvements: Compact Object Headers reduce memory usage for all Java programs, Generational Shenandoah becomes a production-ready GC, the Vector API reaches its 10th incubation with near-final quality, JFR gains CPU-time profiling and method tracing capabilities, and Stable Values offer a new JVM-optimized lazily-initialized constant pattern.

---

## 21.1 Compact Object Headers (JEP 519 — Finalized Java 25)

Every Java object carries a **header** — JVM metadata stored before the object's fields. This header has traditionally been 96–128 bits (12–16 bytes) on 64-bit JVMs, comprising:
- A **mark word** (64 bits): GC state, identity hashcode, lock state
- A **class pointer** (32–64 bits): reference to the class metadata

JEP 519 reduces this to **64 bits** by compressing the class pointer into unused bits of the mark word. This requires 64-bit class pointer compression beyond what `-XX:+UseCompressedClassPointers` achieves.

### Enabling Compact Object Headers

```bash
# Opt-in flag (not default in Java 25)
java -XX:+UseCompactObjectHeaders -jar myapp.jar

# Combined with other GC and heap flags
java -XX:+UseZGC -XX:+ZGenerational \
     -XX:+UseCompactObjectHeaders \
     -Xmx8g \
     -jar myapp.jar
```

### Memory Savings

```java
// Measure header size savings with JOL (Java Object Layout)
// Add jol-core dependency to your project:
// <dependency>
//   <groupId>org.openjdk.jol</groupId>
//   <artifactId>jol-core</artifactId>
//   <version>0.17</version>
// </dependency>

import org.openjdk.jol.info.ClassLayout;
import org.openjdk.jol.vm.VM;

public class HeaderSizeDemo {
    record Point(double x, double y) {}

    public static void main(String[] args) {
        System.out.println(VM.current().details());
        System.out.println(ClassLayout.parseClass(Point.class).toPrintable());

        // Without compact headers: 16 bytes header + 16 bytes fields = 32 bytes
        // With compact headers: 8 bytes header + 16 bytes fields = 24 bytes
        // Savings: 25% per Point object
    }
}
```

### Real-World Impact

The savings are most significant for:
- Applications with large numbers of small objects (lots of small records, POJOs)
- Collections-heavy code (HashMap with many Entry objects)
- Streaming data pipelines with intermediate objects

Typical benchmarks show 10–20% heap reduction for object-heavy workloads, which translates directly to fewer GC pauses and better cache utilization.

### Compatibility

Compact Object Headers requires all live code to be compatible with the compressed class pointers scheme. Code that directly manipulates object headers (e.g., via `sun.misc.Unsafe.objectFieldOffset()`) may break. Well-behaved Java code — code that doesn't use internal JVM APIs — is unaffected.

---

## 21.2 Generational Shenandoah (Finalized Java 25)

Shenandoah GC has been available since Java 12 as a concurrent, low-pause collector. Java 25 finalizes the **Generational Shenandoah** mode introduced experimentally in Java 24.

### Shenandoah vs ZGC

Both target ultra-low pause times (<1ms). Their key differences:

| Feature | Shenandoah | ZGC (Generational) |
|---------|------------|-------------------|
| Approach | Brooks forwarding pointers | Load barriers |
| Concurrent compaction | Yes | Yes |
| Generational (Java 25) | Yes (finalized) | Yes (finalized in Java 21) |
| Best heap size | 1GB–256GB | 1GB–16TB |
| CPU overhead | Medium | Medium-High |
| Available on | Most platforms | Most platforms |

### Enabling Generational Shenandoah

```bash
# Java 25: enable Shenandoah with generational mode (now final)
java -XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational -jar myapp.jar

# Combined with heap sizing
java -XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational \
     -Xms4g -Xmx16g \
     -jar myapp.jar
```

### When to Choose Generational Shenandoah

Prefer Generational Shenandoah over non-generational Shenandoah when:
- Your application has high allocation rates (many short-lived objects)
- You need consistent low-latency across a medium-sized heap (4–128GB)
- You want lower CPU overhead than non-generational Shenandoah

---

## 21.3 Vector API (JEP 508 — 10th Incubator in Java 25)

The Vector API enables **SIMD (Single Instruction, Multiple Data)** operations from Java — executing the same operation on multiple data elements simultaneously using CPU vector units (SSE, AVX, NEON).

After 10 incubation rounds, the API is mature and production-quality despite the "incubator" label. It remains in incubation pending Project Valhalla value types, which will enable more efficient vector element representation.

### Basic SIMD Operations

```java
import jdk.incubator.vector.*;

public class VectorDemo {
    static final VectorSpecies<Float> FLOAT_SPECIES = FloatVector.SPECIES_256;
    // SPECIES_256 = 256-bit wide vectors = 8 floats per vector on AVX2

    // Scalar (traditional) float array sum
    static float scalarSum(float[] a) {
        float sum = 0;
        for (float v : a) sum += v;
        return sum;
    }

    // Vectorized float array sum — typically 4-8x faster
    static float vectorSum(float[] a) {
        int i = 0;
        float sum = 0;
        int bound = FLOAT_SPECIES.loopBound(a.length);

        // Process 8 elements at a time
        var sumVec = FloatVector.zero(FLOAT_SPECIES);
        for (; i < bound; i += FLOAT_SPECIES.length()) {
            var v = FloatVector.fromArray(FLOAT_SPECIES, a, i);
            sumVec = sumVec.add(v);
        }
        sum = sumVec.reduceLanes(VectorOperators.ADD);

        // Handle remaining elements (tail)
        for (; i < a.length; i++) {
            sum += a[i];
        }
        return sum;
    }
}
```

### Dot Product — Key ML Inference Operation

```java
// Dot product: sum of element-wise products
// Critical for neural network inference
static float dotProduct(float[] a, float[] b) {
    assert a.length == b.length;
    int i = 0;
    int bound = FLOAT_SPECIES.loopBound(a.length);
    var accum = FloatVector.zero(FLOAT_SPECIES);

    for (; i < bound; i += FLOAT_SPECIES.length()) {
        var va = FloatVector.fromArray(FLOAT_SPECIES, a, i);
        var vb = FloatVector.fromArray(FLOAT_SPECIES, b, i);
        accum = va.fma(vb, accum);   // fma = fused multiply-add: accum += va * vb
    }

    float result = accum.reduceLanes(VectorOperators.ADD);

    // Tail
    for (; i < a.length; i++) {
        result += a[i] * b[i];
    }
    return result;
}
```

### Element-Wise Operations

```java
// Apply ReLU activation function: max(0, x)
static float[] relu(float[] input) {
    float[] output = new float[input.length];
    var zero = FloatVector.zero(FLOAT_SPECIES);
    int i = 0;
    int bound = FLOAT_SPECIES.loopBound(input.length);

    for (; i < bound; i += FLOAT_SPECIES.length()) {
        var v = FloatVector.fromArray(FLOAT_SPECIES, input, i);
        v.max(zero).intoArray(output, i);
    }
    for (; i < input.length; i++) {
        output[i] = Math.max(0, input[i]);
    }
    return output;
}
```

### Using the Vector API in Your Build

```xml
<!-- Maven: add incubator module to compilation and runtime -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <compilerArgs>
            <arg>--add-modules=jdk.incubator.vector</arg>
        </compilerArgs>
    </configuration>
</plugin>
```

```bash
# Runtime
java --add-modules=jdk.incubator.vector -jar myapp.jar
```

---

## 21.4 JFR CPU-Time Profiling (JEP 509 — Experimental)

JDK Flight Recorder traditionally profiles using wall-clock time. JEP 509 adds **CPU-time profiling** on Linux — distinguishing time threads spend executing on CPU vs. time spent waiting.

```bash
# Enable CPU-time profiling (Linux only, experimental)
java -XX:StartFlightRecording=filename=profile.jfr,cpuTime=true \
     -jar myapp.jar

# After application runs, analyze with JDK Mission Control or jfr tool
jfr print --events jdk.ExecutionSample profile.jfr
```

CPU-time profiling is especially valuable for:
- Identifying methods that use a lot of CPU (vs. methods that are called frequently but are fast)
- Diagnosing unexpectedly high CPU usage in services
- Distinguishing CPU-bound vs. I/O-bound hot paths

---

## 21.5 JFR Method Timing and Tracing (JEP 520)

JEP 520 extends JFR with **method-level timing and tracing** via bytecode instrumentation — without requiring a Java agent:

```bash
# Instrument specific methods for timing via command line
java -XX:StartFlightRecording=filename=trace.jfr \
     -XX:FlightRecorderMethodSampleInterval=10ms \
     -jar myapp.jar
```

From code, you can annotate methods for JFR event generation:

```java
import jdk.jfr.Event;
import jdk.jfr.Label;
import jdk.jfr.Description;

@Label("Order Processing")
@Description("Tracks order processing latency")
class OrderProcessingEvent extends Event {
    @Label("Order ID")
    String orderId;

    @Label("Item Count")
    int itemCount;
}

public class OrderService {
    public Order processOrder(String orderId, List<OrderItem> items) {
        var event = new OrderProcessingEvent();
        event.begin();  // start timing
        event.orderId   = orderId;
        event.itemCount = items.size();

        try {
            return doProcessOrder(orderId, items);
        } finally {
            event.commit();  // end timing and record event
        }
    }
}
```

---

## 21.6 Stable Values (JEP 502 — Preview in Java 25)

`StableValue<T>` is a new JVM primitive for **lazily-initialized, effectively-final values**. The JVM can treat stable values as JIT constants once set — enabling aggressive constant-folding that isn't possible with plain `volatile` fields or `AtomicReference`.

```java
import java.lang.StableValue;

// Traditional lazy initialization: volatile + double-checked locking
private volatile ExpensiveSingleton instance;
public ExpensiveSingleton getInstance() {
    if (instance == null) {
        synchronized (this) {
            if (instance == null) {
                instance = new ExpensiveSingleton();
            }
        }
    }
    return instance;
}

// With StableValue: simpler and JVM-optimizable
private final StableValue<ExpensiveSingleton> stableInstance =
    StableValue.of();

public ExpensiveSingleton getInstance() {
    return stableInstance.orElseSet(ExpensiveSingleton::new);
}
```

### StableValue in Static Context

```java
// Per-class configuration — initialized once, read-only thereafter
public class AppConfig {
    private static final StableValue<DatabaseConfig> DB_CONFIG = StableValue.of();
    private static final StableValue<CacheConfig>    CACHE_CONFIG = StableValue.of();

    public static void initialize(Properties props) {
        DB_CONFIG.set(DatabaseConfig.from(props));
        CACHE_CONFIG.set(CacheConfig.from(props));
    }

    public static DatabaseConfig db() { return DB_CONFIG.get(); }
    public static CacheConfig cache() { return CACHE_CONFIG.get(); }
}
```

The JVM recognizes that after the first write, a `StableValue` acts as a constant — method calls that read the stable value can be inlined and optimized as if the value were a compile-time constant. This is the same optimization level as `static final` fields, but with deferred initialization.

---

## 21.7 Remove 32-bit x86 Port (JEP 526)

Java 25 removes all build support and code for 32-bit x86 (Windows and Linux). This affects only:
- Developers running OpenJDK on 32-bit Windows or Linux (essentially no one in production)
- Build configurations targeting 32-bit JVMs

All modern production systems run 64-bit JVMs. No action required for the vast majority of Java deployments.

---

## 21.8 Java 25 Complete JEP Summary

| JEP | Feature | Status | Category |
|-----|---------|--------|----------|
| 502 | Stable Values | Preview | Language/JVM |
| 505 | Structured Concurrency | 5th Preview | Concurrency |
| 506 | Scoped Values | **Final** | Concurrency |
| 507 | Primitive Types in Patterns | 3rd Preview | Language |
| 508 | Vector API | 10th Incubator | Performance |
| 509 | JFR CPU-Time Profiling | Experimental | Observability |
| 510 | Key Derivation Function API | **Final** | Security |
| 511 | Module Import Declarations | **Final** | Language |
| 512 | Compact Source Files & Instance Main Methods | **Final** | Language |
| 519 | Compact Object Headers | **Final** | JVM |
| 520 | JFR Method Timing and Tracing | **Final** | Observability |
| 470 | PEM Encodings | Preview | Security |
| 492 | Flexible Constructor Bodies | **Final** | Language |
| Gen-Shenandoah | Generational Shenandoah | **Final** | GC |
| 526 | Remove 32-bit x86 Port | Removal | Platform |

---

## 21.9 The Road Ahead: Java 26 and Beyond

Java 26 (March 2026) is already here. Key themes:

- **Project Valhalla preparations**: JEPs 500 (Null-Restricted Value Class Types) and 529 (Value Objects) are setting the foundation for value types — the most significant Java change since generics
- **Structured Concurrency**: continues toward finalization
- **String Templates**: redesigned API expected to preview again

**Project Valhalla** — the decade-long effort to introduce value types into Java — will deliver the ability to define classes whose instances behave like primitives: no identity, no nullability, inline in arrays and objects. This will eliminate wrapper type overhead (no more `Integer[]` boxing), enable dense array layouts, and unlock SIMD-friendly data structures.

---

## 21.10 Summary

Java 25 JVM improvements:

- **Compact Object Headers**: 25–30% header size reduction per object — opt-in with `-XX:+UseCompactObjectHeaders`
- **Generational Shenandoah**: low-latency GC with generational collection — finalized and production-ready
- **Vector API** (10th incubator): SIMD operations for HPC and ML inference workloads
- **JFR CPU-Time Profiling**: distinguish CPU-bound from I/O-bound hotspots
- **JFR Method Tracing**: instrument methods for production profiling without agents
- **Stable Values**: JVM-optimized lazy initialization — treat lazily-set values as JIT constants

Java 25 as an LTS release provides a stable, optimized foundation for the next several years of Java applications.
