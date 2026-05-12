# Chapter 6: Other Java 17 Features — Pseudorandom Generators, Strong Encapsulation, and Deprecations

Java 17 delivered more than the headline language features of records, sealed classes, and pattern matching. This chapter covers the important but less-publicized improvements: a comprehensive rework of the random number API, the finalization of strong JDK encapsulation, floating-point consistency, enhanced deserialization security, and a set of deprecations and removals every engineer must understand before migrating.

---

## 6.1 Enhanced Pseudo-Random Number Generators (JEP 356)

The pre-Java-17 random number landscape was fragmented and inconsistent. You had `java.util.Random`, `java.util.concurrent.ThreadLocalRandom`, `java.util.SplittableRandom`, and `java.security.SecureRandom` — four classes with overlapping but incompatible APIs, no common interface, and no way to write generic code over them.

JEP 356 restructured this entirely around a new **`RandomGenerator` interface hierarchy**.

### The New Interface Hierarchy

```
RandomGenerator
├── StreamableGenerator      — can produce streams of generators
│   ├── SplittableGenerator  — split() creates independent child generators
│   ├── JumpableGenerator    — jump() advances state by large steps
│   └── LeapableGenerator    — leap() advances by very large steps
└── (all new algorithm classes implement RandomGenerator directly)
```

### The RandomGenerator Interface

```java
import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

// Write algorithm-agnostic code against the interface
public class MonteCarloSimulation {
    private final RandomGenerator rng;

    public MonteCarloSimulation(RandomGenerator rng) {
        this.rng = rng;
    }

    public double estimatePi(int samples) {
        long inside = 0;
        for (int i = 0; i < samples; i++) {
            double x = rng.nextDouble();
            double y = rng.nextDouble();
            if (x * x + y * y <= 1.0) inside++;
        }
        return 4.0 * inside / samples;
    }
}
```

### Using the Factory to Select Algorithms

```java
import java.util.random.RandomGeneratorFactory;

// List all available algorithms
RandomGeneratorFactory.all()
    .sorted(Comparator.comparing(RandomGeneratorFactory::name))
    .forEach(f -> System.out.printf("%-30s stateBits=%-5d isJumpable=%-5b isSplittable=%b%n",
        f.name(), f.stateBits(), f.isJumpable(), f.isSplittable()));

// Create by algorithm name
RandomGenerator xoshiro = RandomGeneratorFactory.of("Xoshiro256PlusPlus").create();
RandomGenerator lxm     = RandomGeneratorFactory.of("L64X256MixRandom").create();
RandomGenerator legacy  = RandomGeneratorFactory.of("Random").create();

// Create with a specific seed for reproducibility
RandomGenerator seeded = RandomGeneratorFactory.of("Xoshiro256PlusPlus").create(42L);
```

### LXM Generators — The New Default Quality Choice

LXM generators (L64X128MixRandom, L64X256MixRandom, L128X256MixRandom, etc.) combine a linear congruential generator (LCG) with an XBG generator (XorShift-based) and a mix function. They provide excellent statistical quality and are the recommended choice for simulations, games, and any non-cryptographic use:

```java
import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

RandomGenerator rng = RandomGeneratorFactory.of("L64X256MixRandom").create();

// All the familiar operations, plus new ones
int    roll  = rng.nextInt(1, 7);     // [1, 6] inclusive — much cleaner than nextInt(6)+1
double prob  = rng.nextDouble(0, 1);  // [0.0, 1.0)
long   token = rng.nextLong();

// New: exponential and Gaussian distributions built in
double exp   = rng.nextExponential();   // mean = 1
double gauss = rng.nextGaussian(5, 2);  // mean=5, stddev=2 (Java 17+)
```

### SplittableGenerator for Parallel Streams

`SplittableGenerator` is the key to safe parallel random number generation. Each `split()` creates a completely independent generator, guaranteed to produce statistically independent sequences:

```java
import java.util.random.RandomGenerator.SplittableGenerator;
import java.util.random.RandomGeneratorFactory;

SplittableGenerator splittable =
    (SplittableGenerator) RandomGeneratorFactory.of("L64X256MixRandom").create(12345L);

// Parallel Monte Carlo: each thread gets its own independent generator
double pi = splittable.splits(8)         // 8 independent generators
    .parallel()
    .mapToDouble(gen -> {
        long inside = 0;
        for (int i = 0; i < 1_000_000; i++) {
            double x = gen.nextDouble();
            double y = gen.nextDouble();
            if (x * x + y * y <= 1.0) inside++;
        }
        return (double) inside / 1_000_000;
    })
    .average()
    .orElseThrow() * 4.0;

System.out.printf("π ≈ %.6f%n", pi);
```

