# Chapter 14: Other Java 21 Features — Generational ZGC, String Templates, and Unnamed Patterns

Java 21 includes several other features beyond the flagship virtual threads, sequenced collections, and pattern matching. This chapter covers Generational ZGC (a significant GC improvement), String Templates (preview — and eventually removed in later previews), Unnamed Patterns and Variables, and Unnamed Classes and Instance Main Methods.

---

## 14.1 Generational ZGC (JEP 439)

ZGC was introduced in Java 11 as a low-latency garbage collector with sub-millisecond pause times. Its original design used a single-generation heap. Java 21 adds a **generational** mode to ZGC, exploiting the well-known generational hypothesis: most objects die young.

### Why Generational GC Helps ZGC

Non-generational ZGC scans the entire heap on every collection cycle. With generational ZGC, short-lived objects are collected frequently in a **young generation** (small, fast to collect), while long-lived objects graduate to the **old generation** (collected infrequently). This reduces:
- The amount of live data scanned per cycle
- CPU overhead of GC
- Required heap overhead for barrier buffers

### Enabling Generational ZGC

```bash
# Java 21: enable ZGC with generational mode
java -XX:+UseZGC -XX:+ZGenerational -jar myapp.jar

# Java 21 default is still non-generational ZGC
# From Java 23 onwards, generational becomes the default for ZGC
java -XX:+UseZGC -jar myapp.jar  # non-generational in Java 21
```

### Performance Characteristics

Generational ZGC is most beneficial for:
- Applications with high allocation rates (microservices handling many short-lived requests)
- Applications with large heaps (16GB+) where full heap scans are expensive
- Low-latency services where tail latency matters more than throughput

```java
// Example: High-allocation microservice that benefits from Generational ZGC
@RestController
public class OrderController {

    @GetMapping("/orders/{id}")
    public OrderResponse getOrder(@PathVariable String id) {
        // Many short-lived objects per request:
        // - Request DTOs, response objects
        // - Intermediate stream objects
        // - JSON serialization buffers
        Order order = orderService.find(id);
        return mapper.toResponse(order); // these objects die after the response
    }
}
```

Heap sizing guidance with Generational ZGC:
```bash
# Young generation size (default: auto-tuned)
-XX:ZYoungGenerationSize=1g   # or specify as fraction
-XX:ZYoungGenerationSizeMax=2g
```

### ZGC vs G1 vs Shenandoah

| GC | Pause target | Best for |
|----|-------------|----------|
| G1 | ~200ms | Balanced throughput + latency |
| Shenandoah | <10ms | Low-latency with medium heaps |
| ZGC (generational) | <1ms | Ultra-low latency, large heaps |
| Serial/Parallel | N/A | Batch/CLI with small heaps |

---

## 14.2 String Templates (JEP 430 — Preview in Java 21)

> **Status note**: String Templates were introduced as a preview in Java 21 (JEP 430) and Java 22 (JEP 459), but were **withdrawn and removed** from preview in Java 23 due to design concerns. They may return in a redesigned form in a future release. The content below reflects the Java 21/22 preview API for historical reference. Do not use this feature in production code targeting Java 23+.

### The STR Template Processor

```java
// Basic interpolation with STR (Java 21 preview syntax)
String name = "Alice";
int age = 30;

String greeting = STR."Hello, \{name}! You are \{age} years old.";
// "Hello, Alice! You are 30 years old."

// Any expression inside \{...}
double price = 99.99;
String receipt = STR."Total: $\{price * 1.1}";  // "Total: $109.989"
String formatted = STR."Total: $\{"%.2f".formatted(price * 1.1)}"; // $109.99
```

### The FMT Template Processor

```java
// FMT: like STR but respects format specifiers
String table = FMT."""
        %-15s %5s %8s%n\{""} %-15s %5.2f %8.2f%n\
        """.formatted();  // Note: FMT is a preview concept
```

### Why String Templates Were Withdrawn

The Java team found that the design of template processors (the `StringTemplate.Processor` interface) had unresolved questions around safety, the default processor semantics, and the interaction with SQL/HTML injection prevention. They chose to withdraw rather than finalize a design that might need breaking changes later.

---

## 14.3 Unnamed Patterns and Variables (JEP 443 — Preview in Java 21, Finalized Java 22)

Unnamed patterns and variables use `_` as a wildcard to **intentionally ignore** values you don't need:

### Unnamed Variables in Catch

```java
// Before: forced to name an exception you don't use
try {
    riskyOperation();
} catch (SpecificException ignored) {  // "ignored" is a lie
    fallback();
}

// After: _ explicitly signals "I don't need this"
try {
    riskyOperation();
} catch (SpecificException _) {
    fallback();
}
```

### Unnamed Variables in Enhanced For

```java
// Counting elements without using the element
int count = 0;
for (var _ : collection) {
    count++;
}
// Cleaner than: for (var ignored : collection)
```

### Unnamed Patterns in switch

```java
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
record Triangle(double base, double height) implements Shape {}  // consistent with Ch5

// Ignore components you don't need with _
String quickDescribe(Shape shape) {
    return switch (shape) {
        case Circle(double r)              -> "circle r=" + r;
        case Rectangle(double w, double h) -> "rectangle " + w + "×" + h;
        case Triangle(double b, var _)     -> "triangle base=" + b; // ignore height with _
    };
}
```

### Unnamed Variables in Lambda

```java
// When a lambda parameter is required but not used
Map<String, Integer> wordCount = new HashMap<>();
words.forEach((word, _) -> wordCount.merge(word, 1, Integer::sum));
// Cleaner than: words.forEach((word, ignoredValue) -> ...)
```

### Unnamed Variables in try-with-resources

```java
// When you need the side effect of opening/closing but not the resource itself
try (var _ = MDC.putCloseable("requestId", requestId)) {
    processRequest(); // MDC context is set for the duration, we don't need the AutoCloseable
}
```

---

## 14.4 Unnamed Classes and Instance Main Methods (JEP 445 — Preview in Java 21, Final Java 25)

This feature lowers the barrier to entry for Java programs by eliminating the mandatory class declaration for simple programs:

### Instance Main Methods

```java
// Before Java 21: required static, String[] args, class declaration
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Java 21 preview: all three modifiers are now optional
// Traditional still works, but these also compile:
class SimplerHello {
    void main() {  // instance method, no args
        System.out.println("Hello, World!");
    }
}
```

The launcher precedence order:
1. `public static void main(String[])`  — traditional, highest priority
2. `static void main(String[])`
3. `public static void main()`
4. `static void main()`
5. `public void main(String[])`
6. `public void main()`
7. `void main(String[])`
8. `void main()`                        — least priority

### Unnamed Classes

```java
// An unnamed class: no class declaration at all
// File: Greeter.java
void main() {
    String name = System.getProperty("user.name");
    println("Hello, " + name + "!");
}

// 'println' is auto-imported (java.io.IO class, preview feature)
```

Unnamed classes **implicitly import**:
- All of `java.lang.*`
- All of `java.io.*`
- Selected utility methods like `println()`

### Expert Use Cases

For experienced engineers, these aren't about simplification — they're about **scripting convenience**:

```java
// Quick data transformation script — no ceremony
// File: ProcessOrders.java
import java.nio.file.*;
import java.util.*;

void main() throws Exception {
    var orders = Files.readAllLines(Path.of("orders.csv"));
    orders.stream()
          .skip(1)  // skip header
          .map(line -> line.split(","))
          .filter(cols -> Double.parseDouble(cols[2]) > 100.0)
          .forEach(cols -> System.out.println(cols[0] + ": $" + cols[2]));
}
```

Run with:
```bash
java --enable-preview --source 21 ProcessOrders.java
```

---

## 14.5 The Complete Java 21 Upgrade Checklist

```
☐ Enable virtual threads (Spring Boot: spring.threads.virtual.enabled=true)
   or Executors.newVirtualThreadPerTaskExecutor() for custom executors

☐ Replace synchronized blocks with ReentrantLock where virtual threads are used
   and blocking operations occur inside the synchronized section

☐ Adopt Sequenced Collections API:
   - list.getFirst() / list.getLast() instead of list.get(0) / list.get(size-1)
   - list.reversed() for reverse iteration
   - linkedHashMap.firstEntry() / lastEntry() for ordered map access

☐ Adopt Record Patterns in switch and instanceof
   - Replace nested instanceof chains with record deconstruction

☐ Adopt Pattern Matching for Switch (no --enable-preview needed in Java 21)
   - Remove 'default' from exhaustive switches over sealed types

☐ Upgrade dependencies for Java 21 compatibility:
   - Spring Boot 3.2+ for virtual thread support
   - Hibernate 6.4+
   - All major frameworks support Java 21

☐ GC: evaluate Generational ZGC for high-allocation, low-latency services
   -XX:+UseZGC -XX:+ZGenerational

☐ Preview features (--enable-preview):
   - Scoped Values (production-use at your risk — finalized in Java 25)
   - Structured Concurrency (production-use at your risk — evolving through Java 25)
   - Unnamed Patterns and Variables (finalized in Java 22)
```

---

## 14.6 Summary

Java 21's supplementary features round out a landmark release:

- **Generational ZGC** reduces GC overhead for allocation-heavy services with near-zero pause times
- **String Templates** (preview, later withdrawn) — await redesign in a future Java version
- **Unnamed Patterns** (`_`) enable intentional ignorance of unused components and variables — finalized Java 22
- **Unnamed Classes** and instance `main()` methods reduce boilerplate for scripts and programs — finalized Java 25

Together with virtual threads, sequenced collections, and the pattern matching finalization, Java 21 represents the largest set of impactful changes since Java 8 — making it the obvious long-term target for any serious Java organization.