### JumpableGenerator for Independent Sequences

```java
import java.util.random.RandomGenerator.JumpableGenerator;

JumpableGenerator jumpable =
    (JumpableGenerator) RandomGeneratorFactory.of("Xoshiro256PlusPlus").create();

// Each jump() creates a copy advanced by 2^128 steps — guaranteed non-overlapping
JumpableGenerator thread1Gen = jumpable;
JumpableGenerator thread2Gen = (JumpableGenerator) jumpable.jump();
JumpableGenerator thread3Gen = (JumpableGenerator) jumpable.jump();
// thread1Gen, thread2Gen, thread3Gen produce sequences that will never overlap
// (each sequence is 2^128 values long, more than sufficient for any simulation)
```

### Practical Migration

```java
// Old code — use anywhere the old API was used
Random old = new Random(seed);
int n = old.nextInt(100);

// New code — interface-based, algorithm-flexible
RandomGenerator rng = RandomGeneratorFactory.of("L64X256MixRandom").create(seed);
int n2 = rng.nextInt(100);  // same semantics, much better statistical properties

// For thread safety (was ThreadLocalRandom):
// ThreadLocalRandom is still fine for single-thread-at-a-time use cases
// For parallel, prefer SplittableGenerator splits()
```

---

## 6.2 Strong Encapsulation of JDK Internals (JEP 403)

JEP 403 is arguably the most disruptive change in Java 17 for existing codebases. It finalizes the encapsulation of JDK internal APIs that began in Java 9 with the module system.

### What Changed

Before Java 17, the `--illegal-access` flag allowed reflective access to JDK internals. In Java 16, `--illegal-access=deny` became the default but could still be overridden. In Java 17, **`--illegal-access` is completely removed**. Attempting to reflective-access a JDK internal API now throws `InaccessibleObjectException` unconditionally.

Common breakage points:

```java
// This worked before Java 17 with --illegal-access=permit:
// sun.misc.Unsafe, com.sun.xml.internal.*, sun.reflect.*, etc.

// These were widely used by:
// - Libraries doing low-level memory manipulation (Unsafe)
// - Serialization frameworks (Kryo, FST)
// - Mocking frameworks (Mockito, early versions)
// - Dependency injection containers (old Spring/Guice versions)
// - Some XML/JSON parsers
```

### The Migration Bridge: `--add-opens` and `--add-exports`

If you're migrating a codebase that depends on internal APIs you cannot yet eliminate, use these JVM flags:

```bash
# --add-opens: allows deep reflective access to a package
java --add-opens java.base/java.lang=ALL-UNNAMED \
     --add-opens java.base/java.util=ALL-UNNAMED \
     --add-opens java.base/sun.nio.ch=ALL-UNNAMED \
     -jar myapp.jar

# --add-exports: makes a package's public API visible (for compile-time)
javac --add-exports java.base/sun.security.util=ALL-UNNAMED MyClass.java
```

In Maven:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.2.5</version>
    <configuration>
        <argLine>
            --add-opens java.base/java.lang=ALL-UNNAMED
            --add-opens java.base/java.util=ALL-UNNAMED
        </argLine>
    </configuration>
</plugin>
```

### Long-Term Strategy

`--add-opens` is a **migration bridge, not a permanent solution**. The proper resolution is:

1. Identify which library is triggering the access (look at the stack trace)
2. Update the library — most major libraries (Spring, Hibernate, Mockito, Jackson) have Java 17-compatible versions
3. If you own the code, migrate away from internal APIs:
   - `sun.misc.Unsafe` → `java.lang.foreign.MemorySegment` (Project Panama, Chapter 13)
   - Internal reflection hacks → `java.lang.invoke.MethodHandles`
   - `sun.security.*` → standard `javax.crypto` / `java.security` APIs

---

## 6.3 Restore Always-Strict Floating-Point Semantics (JEP 306)

This change is primarily of historical interest but worth understanding.

### Background

In Java 1.1, a `strictfp` modifier was introduced to ensure portable, deterministic floating-point behavior across platforms. Without `strictfp`, the JVM was allowed to use extended 80-bit precision on x87 FPUs, potentially producing different results on different hardware.

With modern x64 and ARM hardware always using IEEE 754-2019 64-bit operations (the JVM no longer needs to special-case x87), the distinction between `strictfp` and non-`strictfp` became meaningless. **Java 17 restores always-strict semantics** — all floating-point operations are now always `strictfp`-equivalent.

### Impact

```java
// strictfp is now a no-op (but not an error — it's still valid syntax, just redundant)
public strictfp class LegacyFinancialCalculator {
    public strictfp double compute(double a, double b) {
        return a * b; // always strict now regardless of modifier
    }
}

// Going forward, simply omit strictfp
public class FinancialCalculator {
    public double compute(double a, double b) {
        return a * b; // same behavior as strictfp, no modifier needed
    }
}
```

The practical impact: **no code changes required**. Existing `strictfp` annotations are harmless. New code should simply not use `strictfp`.

---

## 6.4 Context-Specific Deserialization Filters (JEP 415)

Java deserialization is a well-known attack surface. JEP 415 builds on the JVM-wide deserialization filter (`-Djdk.serialFilter`) introduced in Java 9 to add a **dynamic, context-aware filter factory** — a JVM-wide callback invoked for every `ObjectInputStream`, allowing you to choose the filter based on context.

### The Problem JEP 415 Solves

A static JVM-wide filter is too coarse for complex applications. A web framework might need different deserialization rules for user-provided data vs. internal cluster messages. JEP 415 lets you install a `BinaryOperator<ObjectInputFilter>` as the filter factory:

```java
import java.io.ObjectInputFilter;

public class SecureDeserializationSetup {

    public static void install() {
        ObjectInputFilter.Config.setSerialFilterFactory(
            SecureDeserializationSetup::buildFilter);
    }

    private static ObjectInputFilter buildFilter(
            ObjectInputFilter currentFilter,
            ObjectInputFilter nextFilter) {

        // Compose the current stream filter with our policy
        ObjectInputFilter policyFilter = ObjectInputFilter.Config.createFilter(
            // Allowlist: only permit these classes
            "com.myapp.model.*;java.util.*;java.lang.*;!*"
        );

        // Chain: our policy runs first, then any stream-specific filter
        return ObjectInputFilter.merge(policyFilter, nextFilter);
    }
}

// Install once at application startup:
// SecureDeserializationSetup.install();
```

### Building a Practical Filter

```java
import java.io.*;

public class ApplicationFilterFactory {

    // Different rules for different contexts
    enum DeserializationContext {
        USER_INPUT,      // strict — minimal allowed classes
        INTERNAL_CACHE,  // moderate — known internal classes
        CLUSTER_MESSAGE  // lenient — our own serialized cluster state
    }

    // Thread-local or parameter-based context injection
    private static final ThreadLocal<DeserializationContext> CONTEXT =
        ThreadLocal.withInitial(() -> DeserializationContext.USER_INPUT);

    public static void setContext(DeserializationContext ctx) {
        CONTEXT.set(ctx);
    }

    public static ObjectInputFilter buildContextFilter(
            ObjectInputFilter current, ObjectInputFilter next) {

        String pattern = switch (CONTEXT.get()) {
            case USER_INPUT     -> "java.lang.*;java.util.ArrayList;maxdepth=5;maxarray=1000;!*";
            case INTERNAL_CACHE -> "com.myapp.**;java.util.*;java.lang.*;maxdepth=10;!*";
            case CLUSTER_MESSAGE -> "com.myapp.cluster.**;java.util.*;java.lang.*;!*";
        };

        ObjectInputFilter contextFilter = ObjectInputFilter.Config.createFilter(pattern);
        return ObjectInputFilter.merge(contextFilter, next);
    }

    // Usage:
    public static <T> T deserialize(byte[] data, DeserializationContext context)
            throws IOException, ClassNotFoundException {
        setContext(context);
        try (var ois = new ObjectInputStream(new ByteArrayInputStream(data))) {
            @SuppressWarnings("unchecked")
            T result = (T) ois.readObject();
            return result;
        }
    }
}
```

---

## 6.5 Deprecations and Removals

### Removed: Applet API (JEP 398)

The `java.applet` package and related browser plugin infrastructure are formally deprecated for removal. Applets have been effectively dead since browser vendors dropped NPAPI plugin support. Any code using `java.applet.Applet`, `java.applet.AppletContext`, etc., must be rewritten.

### Removed: RMI Activation (JEP 407)

`java.rmi.activation` — the subsystem for activating dormant RMI servers — is removed. Standard RMI (`java.rmi`) remains available. If you use RMI Activation, you must migrate to on-demand activation via regular RMI stubs or replace with a modern IPC mechanism (gRPC, REST, messaging).

### Removed: Experimental AOT and JIT Compiler (JEP 410)

The experimental Java-based Ahead-of-Time compiler (`jaotc`) and the Graal JIT compiler (as an alternative JVM JIT) were removed. The reason: maintenance cost outweighed adoption. GraalVM remains available as a separate distribution (GraalVM CE/EE), it's just no longer bundled with OpenJDK.

```bash
# Before Java 17: this might work on some JDKs
# jaotc --output libHelloWorld.so HelloWorld.class

# After Java 17: jaotc is gone from the standard JDK
# For native image: use GraalVM separately
# native-image -jar myapp.jar
```

### Deprecated: Security Manager (JEP 411)

The Security Manager — Java's original sandboxing mechanism — is deprecated for removal. It has been fundamentally broken as a security tool for years (most JVM security researchers ignore it), and its presence adds complexity without security benefit.

```java
// This still works in Java 17 but prints a deprecation warning:
System.setSecurityManager(new SecurityManager());

// The warning:
// WARNING: A terminally deprecated method in java.lang.System has been called
// WARNING: System::setSecurityManager has been called by com.example.Main
// ...

// Future Java versions will throw UnsupportedOperationException
```

Modern security is achieved through containers, OS-level sandboxing, and network policies — not Java's Security Manager.

---

## 6.6 Java 17 Upgrade Checklist

When upgrading from Java 11 (or earlier) to Java 17:

```
☐ Audit --illegal-access usage in JVM startup scripts
  → Remove --illegal-access flags (they no longer exist)
  → Add --add-opens / --add-exports for any remaining internal API usage

☐ Update dependencies to Java 17-compatible versions:
  → Spring Boot: 3.0+ (requires Java 17)
  → Hibernate: 6.0+
  → Mockito: 4.0+
  → ByteBuddy: 1.12+
  → Byte-Buddy dependent frameworks (Mockito, Hibernate proxies)

☐ Test serialization code:
  → Ensure deserialization filters are in place
  → Verify compact constructors on records run correctly during deserialization

☐ Remove strictfp modifiers (optional — they're harmless but now redundant)

☐ Remove Security Manager installation (or plan to — deprecation warning now)

☐ Remove RMI Activation code (it no longer exists)

☐ Build configuration:
  → Set source/target to 17 in Maven/Gradle
  → Enable JVM-level optimizations with --release 17

☐ Adopt new language features incrementally:
  → Records for data carriers
  → Sealed classes for closed hierarchies
  → Text blocks for multi-line strings
  → Switch expressions everywhere (finalized since Java 14)
```

Maven build configuration for Java 17:

```xml
<properties>
    <java.version>17</java.version>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <!-- Or, preferred: -->
    <maven.compiler.release>17</maven.compiler.release>
</properties>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.13.0</version>
    <configuration>
        <release>17</release>
    </configuration>
</plugin>
```

---

## 6.7 Summary

Java 17's "other features" fill important gaps:

- **Enhanced PRNG (JEP 356)**: A unified `RandomGenerator` interface replaces the fragmented random API, with algorithm selection via factory and first-class parallel support via `SplittableGenerator`
- **Strong encapsulation (JEP 403)**: `--illegal-access` is gone — migrate internal API dependencies to public APIs or current library versions
- **Always-strict FP (JEP 306)**: `strictfp` is now a no-op; all floating-point is IEEE 754 compliant universally
- **Deserialization filters (JEP 415)**: Context-aware filter factory enables fine-grained deserialization security policies
- **Removals/deprecations**: Applet API, RMI Activation, experimental AOT/JIT are gone; Security Manager is deprecated

Together, these changes make Java 17 the most secure, consistent, and modernized LTS baseline in years.
