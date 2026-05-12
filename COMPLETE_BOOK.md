# Modern Java: Mastering the New Features of Java 17, 21, and 25

## A Deep Dive for Experienced Java Engineers

---

**Edition:** First Edition, 2026

---

## MIT License

Copyright (c) 2026 The Junlei Li

Permission is hereby granted, free of charge, to any person obtaining a copy of this book and associated documentation files (the "Book"), to deal in the Book without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Book, and to permit persons to whom the Book is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Book.

THE BOOK IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE BOOK OR THE USE OR OTHER DEALINGS IN THE BOOK.

---

Java and OpenJDK are trademarks or registered trademarks of Oracle Corporation and/or its affiliates. All other trademarks are the property of their respective owners.

---

---

# Table of Contents

**Preface**

**Introduction: The Modern Java Cadence**

---

## PART I: Java 17 — The Foundation Renewed (LTS)

**Chapter 1: Records — Immutable Data Carriers**
- 1.1 The Problem Records Solve
- 1.2 Anatomy of a Record Declaration
- 1.3 Auto-generated Methods: equals, hashCode, toString, Accessors
- 1.4 Compact Constructors
- 1.5 Custom Constructors and Accessor Overrides
- 1.6 Records and Interfaces
- 1.7 Generic Records
- 1.8 Records as Local Records
- 1.9 Restrictions: What Records Cannot Do
- 1.10 Records with Serialization
- 1.11 Records vs. Lombok @Value vs. Traditional POJOs
- 1.12 Real-World Patterns: Domain Value Objects, DTOs, Result Types
- 1.13 Records with the Stream API and Collectors
- 1.14 Summary

**Chapter 2: Sealed Classes and Interfaces**
- 2.1 Motivation: The Problem with Open Class Hierarchies
- 2.2 Declaring Sealed Classes with the permits Clause
- 2.3 Sealed Interfaces
- 2.4 Subclass Constraints: final, sealed, non-sealed
- 2.5 Module Considerations
- 2.6 Sealed Classes and the Compiler: Exhaustiveness Checking
- 2.7 Sealed Classes as Algebraic Data Types (ADTs)
- 2.8 Combining Sealed Classes with Records
- 2.9 Combining Sealed Classes with Pattern Matching
- 2.10 Sealed Classes in Domain Modeling: Shape, Payment, Result, Either
- 2.11 Migration: Refactoring Existing Hierarchies to Sealed
- 2.12 Summary

**Chapter 3: Pattern Matching for instanceof**
- 3.1 The Old instanceof Idiom and Its Friction
- 3.2 Pattern Variables: Binding and Scope
- 3.3 Flow Scoping Rules
- 3.4 Negation and Short-Circuit Operators
- 3.5 Pattern Matching in Practice: Visitor Replacements
- 3.6 Nesting and Chaining Patterns
- 3.7 Interactions with Generics
- 3.8 Summary

**Chapter 4: Text Blocks in Depth**
- 4.1 Motivation: Multi-Line String Literals Before Java 15
- 4.2 Text Block Syntax and Incidental Whitespace
- 4.3 Escape Sequences: \s and Line Continuation
- 4.4 String Methods for Text Blocks: indent, stripIndent, translateEscapes
- 4.5 Text Blocks for JSON, SQL, HTML, and XML
- 4.6 Performance Considerations
- 4.7 Summary

**Chapter 5: Switch Expressions and Pattern Matching for Switch**
- 5.1 Switch Expressions: From Statements to Expressions
- 5.2 The Arrow Syntax and Yield
- 5.3 Exhaustiveness in Switch Expressions
- 5.4 Pattern Matching for Switch: Type Patterns
- 5.5 Guarded Patterns with when
- 5.6 Null Handling in Switch
- 5.7 Dominance and Completeness Rules
- 5.8 Summary

**Chapter 6: Other Java 17 Features**
- 6.1 Enhanced Pseudorandom Number Generators (JEP 356)
- 6.2 Strong Encapsulation of JDK Internals (JEP 403)
- 6.3 Context-Specific Deserialization Filters (JEP 415)
- 6.4 Deprecations and Removals
- 6.5 Summary

---

## PART II: Java 21 — Concurrency, Collections, and Patterns (LTS)

**Chapter 7: Virtual Threads — The Threading Revolution**
- 7.1 The Scaling Problem: Platform Threads and the OS
- 7.2 Virtual Threads: Architecture and Carrier Threads
- 7.3 Creating Virtual Threads
- 7.4 Blocking is Cheap: I/O, Locks, and Pinning
- 7.5 Virtual Threads and Thread-Local Variables
- 7.6 Virtual Threads with ExecutorService
- 7.7 Observability: JFR, JMX, and Thread Dumps
- 7.8 When Not to Use Virtual Threads
- 7.9 Migration Strategy for Existing Applications
- 7.10 Summary

**Chapter 8: Structured Concurrency**
- 8.1 Unstructured Concurrency and Its Failure Modes
- 8.2 StructuredTaskScope: Concepts and API
- 8.3 ShutdownOnFailure and ShutdownOnSuccess Policies
- 8.4 Custom Scopes
- 8.5 Error Propagation and Cancellation
- 8.6 Structured Concurrency and Virtual Threads
- 8.7 Summary

**Chapter 9: Scoped Values**
- 9.1 The Problem with ThreadLocal
- 9.2 ScopedValue: Concept and Lifecycle
- 9.3 Inheritance and Child Scopes
- 9.4 Scoped Values in Structured Concurrency
- 9.5 Migration from ThreadLocal
- 9.6 Summary

**Chapter 10: Sequenced Collections**
- 10.1 The Pre-Java-21 Gap in the Collections Hierarchy
- 10.2 SequencedCollection, SequencedSet, SequencedMap
- 10.3 New Methods: getFirst, getLast, reversed
- 10.4 Interactions with Existing Collections
- 10.5 Summary

**Chapter 11: Record Patterns**
- 11.1 Deconstructing Records
- 11.2 Nested Record Patterns
- 11.3 Generic Record Patterns
- 11.4 Record Patterns in Switch
- 11.5 Real-World Use Cases
- 11.6 Summary

**Chapter 12: Pattern Matching for Switch (Finalized)**
- 12.1 From Preview to Standard: What Changed
- 12.2 Complete Pattern Switch Examples
- 12.3 Exhaustiveness with Sealed Types
- 12.4 The when Clause
- 12.5 Summary

**Chapter 13: Foreign Function and Memory API**
- 13.1 Motivation: Beyond JNI
- 13.2 MemorySegment and MemoryLayout
- 13.3 Linker and FunctionDescriptor
- 13.4 Arena Lifecycle Management
- 13.5 Practical Example: Calling a Native Library
- 13.6 Safety and Performance Tradeoffs
- 13.7 Summary

**Chapter 14: Other Java 21 Features**
- 14.1 Generational ZGC
- 14.2 String Templates (Preview — JEP 430)
- 14.3 Unnamed Patterns and Variables (Preview — JEP 443)
- 14.4 Unnamed Classes and Instance Main Methods (Preview — JEP 445)
- 14.5 Key Management and Security Updates
- 14.6 Summary

---

## PART III: Java 25 — The Next LTS

**Chapter 15: Scoped Values (Finalized)**
- 15.1 What Changed from the Preview
- 15.2 Final API Shape and Best Practices
- 15.3 Real-World Deployment Patterns
- 15.4 Summary

**Chapter 16: Structured Concurrency (Preview in Java 25)**
- 16.1 API Evolution Since Java 21
- 16.2 New Scope Policies and Customization Points
- 16.3 Production Readiness Assessment
- 16.4 Summary

**Chapter 17: Flexible Constructor Bodies**
- 17.1 The Old super() Must Be First Constraint
- 17.2 What Flexible Constructor Bodies Allow
- 17.3 Validation and Computation Before Delegation
- 17.4 Implications for Inheritance and Safety
- 17.5 Summary

**Chapter 18: Compact Source Files and Instance Main Methods**
- 18.1 Reducing Ceremony for Small Programs
- 18.2 Instance Main Methods: How They Work
- 18.3 Compact Source Files Without Class Declarations
- 18.4 Use Cases: Scripts, Prototypes, Education
- 18.5 Summary

**Chapter 19: Module Import Declarations**
- 19.1 The Verbosity of Module-Aware Imports
- 19.2 import module Syntax
- 19.3 Interaction with the Module System
- 19.4 Summary

**Chapter 20: Key Derivation Function API and Security Enhancements**
- 20.1 Key Derivation Functions: Background
- 20.2 The KDF API
- 20.3 HKDF and PBKDF2 Implementations
- 20.4 Other Security Updates in Java 25
- 20.5 Summary

**Chapter 21: JVM and Runtime Improvements**
- 21.1 Compact Object Headers (JEP 450)
- 21.2 Generational Shenandoah
- 21.3 Performance Improvements and Benchmarks
- 21.4 Deprecations and Removals
- 21.5 Summary

---

## APPENDICES

**Appendix A: Java Version Compatibility and Migration Guide**
- A.1 Migrating from Java 11 to Java 17
- A.2 Migrating from Java 17 to Java 21
- A.3 Migrating from Java 21 to Java 25
- A.4 Toolchain Compatibility Matrix
- A.5 Common Migration Pitfalls

**Appendix B: JEP Reference Index**
- All JEPs referenced in this book, organized by Java version

---

---

# Preface

This book was written for Java engineers who already know the language well — professionals who have built production systems with Java 8, 11, or 17 and who need a precise, thorough, and opinionated guide to what has changed in the modern Java releases. You will not find explanations of basic object-oriented programming here, nor introductions to the Collections API. What you will find is a deep, practical examination of the language and platform features introduced across three landmark releases: Java 17, 21, and 25.

## Why These Three Versions?

Java follows a six-month release cadence, shipping new versions every March and September. That pace produces many releases, but not all of them are created equal. The Java community and the broader ecosystem — build tools, frameworks, cloud providers, runtime environments — converge on Long-Term Support (LTS) releases, which receive extended maintenance windows and vendor guarantees. Java 17 (released September 2021), Java 21 (released September 2023), and Java 25 (expected September 2025) represent three consecutive LTS milestones and together define what it means to program in "modern Java."

Java 17 solidified features that had been in preview or incubation for several releases: records, sealed classes, pattern matching for `instanceof`, text blocks, and switch expressions became standard parts of the language. These features, taken together, shift Java meaningfully toward a more expressive, functional-inflected style of programming.

Java 21 delivered what many consider the most significant platform-level change in over a decade: virtual threads. Along with structured concurrency, scoped values, sequenced collections, record patterns, and the finalization of pattern matching for switch, Java 21 is a release that changes how experienced engineers think about concurrency, data modeling, and API design.

Java 25 builds on the platform's foundation, finalizing features that passed through preview, introducing flexible constructor bodies, compact source files, module import declarations, and a new Key Derivation Function API, while continuing to improve the JVM's garbage collectors and runtime performance.

## How to Read This Book

The book is organized into three parts, one per LTS release. Within each part, chapters appear in an order designed to build understanding progressively — foundational language features before more advanced APIs, and simpler concepts before complex ones. However, each chapter is largely self-contained, and experienced engineers should feel free to navigate directly to the features most relevant to their immediate work.

Every chapter follows a consistent structure: motivation (why the feature exists and what problem it solves), a detailed technical exposition with extensive code examples, practical usage patterns drawn from real-world engineering contexts, and a summary section.

The code examples in this book were written for Java 17 or later, with version-specific examples clearly marked. All examples are complete and compilable unless explicitly noted otherwise. We have favored realistic domain names — `Order`, `Product`, `User`, `Money`, `PaymentMethod`, `ShippingAddress` — over the abstract toy examples that plague too many technical books.

## Prerequisites

This book assumes you are proficient in Java. Specifically, you should be comfortable with:

- Java generics, including bounded wildcards and type inference
- The Java Collections Framework
- Functional interfaces, lambdas, and the Stream API (Java 8+)
- The Java Module System (JPMS), at least at a conceptual level
- Concurrency fundamentals: threads, locks, `ExecutorService`, `Future`
- JVM concepts: heap, stack, garbage collection basics

If you are relatively new to Java, we recommend building that foundation first. This book is not an introduction — it is a mastery guide.

## Acknowledgments

The Junlei Li wishes to thank the OpenJDK contributors, JEP authors, and the broader Java community whose public specifications, design documents, and discussions made this work possible. We are particularly grateful to the Project Loom, Project Amber, and Project Panama teams for their years of sustained, thoughtful work on the features covered in these pages.

---

---

# Introduction: The Modern Java Cadence

## A Language That Keeps Moving

For many years, Java's release cadence was defined by long cycles. Java 6 shipped in 2006, Java 7 in 2011, Java 8 in 2014, Java 9 in 2017. Engineers could reasonably count on years of stability between major releases, and the ecosystem — frameworks, tools, runtime environments — had time to adapt before the next wave arrived. The downside was accumulation: features took years to reach production, half-finished experiments languished, and the competitive pressure from Kotlin, Scala, and other JVM languages mounted.

In 2017, the OpenJDK community adopted a new model: a strict six-month release cadence, with a new feature release every March and September. Alongside the cadence came the "preview feature" mechanism, which allows language and API changes to ship in a time-limited, standard-but-not-final state, giving the community a chance to provide feedback before a feature is locked down. The combination of frequent releases and preview features transformed Java's development process from a slow-moving waterfall into something closer to continuous improvement.

## Why LTS Releases Still Matter

The six-month cadence does not mean every release is production-ready for every organization. Many enterprises, infrastructure providers, and framework authors cannot absorb breaking changes or uncertain APIs on a six-month schedule. The LTS designation exists to address that reality. An LTS release is one that Oracle, Amazon, Microsoft, Azul, Red Hat, and other JDK distributors commit to supporting with security patches and bug fixes for extended periods — typically eight years or more in Oracle's current policy.

For engineers working in enterprises, cloud services, or any context where stability matters, LTS releases define the practical adoption boundary. If you are deciding what Java version to standardize on for a new project or a major migration, the answer is almost always the most recent LTS release. This is why Java 17, Java 21, and Java 25 matter so much: they are the versions where the features stabilize, the ecosystem catches up, and production adoption becomes the norm.

## Java 17, 21, and 25 at a Glance

**Java 17** (LTS, September 2021) finalized the language features incubated through Java 14, 15, and 16. Records, sealed classes, and pattern matching for `instanceof` became permanent parts of the language specification. Text blocks, introduced as a standard feature in Java 15, were further refined. Switch expressions, standard since Java 14, gained expanded pattern matching capabilities in preview. The JDK also completed the strong encapsulation of internal APIs that Project Jigsaw had begun, removing workarounds that many applications had relied on. Java 17 is a major language modernization release.

**Java 21** (LTS, September 2023) is arguably the most impactful Java release since Java 8. Project Loom's virtual threads arrived as a standard feature, making it possible to write blocking I/O code at massive scale without the overhead of OS-level threads. Structured concurrency and scoped values — both still in preview — provided the programming model to use virtual threads correctly. Pattern matching for switch was finalized, and record patterns extended the pattern matching system into composite data structures. Sequenced collections addressed a long-standing gap in the Collections API. The Foreign Function and Memory API (Project Panama) became a standard, non-preview feature. Java 21 changes how you write concurrent code and how you model data.

**Java 25** (LTS, expected September 2025) closes the loop on several features that passed through multiple preview cycles, most notably flexible constructor bodies, compact source files, and instance main methods. It finalizes scoped values and advances structured concurrency. Security improvements include a new Key Derivation Function API. JVM-level changes include compact object headers and generational Shenandoah, with meaningful performance improvements for memory-intensive workloads. Java 25 is a maturation release — fewer dramatic breakthroughs, but a polished, high-quality platform ready for the next generation of production systems.

## How the Features Fit Together

One of the most striking things about the features spanning Java 17 through 25 is how coherently they compose. Records, sealed classes, and pattern matching form a cohesive system for expressing algebraic data types in Java — a design pattern that functional programmers have used for decades and that Java is now embracing on its own terms. Virtual threads, structured concurrency, and scoped values form an equally coherent model for concurrent programming — one that brings the expressiveness of asynchronous frameworks to synchronous, blocking code.

These are not isolated features bolted onto the language one by one. They are the product of long-running OpenJDK projects — Project Amber (language features), Project Loom (concurrency), Project Panama (native interop), Project Valhalla (value types, still in progress) — each with a clear architectural vision. Understanding that vision is as important as understanding the individual features, and it is a theme we return to throughout this book.

The chapters that follow examine each feature in depth. But the larger story is about Java's transformation into a language that can express domain models clearly, handle concurrency at scale, and interoperate with the native platform efficiently — all while preserving the backward compatibility and ecosystem richness that have made it one of the most deployed programming languages in history.

Let us begin.


---

# PART I: JAVA 17 — THE FOUNDATION RENEWED (LTS)

---

# Chapter 1: Records — Immutable Data Carriers

Records are one of the most impactful additions to the Java language in a decade. Finalized in Java 16 (JEP 395) and a cornerstone of Java 17, records eliminate the relentless boilerplate that plagues data-carrier classes, while simultaneously encoding *intent* in the type system: a record says "this is a transparent, immutable aggregation of its components." Understanding records deeply — their capabilities, their constraints, and the design philosophy behind them — is essential for any modern Java engineer.

---

## 1.1 The Problem Records Solve

Consider a simple `Point` class. Before records, you had to write:

```java
public final class Point {
    private final double x;
    private final double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double x() { return x; }
    public double y() { return y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point p)) return false;
        return Double.compare(p.x, x) == 0 && Double.compare(p.y, y) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }

    @Override
    public String toString() {
        return "Point[x=" + x + ", y=" + y + "]";
    }
}
```

That's 30+ lines for a 2-field data class. With Lombok's `@Value`, you can reduce it, but you've introduced an annotation processor dependency, and the class still isn't a first-class language concept — it's a code-generated facade.

With records, the same class becomes:

```java
public record Point(double x, double y) {}
```

One line. No boilerplate. No annotation processor. Full compiler support.

---

## 1.2 Anatomy of a Record Declaration

The grammar is concise:

```
[modifiers] record <Name>(<components>) [implements <interfaces>] { [body] }
```

A practical example covering all parts:

```java
public record Order(
    UUID id,
    String customerId,
    List<OrderItem> items,
    Instant createdAt,
    OrderStatus status
) implements Serializable {
    // optional body: custom constructors, static fields/methods, instance methods
}
```

The **components** (the parameters in parentheses) are the defining features of a record. Each component implicitly declares:
1. A `private final` field with the same name and type
2. A public accessor method with the same name (not `getX()` — just `x()`)
3. Participation in the auto-generated `equals`, `hashCode`, and `toString`

Records are implicitly `final` — they cannot be extended. They extend `java.lang.Record` implicitly.

---

## 1.3 Auto-generated Methods

The compiler synthesizes four things automatically:

**Canonical constructor**: accepts all components in declaration order.

**Accessor methods**: one per component, returning the component's value.

**`equals()`**: compares all components using their own `equals()`.

**`hashCode()`**: derived from all components.

**`toString()`**: produces `ClassName[comp1=val1, comp2=val2, ...]`.

```java
record Product(String sku, String name, BigDecimal price) {}

public class RecordDemo {
    public static void main(String[] args) {
        var p1 = new Product("ABC-001", "Wireless Headphones", new BigDecimal("79.99"));
        var p2 = new Product("ABC-001", "Wireless Headphones", new BigDecimal("79.99"));
        var p3 = new Product("ABC-002", "USB-C Cable", new BigDecimal("12.99"));

        // accessor methods (not getXxx() — just xxx())
        System.out.println(p1.sku());    // ABC-001
        System.out.println(p1.name());   // Wireless Headphones
        System.out.println(p1.price());  // 79.99

        // equals — structural, not identity
        System.out.println(p1.equals(p2)); // true
        System.out.println(p1.equals(p3)); // false
        System.out.println(p1 == p2);      // false (distinct objects)

        // hashCode — consistent with equals
        System.out.println(p1.hashCode() == p2.hashCode()); // true

        // toString — readable and unambiguous
        System.out.println(p1); // Product[sku=ABC-001, name=Wireless Headphones, price=79.99]
    }
}
```

---

## 1.4 Compact Constructors

The **compact constructor** is a record-specific feature for adding validation or normalization without repeating component assignments:

```java
public record Range(int min, int max) {
    // Compact constructor: no parameter list, no explicit assignments
    public Range {
        if (min > max) {
            throw new IllegalArgumentException(
                "min (%d) must not exceed max (%d)".formatted(min, max));
        }
        // Normalization example: trim strings if components were String
    }
}
```

The compact constructor body executes *before* the implicit field assignments. You can reassign the component variables inside it:

```java
public record NormalizedEmail(String address) {
    public NormalizedEmail {
        Objects.requireNonNull(address, "address must not be null");
        address = address.strip().toLowerCase(); // reassign before implicit assignment
    }
}

// Usage:
var email = new NormalizedEmail("  Alice@Example.COM  ");
System.out.println(email.address()); // alice@example.com
```

This is far cleaner than the pre-record idiom of `this.address = address.strip().toLowerCase()` scattered through constructors.

---

## 1.5 Custom Constructors and Accessor Overrides

You can define additional constructors, but they **must delegate to the canonical constructor** via `this(...)`:

```java
public record Money(BigDecimal amount, Currency currency) {
    // Additional convenience constructor
    public Money(double amount, String currencyCode) {
        this(BigDecimal.valueOf(amount), Currency.getInstance(currencyCode));
    }

    // Factory method pattern (often preferred over additional constructors)
    public static Money of(double amount, String currencyCode) {
        return new Money(BigDecimal.valueOf(amount), currencyCode);
    }

    public static Money zero(String currencyCode) {
        return new Money(BigDecimal.ZERO, Currency.getInstance(currencyCode));
    }
}
```

You can also override accessor methods — useful for defensive copying of mutable components:

```java
public record Snapshot(List<String> tags, Instant timestamp) {
    // Defensive copy in compact constructor
    public Snapshot {
        tags = List.copyOf(tags); // make truly immutable
    }

    // Override accessor if needed (rare — compact constructor is usually enough)
    // public List<String> tags() { return Collections.unmodifiableList(tags); }
}
```

---

## 1.6 Records and Interfaces

Records can implement interfaces, which is a powerful pattern for expressing capabilities:

```java
public interface Identifiable<ID> {
    ID id();
}

public interface Auditable {
    Instant createdAt();
    Instant updatedAt();
}

public record CustomerRecord(
    UUID id,
    String name,
    String email,
    Instant createdAt,
    Instant updatedAt
) implements Identifiable<UUID>, Auditable {

    // Interface methods are satisfied by the record components automatically
    // because accessors match: id(), createdAt(), updatedAt()
}
```

This is particularly powerful when building generic repositories or processing pipelines:

```java
public <ID, T extends Identifiable<ID>> void save(T entity) {
    System.out.println("Saving entity with id: " + entity.id());
}
```

---

## 1.7 Generic Records

Records support generics fully:

```java
public record Pair<A, B>(A first, B second) {
    public Pair<B, A> swap() {
        return new Pair<>(second, first);
    }

    public <C> Pair<A, C> mapSecond(java.util.function.Function<B, C> f) {
        return new Pair<>(first, f.apply(second));
    }
}

public record Result<T>(T value, String error, boolean success) {
    public static <T> Result<T> ok(T value) {
        return new Result<>(value, null, true);
    }

    public static <T> Result<T> fail(String error) {
        return new Result<>(null, error, false);
    }

    public boolean isOk() { return success; }

    public T getOrThrow() {
        if (!success) throw new RuntimeException("Result failed: " + error);
        return value;
    }
}
```

Usage:

```java
var pair = new Pair<>("hello", 42);
System.out.println(pair.swap()); // Pair[first=42, second=hello]

var result = Result.ok("user found");
System.out.println(result.getOrThrow()); // user found

var failed = Result.<String>fail("user not found");
System.out.println(failed.isOk()); // false
```

---

## 1.8 Local Records

Records can be declared locally inside methods — an excellent tool for intermediate computation shapes that shouldn't pollute the package namespace:

```java
public List<String> getTopProductNames(List<Order> orders, int topN) {
    // Local record: only meaningful in this method's context
    record ProductRevenue(String name, BigDecimal revenue) {}

    return orders.stream()
        .flatMap(o -> o.items().stream())
        .collect(Collectors.groupingBy(
            OrderItem::productName,
            Collectors.reducing(BigDecimal.ZERO,
                OrderItem::subtotal,
                BigDecimal::add)
        ))
        .entrySet().stream()
        .map(e -> new ProductRevenue(e.getKey(), e.getValue()))
        .sorted(Comparator.comparing(ProductRevenue::revenue).reversed())
        .limit(topN)
        .map(ProductRevenue::name)
        .toList();
}
```

Local records are `static` by definition — they cannot capture enclosing instance state.

---

## 1.9 Restrictions: What Records Can't Do

Understanding what records *cannot* do is as important as knowing what they can:

| Restriction | Reason |
|-------------|--------|
| Cannot extend another class | Records implicitly extend `java.lang.Record` |
| Cannot be extended by another class | Records are implicitly `final` |
| Cannot declare instance fields beyond components | Components are the complete state |
| Cannot have mutable components (enforced by immutable fields) | But mutable objects *in* components are your responsibility |
| Compact constructor cannot explicitly call `this(...)` | It's already the canonical constructor |
| Components cannot be `transient` (but explicit fields can) | The component state is the record's identity |

```java
// This is ILLEGAL:
// record BadRecord(int x) extends SomeClass {}   // can't extend

// This is LEGAL — static fields ARE allowed:
record Counter(int value) {
    private static final AtomicInteger instanceCount = new AtomicInteger(0);

    public Counter {
        instanceCount.incrementAndGet();
    }

    public static int totalCreated() {
        return instanceCount.get();
    }
}
```

---

## 1.10 Records with Serialization

Records serialize naturally. The deserialization process uses the canonical constructor, which means compact constructor validation runs on deserialization too — a significant improvement over traditional Java serialization:

```java
public record SerializablePoint(double x, double y) implements Serializable {
    // serialVersionUID is optional for records but good practice
    // Deserialization ALWAYS goes through the canonical constructor
}

// Proof that validation runs during deserialization:
public record PositiveRange(int min, int max) implements Serializable {
    public PositiveRange {
        if (min < 0 || max < 0) throw new IllegalArgumentException("must be positive");
        if (min > max) throw new IllegalArgumentException("min > max");
    }
}
// A tampered serialized form with min > max will fail on deserialization — safe!
```

---

## 1.11 Records vs Lombok @Value vs Traditional POJOs

| Feature | Traditional POJO | Lombok `@Value` | Java Record |
|---------|-----------------|-----------------|-------------|
| Boilerplate | High | None (generated) | None (native) |
| Requires annotation processor | No | Yes | No |
| Immutability | Manual (`final` fields) | Enforced | Enforced |
| Accessor style | `getX()` | `getX()` | `x()` |
| Can be extended | Yes | No | No |
| Supports inheritance | Yes | No | No (only interfaces) |
| JVM awareness | None | None | First-class type |
| Pattern matching support | No | No | Yes (JEP 440) |
| IDE support | Good | Good (plugin needed) | Excellent (native) |
| Serialization safety | Manual | Manual | Constructor always called |

The key insight: records are a **language-level concept**, not a code generation trick. The JVM understands records, pattern matching understands records, and future Java features will continue to integrate with them deeply.

---

## 1.12 Real-World Patterns

### Domain Value Objects

```java
// Value objects in DDD — records are perfect
public record CustomerId(UUID value) {
    public CustomerId {
        Objects.requireNonNull(value, "CustomerId cannot be null");
    }

    public static CustomerId generate() {
        return new CustomerId(UUID.randomUUID());
    }

    public static CustomerId of(String uuidString) {
        return new CustomerId(UUID.fromString(uuidString));
    }
}

public record EmailAddress(String value) {
    private static final Pattern PATTERN =
        Pattern.compile("^[^@]+@[^@]+\\.[^@]+$");

    public EmailAddress {
        Objects.requireNonNull(value);
        if (!PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid email: " + value);
        }
        value = value.toLowerCase();
    }
}

public record Money(BigDecimal amount, String currencyCode) {
    public Money {
        Objects.requireNonNull(amount);
        Objects.requireNonNull(currencyCode);
        if (amount.scale() > 2) {
            amount = amount.setScale(2, RoundingMode.HALF_UP);
        }
    }

    public Money add(Money other) {
        if (!currencyCode.equals(other.currencyCode))
            throw new IllegalArgumentException("Currency mismatch");
        return new Money(amount.add(other.amount), currencyCode);
    }

    public Money multiply(int factor) {
        return new Money(amount.multiply(BigDecimal.valueOf(factor)), currencyCode);
    }
}
```

### DTOs for API layers

```java
// Request/Response DTOs — records are ideal
public record CreateOrderRequest(
    String customerId,
    List<OrderItemRequest> items,
    String shippingAddress
) {}

public record OrderItemRequest(String productId, int quantity) {}

public record CreateOrderResponse(
    String orderId,
    String status,
    Instant estimatedDelivery
) {}
```

### Result types

```java
public record ValidationResult(boolean valid, List<String> errors) {
    public ValidationResult {
        errors = List.copyOf(errors);
    }

    public static ValidationResult ok() {
        return new ValidationResult(true, List.of());
    }

    public static ValidationResult fail(List<String> errors) {
        return new ValidationResult(false, errors);
    }

    public static ValidationResult fail(String... errors) {
        return new ValidationResult(false, List.of(errors));
    }

    public ValidationResult merge(ValidationResult other) {
        var allErrors = new ArrayList<>(errors);
        allErrors.addAll(other.errors);
        return new ValidationResult(valid && other.valid, allErrors);
    }
}
```

---

## 1.13 Records with Stream API and Collectors

Records integrate beautifully with streams:

```java
record SalesSummary(String region, long orderCount, BigDecimal totalRevenue) {}

List<SalesSummary> summarize(List<Order> orders) {
    return orders.stream()
        .collect(Collectors.groupingBy(
            Order::region,
            Collectors.collectingAndThen(
                Collectors.toList(),
                regionOrders -> new SalesSummary(
                    regionOrders.get(0).region(),
                    regionOrders.size(),
                    regionOrders.stream()
                        .map(Order::total)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                )
            )
        ))
        .values().stream()
        .sorted(Comparator.comparing(SalesSummary::totalRevenue).reversed())
        .toList();
}
```

Using `Collectors.teeing()` to compute multiple aggregations in one pass:

```java
record Stats(long count, BigDecimal sum, BigDecimal average) {}

Stats computeStats(List<BigDecimal> values) {
    return values.stream().collect(
        Collectors.teeing(
            Collectors.counting(),
            Collectors.reducing(BigDecimal.ZERO, BigDecimal::add),
            (count, sum) -> new Stats(
                count,
                sum,
                count == 0 ? BigDecimal.ZERO
                           : sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
            )
        )
    );
}
```

---

## 1.14 Summary

Records are a first-class language feature that:

- **Eliminate boilerplate** for data-carrier classes (constructor, equals, hashCode, toString, accessors)
- **Encode intent** — a record declares "this type is purely about its data"
- **Enforce immutability** — components are always `private final`
- **Enable pattern matching** — record deconstruction patterns (Chapter 11) are built on records
- **Improve serialization safety** — canonical constructor always runs on deserialization
- **Compose well** — with interfaces, generics, streams, and the rest of modern Java

The key adoption rule: **if a class is a transparent, immutable data carrier, it should be a record**. Reserve regular classes for types that have behavioral identity or need mutable state. This distinction, when applied consistently, produces codebases that are dramatically more readable and maintainable.


# Chapter 2: Sealed Classes and Interfaces

Sealed classes (JEP 409, finalized in Java 17) answer a question that Java developers have struggled with for decades: *how do I define a type hierarchy that is intentionally closed?* This question arises constantly in domain modeling — a `Shape` is always a `Circle`, `Rectangle`, or `Triangle`; a `PaymentMethod` is always `CreditCard`, `BankTransfer`, or `Crypto`; an HTTP response is either `Success` or `Failure`. Before sealed classes, Java offered no way to express this constraint in the type system. Now it does.

---

## 2.1 Motivation: The Problem with Open Class Hierarchies

Consider a classic shape hierarchy:

```java
// Before sealed classes: completely open hierarchy
public abstract class Shape {
    public abstract double area();
}

public class Circle extends Shape { ... }
public class Rectangle extends Shape { ... }
public class Triangle extends Shape { ... }
```

This hierarchy is *open* — anyone can add a `Pentagon`, a `Hexagon`, or even a `MaliciousShape` anywhere in any package. This openness creates several problems:

**Exhaustiveness checking is impossible.** If you write a method that handles each known shape:

```java
// Pre-Java 17: the compiler cannot verify this is exhaustive
double describe(Shape shape) {
    if (shape instanceof Circle c) return c.area();
    if (shape instanceof Rectangle r) return r.area();
    if (shape instanceof Triangle t) return t.area();
    throw new IllegalArgumentException("Unknown shape: " + shape);  // runtime crash
}
```

The `throw` at the end is a runtime time bomb. The compiler has no idea whether the `if` chain is exhaustive.

**Library authors cannot guarantee invariants.** A library that returns `Shape` values can't guarantee callers will only encounter the three known subclasses.

**Pattern matching switch cannot be exhaustive.** Without sealed classes, switch on an abstract type always requires a `default` clause, even when you've handled all meaningful cases.

---

## 2.2 Declaring Sealed Classes with the permits Clause

```java
public sealed class Shape permits Circle, Rectangle, Triangle {
    public abstract double area();
    public abstract double perimeter();
}
```

The `sealed` modifier combined with `permits` enumerates every allowed direct subclass. The compiler enforces this bidirectionally: the permits clause must list exactly the classes that actually extend `Shape`.

Permitted subclasses must be in the same **compilation unit** (same package if unnamed module, or same module). They must also explicitly declare their relationship using one of three modifiers:

```java
// Option 1: final — no further extension
public final class Circle extends Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override public double area() { return Math.PI * radius * radius; }
    @Override public double perimeter() { return 2 * Math.PI * radius; }
}

// Option 2: sealed — restricted further extension
public sealed class Rectangle extends Shape permits Square {
    private final double width;
    private final double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override public double area() { return width * height; }
    @Override public double perimeter() { return 2 * (width + height); }
}

public final class Square extends Rectangle {
    public Square(double side) { super(side, side); }
}

// Option 3: non-sealed — reopens the hierarchy
public non-sealed class Triangle extends Shape {
    private final double base;
    private final double height;
    private final double hypotenuse;

    public Triangle(double base, double height, double hypotenuse) {
        this.base = base;
        this.height = height;
        this.hypotenuse = hypotenuse;
    }

    @Override public double area() { return 0.5 * base * height; }
    @Override public double perimeter() { return base + height + hypotenuse; }
}
```

---

## 2.3 Sealed Interfaces

Interfaces can be sealed too — a critical feature for expressing closed algebraic data types with records:

```java
public sealed interface PaymentMethod
    permits CreditCard, BankTransfer, CryptoCurrency, GiftCard {}

public record CreditCard(String last4, String network, YearMonth expiry)
    implements PaymentMethod {}

public record BankTransfer(String iban, String bic, String accountHolder)
    implements PaymentMethod {}

public record CryptoCurrency(String walletAddress, String coinType)
    implements PaymentMethod {}

public record GiftCard(String code, BigDecimal balance)
    implements PaymentMethod {}
```

This pattern — sealed interface + record implementations — is now idiomatic Java for **algebraic data types (ADTs)**. It's the Java equivalent of Haskell's `data` types or Scala's `sealed trait`.

---

## 2.4 Subclass Constraints: final, sealed, non-sealed

Each permitted subclass **must** choose its stance:

| Modifier | Meaning | Use when |
|----------|---------|----------|
| `final` | No extension allowed | The leaf of the hierarchy, completely closed |
| `sealed` | Further extension with permits | You want a sub-hierarchy with its own closure |
| `non-sealed` | Open extension allowed | You want one arm of the hierarchy to be extensible |

`non-sealed` is the "escape hatch" that deliberately reopens the hierarchy. It's rarely the right choice for domain types, but it exists for frameworks and extensibility points.

---

## 2.5 Exhaustiveness in Sealed Hierarchies — the Compiler's Guarantee

The killer feature of sealed classes is **exhaustiveness checking** in `switch` expressions:

```java
// With sealed hierarchy — NO default needed, compiler checks exhaustiveness!
double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.width() * r.height();
        case Square s    -> s.side() * s.side();
        case Triangle t  -> 0.5 * t.base() * t.height();
    };
}
```

If you add a new permitted subclass (say `Pentagon`) and forget to update this switch, the **compiler fails the build**. No more runtime crashes from missed cases.

---

## 2.6 Sealed Classes as Algebraic Data Types

The most powerful application of sealed classes is encoding **sum types** (a value is *one of* these alternatives) in a type-safe way. Combined with records, this produces clean, composable domain models:

```java
// A classic Result/Either type
public sealed interface Result<T> permits Result.Success, Result.Failure {

    record Success<T>(T value) implements Result<T> {}
    record Failure<T>(String message, Throwable cause) implements Result<T> {
        public Failure(String message) { this(message, null); }
    }

    static <T> Result<T> success(T value) { return new Success<>(value); }
    static <T> Result<T> failure(String message) { return new Failure<>(message); }
    static <T> Result<T> failure(String message, Throwable cause) {
        return new Failure<>(message, cause);
    }

    default boolean isSuccess() { return this instanceof Success<T>; }

    default T getOrThrow() {
        return switch (this) {
            case Success<T> s -> s.value();
            case Failure<T> f -> throw new RuntimeException(f.message(), f.cause());
        };
    }

    default <U> Result<U> map(java.util.function.Function<T, U> f) {
        return switch (this) {
            case Success<T> s -> Result.success(f.apply(s.value()));
            case Failure<T> f -> Result.failure(f.message(), f.cause());
        };
    }
}
```

Usage:

```java
Result<User> findUser(String id) {
    try {
        return Result.success(userRepository.findById(id));
    } catch (NotFoundException e) {
        return Result.failure("User not found: " + id, e);
    }
}

// Caller — exhaustive, type-safe, no exceptions in control flow
String message = switch (findUser("u123")) {
    case Result.Success<User> s -> "Hello, " + s.value().name();
    case Result.Failure<User> f -> "Error: " + f.message();
};
```

---

## 2.7 Domain Modeling with Sealed Classes

### HTTP Response modeling

```java
public sealed interface HttpResponse<T>
    permits HttpResponse.Ok, HttpResponse.Created, HttpResponse.ClientError,
            HttpResponse.ServerError {

    record Ok<T>(T body) implements HttpResponse<T> {}
    record Created<T>(T body, URI location) implements HttpResponse<T> {}
    record ClientError<T>(int statusCode, String message) implements HttpResponse<T> {}
    record ServerError<T>(int statusCode, String message, Throwable cause)
        implements HttpResponse<T> {}
}

// Processing — exhaustive, no default needed
<T> void handleResponse(HttpResponse<T> response) {
    switch (response) {
        case HttpResponse.Ok<T> ok ->
            System.out.println("Success: " + ok.body());
        case HttpResponse.Created<T> created ->
            System.out.println("Created at: " + created.location());
        case HttpResponse.ClientError<T> err ->
            System.err.println("Client error " + err.statusCode() + ": " + err.message());
        case HttpResponse.ServerError<T> err ->
            System.err.println("Server error " + err.statusCode() + ": " + err.message());
    }
}
```

### Event sourcing

```java
public sealed interface OrderEvent permits
    OrderEvent.OrderPlaced,
    OrderEvent.PaymentConfirmed,
    OrderEvent.ItemShipped,
    OrderEvent.OrderCancelled,
    OrderEvent.OrderDelivered {

    record OrderPlaced(UUID orderId, CustomerId customer,
                       List<OrderItem> items, Instant timestamp)
        implements OrderEvent {}

    record PaymentConfirmed(UUID orderId, String transactionId,
                            Money amount, Instant timestamp)
        implements OrderEvent {}

    record ItemShipped(UUID orderId, String trackingNumber,
                       Instant shippedAt) implements OrderEvent {}

    record OrderCancelled(UUID orderId, String reason,
                          Instant cancelledAt) implements OrderEvent {}

    record OrderDelivered(UUID orderId, Instant deliveredAt)
        implements OrderEvent {}
}

// Event handler — exhaustive switch, all events covered
OrderState apply(OrderState state, OrderEvent event) {
    return switch (event) {
        case OrderEvent.OrderPlaced e ->
            state.withStatus(OrderStatus.PENDING).withItems(e.items());
        case OrderEvent.PaymentConfirmed e ->
            state.withStatus(OrderStatus.PAID);
        case OrderEvent.ItemShipped e ->
            state.withStatus(OrderStatus.SHIPPED).withTracking(e.trackingNumber());
        case OrderEvent.OrderCancelled e ->
            state.withStatus(OrderStatus.CANCELLED);
        case OrderEvent.OrderDelivered e ->
            state.withStatus(OrderStatus.DELIVERED);
    };
}
```

---

## 2.8 Combining Sealed Classes with Pattern Matching

Sealed classes and pattern matching are designed to work together:

```java
public sealed interface Expr
    permits Expr.Num, Expr.Add, Expr.Mul, Expr.Neg, Expr.Var {

    record Num(double value) implements Expr {}
    record Add(Expr left, Expr right) implements Expr {}
    record Mul(Expr left, Expr right) implements Expr {}
    record Neg(Expr expr) implements Expr {}
    record Var(String name) implements Expr {}
}

// Recursive evaluator — exhaustive, no default
double eval(Expr expr, Map<String, Double> env) {
    return switch (expr) {
        case Expr.Num(var v)         -> v;
        case Expr.Var(var name)      -> env.getOrDefault(name, 0.0);
        case Expr.Neg(var e)         -> -eval(e, env);
        case Expr.Add(var l, var r)  -> eval(l, env) + eval(r, env);
        case Expr.Mul(var l, var r)  -> eval(l, env) * eval(r, env);
    };
}

// Pretty-printer
String print(Expr expr) {
    return switch (expr) {
        case Expr.Num(var v)         -> String.valueOf(v);
        case Expr.Var(var name)      -> name;
        case Expr.Neg(var e)         -> "(-" + print(e) + ")";
        case Expr.Add(var l, var r)  -> "(" + print(l) + " + " + print(r) + ")";
        case Expr.Mul(var l, var r)  -> "(" + print(l) + " * " + print(r) + ")";
    };
}
```

---

## 2.9 Sealed Classes in Error/Option Modeling

```java
// Option type (like Java Optional, but pattern-matchable)
public sealed interface Option<T> permits Option.Some, Option.None {

    record Some<T>(T value) implements Option<T> {}

    @SuppressWarnings("unchecked")
    final class None<T> implements Option<T> {
        private static final None<?> INSTANCE = new None<>();
        private None() {}
        public static <T> None<T> instance() { return (None<T>) INSTANCE; }
    }

    static <T> Option<T> of(T value) {
        return value != null ? new Some<>(value) : none();
    }

    static <T> Option<T> none() { return None.instance(); }

    default T getOrElse(T defaultValue) {
        return switch (this) {
            case Some<T> s -> s.value();
            case None<T> n -> defaultValue;
        };
    }

    default <U> Option<U> map(java.util.function.Function<T, U> f) {
        return switch (this) {
            case Some<T> s -> Option.of(f.apply(s.value()));
            case None<T> n -> Option.none();
        };
    }
}
```

---

## 2.10 Migrating Existing Hierarchies to Sealed

If you have an existing open hierarchy:

```java
// Before: open hierarchy
public abstract class Notification {
    abstract void send();
}
public class EmailNotification extends Notification { ... }
public class SmsNotification extends Notification { ... }
public class PushNotification extends Notification { ... }
```

Migration steps:
1. Add `sealed` and `permits` to the parent
2. Add `final` (or `sealed` / `non-sealed`) to each subclass
3. Let the compiler tell you if you missed any permitted subclass
4. Update any `if-instanceof` chains to exhaustive `switch`

```java
// After: sealed hierarchy
public sealed abstract class Notification
    permits EmailNotification, SmsNotification, PushNotification {
    abstract void send();
}
public final class EmailNotification extends Notification { ... }
public final class SmsNotification extends Notification { ... }
public final class PushNotification extends Notification { ... }
```

---

## 2.11 Summary

Sealed classes are a pivotal language feature that:

- **Close hierarchies** intentionally, making them self-documenting
- **Enable exhaustiveness checking** in switch expressions and pattern matching
- **Support algebraic data types** (sum types) idiomatically in Java
- **Pair with records** to produce clean, immutable, type-safe domain models
- **Integrate with pattern matching** (Chapters 3, 11, 12) for surgical, readable data dispatch

The rule of thumb: whenever a type has a *fixed set of known subtypes* and callers should handle all of them, reach for `sealed`. Combined with records, it's the foundation of modern Java data modeling.


# Chapter 3: Pattern Matching for instanceof

> JEP 394, finalized in Java 16, a cornerstone feature of Java 17

---

Pattern matching for `instanceof` is one of those language changes that looks modest in isolation but reveals its true impact only when you encounter the code it replaces. It is the first delivery of a larger, long-term pattern matching story in the Java platform — a story that continues through sealed classes, switch expressions, record patterns, and beyond. To understand where Java is going, you must understand where it started with JEP 394.

This chapter treats pattern matching for `instanceof` as the experienced Java engineer deserves: not as a syntax curiosity, but as a precise semantic tool with well-defined rules around scope, flow, generics, and performance. We will ground every concept in realistic code and conclude with a migration guide you can apply to your production codebases today.

---

## 3.1 The Tedium of the Old instanceof-cast Idiom

Every experienced Java engineer has written, reviewed, and refactored code that looks like this:

```java
// Classic instanceof-cast idiom — the old way
public double computeArea(Shape shape) {
    if (shape instanceof Circle) {
        Circle c = (Circle) shape;          // cast is redundant information
        return Math.PI * c.radius() * c.radius();
    } else if (shape instanceof Rectangle) {
        Rectangle r = (Rectangle) shape;    // same type we just tested
        return r.width() * r.height();
    } else if (shape instanceof Triangle) {
        Triangle t = (Triangle) shape;
        return 0.5 * t.base() * t.height();
    }
    throw new IllegalArgumentException("Unknown shape: " + shape);
}
```

The smell here is not just verbosity. The cast on line three is logically redundant: the JVM has already verified the type on line two. You, the programmer, are repeating yourself to satisfy the type system, and the type system gains nothing from the repetition because it already knows. Worse, the introduction of a local variable (`Circle c`) on a separate line from the test (`shape instanceof Circle`) creates an implicit coupling that is invisible to the compiler. If a future maintainer removes or reorders the test but leaves the cast, a `ClassCastException` arrives at runtime.

The idiom also pollutes the enclosing scope. In the snippet above, `c`, `r`, and `t` are all visible throughout the method — even after their respective branches have concluded. That is rarely what you want.

Consider a more insidious variant: the double-check pattern that appeared in high-performance concurrent code before `java.util.concurrent` matured:

```java
// Problematic double-check — type tested twice, cast separate
public void processEvent(Object event) {
    if (event instanceof PaymentEvent) {
        // ... some validation ...
        PaymentEvent pe = (PaymentEvent) event; // could throw in theory if
                                                // event were mutated between
                                                // lines in a concurrent context
        processPayment(pe.getAmount(), pe.getCurrency());
    }
}
```

In practice this is safe because `event` is a local variable, but the cognitive overhead of reasoning about it is real. JEP 394 eliminates the entire class of problems.

---

## 3.2 Pattern Variables: Syntax and Semantics

The new syntax is compact:

```java
if (shape instanceof Circle c) {
    // c is available here, already typed as Circle
    return Math.PI * c.radius() * c.radius();
}
```

The fragment `Circle c` is called a **pattern** — specifically a **type pattern**. It consists of a type (`Circle`) and a **pattern variable** (`c`). The semantics are:

1. Evaluate `shape instanceof Circle` as before.
2. If the result is `true`, bind the pattern variable `c` to `shape` cast to `Circle`.
3. Make `c` available in the scope where the test is known to hold.

The binding is performed by the runtime using the same mechanics as a checked cast (`checkcast` bytecode), so there is no semantic difference from `(Circle) shape`. The difference is entirely in where that cast appears relative to what the programmer writes: the JVM does it implicitly, and the result is given a name you chose rather than a name you had to invent.

Rewriting the original example:

```java
public double computeArea(Shape shape) {
    if (shape instanceof Circle c) {
        return Math.PI * c.radius() * c.radius();
    } else if (shape instanceof Rectangle r) {
        return r.width() * r.height();
    } else if (shape instanceof Triangle t) {
        return 0.5 * t.base() * t.height();
    }
    throw new IllegalArgumentException("Unknown shape: " + shape);
}
```

The cast lines are gone. Each branch is self-contained. The pattern variables `c`, `r`, and `t` do not pollute each other's scope (as we will see in the next section).

---

## 3.3 Scope of Pattern Variables — Flow-Sensitive Typing Explained

The scope rules for pattern variables are the most intellectually interesting part of JEP 394 because they use **definite assignment** analysis — the same underlying mechanism Java uses to enforce that local variables are initialized before use — but they extend it with **flow-sensitive typing**.

The compiler tracks whether a pattern variable is **definitely assigned** at each point in the control flow graph. The rule is:

- A pattern variable introduced by `e instanceof T v` is in scope in a region R if and only if `e instanceof T` is definitely true in R.

This sounds abstract, so let us build intuition through examples.

```java
// Pattern variable in scope only inside the if-block
public void inspect(Object obj) {
    if (obj instanceof String s) {
        System.out.println(s.length()); // s is in scope here
    }
    // s is NOT in scope here — the compiler rejects any reference to s
}
```

The scope does not extend past the closing brace because the compiler cannot guarantee that `obj` is a `String` at that point.

Now consider the `else` branch:

```java
public void inspectElse(Object obj) {
    if (obj instanceof String s) {
        System.out.println("String of length: " + s.length());
    } else {
        // s is NOT in scope here, which makes perfect sense:
        // in the else branch, obj is definitely NOT a String
        System.out.println("Not a String");
    }
}
```

The scope of `s` is confined to the `true` branch. This is the right behavior: in the `else` branch, `s` would be unbound.

More subtle is the early-return idiom:

```java
public void processString(Object obj) {
    if (!(obj instanceof String s)) {
        return; // or throw
    }
    // s IS in scope here, because we only reach this point
    // if obj instanceof String was true
    System.out.println(s.toUpperCase());
    System.out.println(s.length());
}
```

This is the guard-clause pattern, and Java 17 supports it fully. After the early return, the compiler knows `obj instanceof String` must have been true, so `s` is definitely assigned. This is the same reasoning that allows you to use a variable after `if (x == null) throw ...`.

The scope rule is recursive and handles nesting correctly:

```java
public void nestedScope(Object outer, Object inner) {
    if (outer instanceof Container container) {
        if (inner instanceof Payload payload) {
            container.add(payload); // both in scope
        }
        // payload NOT in scope here
        container.seal();           // container still in scope
    }
    // neither container nor payload in scope here
}
```

---

## 3.4 Using Pattern Variables in Conditions: && and ||

The `&&` operator short-circuits: the right operand is evaluated only if the left operand is `true`. The compiler uses this to extend pattern variable scope into the right operand of `&&`:

```java
// Pattern variable usable in the same condition via &&
public boolean isNonEmptyString(Object obj) {
    return obj instanceof String s && !s.isEmpty();
    // s is in scope on the right of && because:
    // the right side is only evaluated when obj instanceof String is true
}
```

This is elegant. You can express multi-condition tests without intermediate variables:

```java
public boolean isValidEmailAddress(Object obj) {
    return obj instanceof String s
        && s.contains("@")
        && s.length() > 5
        && !s.startsWith("@")
        && !s.endsWith("@");
}
```

The `||` operator has the opposite semantics: the right operand is evaluated when the left is `false`. A pattern variable introduced in the left operand of `||` is NOT in scope in the right operand, because the right is reached only when the left test failed (meaning the pattern did not match):

```java
// This does NOT compile — s is not in scope after ||
// public boolean bad(Object obj) {
//     return obj instanceof String s || s.isEmpty(); // ERROR
// }

// But this is fine — both branches contribute to the union
public boolean isStringOrNumber(Object obj) {
    return obj instanceof String || obj instanceof Number;
}
```

The asymmetry between `&&` and `||` is a deliberate consequence of the definite-assignment rules and mirrors exactly how Java already handles boolean short-circuit evaluation. It is not arbitrary — it follows directly from the semantics.

---

## 3.5 Negation: The ! Operator with Patterns

Negation flips the scoping rules. When you negate an `instanceof` check, the pattern variable is in scope in the region where the original test would have been `false`:

```java
// Guard clause with negated pattern
public String extractUpperCase(Object obj) {
    if (!(obj instanceof String s)) {
        throw new IllegalArgumentException("Expected String, got: "
            + (obj == null ? "null" : obj.getClass().getName()));
    }
    // s is definitely assigned here — the negation + early exit
    // establishes that we only reach this line when the match succeeded
    return s.toUpperCase();
}
```

This is the idiomatic way to write precondition checks with pattern matching. It reads exactly like the traditional `Objects.requireNonNull` pattern and integrates naturally with existing code conventions.

The interaction between `!` and `||` deserves attention:

```java
// Using De Morgan's law with pattern variables
public void requireStringOrNumber(Object obj) {
    // NOT recommended — confusing and doesn't compile as you might expect
    // if (!(obj instanceof String s || obj instanceof Number n)) { ... }

    // Preferred: explicit and clear
    if (!(obj instanceof String) && !(obj instanceof Number)) {
        throw new IllegalArgumentException("Unsupported type");
    }
    // Now handle the types separately
    if (obj instanceof String s) {
        handleString(s);
    } else if (obj instanceof Number n) {
        handleNumber(n);
    }
}
```

---

## 3.6 Pattern Matching in Methods: Visitor-Like Dispatch

Before pattern matching, the canonical way to dispatch on type hierarchies was the Visitor pattern. It is powerful but expensive: it requires modifying every class in the hierarchy to accept a visitor, adding boilerplate, coupling the hierarchy to the visitor interface, and often involving double-dispatch mechanics that confuse newcomers.

Pattern matching enables a lightweight alternative that is appropriate when you do not own the hierarchy or when the dispatch logic is localized:

```java
// Domain model — imagine this is in a library you don't own
public sealed interface Notification
    permits EmailNotification, SmsNotification, PushNotification {}

public record EmailNotification(String to, String subject, String body)
    implements Notification {}

public record SmsNotification(String phoneNumber, String message)
    implements Notification {}

public record PushNotification(String deviceToken, String title, String payload)
    implements Notification {}

// Dispatcher using pattern matching — no Visitor needed
public class NotificationDispatcher {

    public void dispatch(Notification notification) {
        if (notification instanceof EmailNotification email) {
            sendEmail(email.to(), email.subject(), email.body());
        } else if (notification instanceof SmsNotification sms) {
            sendSms(sms.phoneNumber(), sms.message());
        } else if (notification instanceof PushNotification push) {
            sendPush(push.deviceToken(), push.title(), push.payload());
        } else {
            throw new UnsupportedOperationException(
                "No handler for notification type: "
                + notification.getClass().getSimpleName());
        }
    }

    private void sendEmail(String to, String subject, String body) {
        System.out.printf("EMAIL to=%s subject=%s%n", to, subject);
    }

    private void sendSms(String phone, String message) {
        System.out.printf("SMS to=%s message=%s%n", phone, message);
    }

    private void sendPush(String token, String title, String payload) {
        System.out.printf("PUSH token=%s title=%s%n", token, title);
    }
}
```

In Java 21+, the `switch` expression with pattern cases renders even this more elegant — but the `instanceof` chain is already a dramatic improvement over the Visitor that it replaces for non-hierarchical scenarios.

---

## 3.7 Combining with switch (Preview in Java 17) — A Forward Look

Java 17 shipped pattern matching for `switch` as a preview feature (JEP 406). While the full treatment of pattern switch belongs to later chapters, understanding how `instanceof` chains relate to `switch` is important context.

The `instanceof` chain:

```java
public String format(Object value) {
    if (value instanceof Integer i) return "int: " + i;
    if (value instanceof Long l)    return "long: " + l;
    if (value instanceof Double d)  return "double: " + d;
    if (value instanceof String s)  return "string: " + s;
    return "unknown: " + value;
}
```

Becomes in Java 21 (finalized):

```java
public String format(Object value) {
    return switch (value) {
        case Integer i -> "int: " + i;
        case Long l    -> "long: " + l;
        case Double d  -> "double: " + d;
        case String s  -> "string: " + s;
        default        -> "unknown: " + value;
    };
}
```

The `switch` version is not just shorter — it is exhaustiveness-checked when the selector type is a sealed type or an enum. The compiler will tell you when you have missed a case. The `instanceof` chain offers no such guarantee.

The progression from `instanceof` to `switch` to `switch` with guarded patterns is the arc of Java's pattern matching story. JEP 394 is the foundation.

---

## 3.8 Null Handling with Pattern Matching

The existing `instanceof` operator returns `false` for `null`, and pattern matching preserves this semantics exactly:

```java
// null is never matched by any type pattern
public void handlePossiblyNull(Object obj) {
    if (obj instanceof String s) {
        // obj cannot be null here; null instanceof String is false
        System.out.println("String: " + s);
    } else {
        // obj could be null here
        System.out.println("Not a string (or null): " + obj);
    }
}
```

This is the correct behavior in almost all cases: you do not want null to match any type pattern, because binding a null value to a typed pattern variable would be dangerous. However, you need to be aware of the consequence: if you want to handle null explicitly, you must do so separately.

```java
// Explicit null handling before the instanceof check
public String describe(Object obj) {
    if (obj == null) {
        return "null value";
    }
    if (obj instanceof String s) {
        return "String with " + s.length() + " characters";
    }
    if (obj instanceof Number n) {
        return "Number: " + n.doubleValue();
    }
    return "Unknown type: " + obj.getClass().getSimpleName();
}
```

In Java 21's `switch`, there is a dedicated `case null` label that makes this cleaner. But for `instanceof` chains in Java 17, the explicit null check at the top is the canonical approach.

---

## 3.9 Pattern Matching and Generics: Erasure Considerations

Java's type erasure creates a nuanced interaction with pattern matching that every experienced engineer must understand.

At runtime, generic type parameters are erased. `List<String>` and `List<Integer>` are both `List` at the bytecode level. Pattern matching operates on runtime types, so you cannot use a parameterized type in a type pattern:

```java
// THIS DOES NOT COMPILE
// The compiler rejects unchecked type patterns with generic parameters
// if (obj instanceof List<String> ls) { ... }  // compile error

// This compiles, but with an unchecked warning in some contexts:
public void processCollection(Object obj) {
    if (obj instanceof List<?> list) {
        // list is List<?> — safe, but you lose the element type
        System.out.println("List with " + list.size() + " elements");
    }
}
```

The wildcard `List<?>` is your friend here. It allows you to match the raw structure without making unchecked claims about element types.

If you need to handle the element type, you must either use `instanceof` on individual elements or use an unchecked cast inside the branch with a `@SuppressWarnings`:

```java
@SuppressWarnings("unchecked")
public List<String> toStringList(Object obj) {
    if (obj instanceof List<?> rawList && !rawList.isEmpty()
            && rawList.get(0) instanceof String) {
        // Reasonably safe: we checked the first element.
        // In production, you'd want to verify all elements.
        return (List<String>) rawList;
    }
    throw new ClassCastException("Expected List<String>");
}
```

This is a fundamental limitation of erasure, not of pattern matching. Pattern matching makes the best of the situation by making `List<?>` ergonomic and by giving you a named variable immediately.

Arrays are not erased; their element type is a reifiable type at runtime:

```java
public void handleArray(Object obj) {
    if (obj instanceof String[] strings) {
        // Fully type-safe — String[] is a reifiable type
        System.out.println("String array with " + strings.length + " elements");
        for (String s : strings) {
            System.out.println("  - " + s);
        }
    }
}
```

---

## 3.10 Real-World Use Cases: JSON Processing, Command Dispatching, Event Handling

### JSON Processing

Consider a thin JSON model where parsed values are represented as `Object`. This is common in lower-level JSON libraries or when you receive `Object` from a dynamic deserialization layer:

```java
public class JsonRenderer {

    /**
     * Converts a loosely-typed JSON value tree to a formatted string.
     * The tree consists of: null, Boolean, Long, Double, String,
     * List<Object>, and Map<String, Object>.
     */
    public String render(Object value, int indent) {
        String pad = " ".repeat(indent * 2);
        if (value == null) {
            return "null";
        }
        if (value instanceof Boolean b) {
            return b.toString();
        }
        if (value instanceof Long l) {
            return l.toString();
        }
        if (value instanceof Double d) {
            return d.toString();
        }
        if (value instanceof String s) {
            return "\"" + escape(s) + "\"";
        }
        if (value instanceof List<?> list) {
            if (list.isEmpty()) return "[]";
            var sb = new StringBuilder("[\n");
            for (int i = 0; i < list.size(); i++) {
                sb.append(pad).append("  ").append(render(list.get(i), indent + 1));
                if (i < list.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append(pad).append("]");
            return sb.toString();
        }
        if (value instanceof Map<?, ?> map) {
            if (map.isEmpty()) return "{}";
            var sb = new StringBuilder("{\n");
            var entries = new java.util.ArrayList<>(map.entrySet());
            for (int i = 0; i < entries.size(); i++) {
                var entry = entries.get(i);
                sb.append(pad).append("  ")
                  .append("\"").append(entry.getKey()).append("\": ")
                  .append(render(entry.getValue(), indent + 1));
                if (i < entries.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append(pad).append("}");
            return sb.toString();
        }
        throw new IllegalArgumentException("Unsupported JSON value type: "
            + value.getClass());
    }

    private String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\t", "\\t");
    }
}
```

### Command Dispatching

Command buses and CQRS architectures benefit enormously from pattern matching dispatch:

```java
// Command hierarchy
public sealed interface AccountCommand
    permits OpenAccount, DepositFunds, WithdrawFunds, CloseAccount {}

public record OpenAccount(String accountId, String ownerName, String currency)
    implements AccountCommand {}

public record DepositFunds(String accountId, java.math.BigDecimal amount)
    implements AccountCommand {}

public record WithdrawFunds(String accountId, java.math.BigDecimal amount)
    implements AccountCommand {}

public record CloseAccount(String accountId, String reason)
    implements AccountCommand {}

// Command handler
public class AccountCommandHandler {

    public CommandResult handle(AccountCommand command) {
        if (command instanceof OpenAccount open) {
            return openAccount(open.accountId(), open.ownerName(), open.currency());
        }
        if (command instanceof DepositFunds deposit) {
            return depositFunds(deposit.accountId(), deposit.amount());
        }
        if (command instanceof WithdrawFunds withdraw) {
            return withdrawFunds(withdraw.accountId(), withdraw.amount());
        }
        if (command instanceof CloseAccount close) {
            return closeAccount(close.accountId(), close.reason());
        }
        throw new UnsupportedOperationException(
            "No handler for: " + command.getClass().getSimpleName());
    }

    private CommandResult openAccount(String id, String owner, String currency) {
        System.out.printf("Opening account %s for %s in %s%n", id, owner, currency);
        return CommandResult.success();
    }

    private CommandResult depositFunds(String id, java.math.BigDecimal amount) {
        System.out.printf("Depositing %s into %s%n", amount, id);
        return CommandResult.success();
    }

    private CommandResult withdrawFunds(String id, java.math.BigDecimal amount) {
        System.out.printf("Withdrawing %s from %s%n", amount, id);
        return CommandResult.success();
    }

    private CommandResult closeAccount(String id, String reason) {
        System.out.printf("Closing account %s because: %s%n", id, reason);
        return CommandResult.success();
    }
}

public record CommandResult(boolean success, String message) {
    public static CommandResult success() {
        return new CommandResult(true, "OK");
    }
    public static CommandResult failure(String message) {
        return new CommandResult(false, message);
    }
}
```

### Event Handling

Domain event processing is another natural fit:

```java
public sealed interface DomainEvent
    permits UserRegistered, UserEmailChanged, UserDeactivated {}

public record UserRegistered(String userId, String email, java.time.Instant at)
    implements DomainEvent {}

public record UserEmailChanged(String userId, String oldEmail, String newEmail)
    implements DomainEvent {}

public record UserDeactivated(String userId, String reason)
    implements DomainEvent {}

public class UserEventProjection {

    private final java.util.Map<String, UserView> users = new java.util.HashMap<>();

    public void apply(DomainEvent event) {
        if (event instanceof UserRegistered reg) {
            users.put(reg.userId(),
                new UserView(reg.userId(), reg.email(), true));
        } else if (event instanceof UserEmailChanged change) {
            users.computeIfPresent(change.userId(), (id, view) ->
                new UserView(id, change.newEmail(), view.active()));
        } else if (event instanceof UserDeactivated deactivated) {
            users.computeIfPresent(deactivated.userId(), (id, view) ->
                new UserView(id, view.email(), false));
        }
    }

    public java.util.Optional<UserView> findUser(String userId) {
        return java.util.Optional.ofNullable(users.get(userId));
    }
}

public record UserView(String userId, String email, boolean active) {}
```

---

## 3.11 Performance Considerations: No Overhead vs. Traditional instanceof+cast

A reasonable concern when adopting new syntax is whether it changes performance characteristics. For pattern matching `instanceof`, the answer is no: there is no overhead compared to the traditional `instanceof` plus explicit cast.

The JVM performs a single type check in both cases. The old idiom:

```java
if (shape instanceof Circle) {
    Circle c = (Circle) shape; // second type check at bytecode level
    ...
}
```

actually performed two type checks: one for the `instanceof` and one for the `(Circle)` cast. A JIT compiler could eliminate the redundant check (and virtually always did), but it was redundant at the source level. Pattern matching emits a single `instanceof` check and a single cast, with no null check needed (since `instanceof` already excludes null), resulting in the same or slightly better bytecode footprint.

You can verify this by examining the compiled bytecode. For the pattern matching version, `javap -c` will show an `instanceof` instruction followed by a `checkcast` or an optimized equivalent, exactly as the old idiom produced after JIT elimination. There is no new overhead.

The pattern variable is simply a local variable slot in the stack frame, allocated the same way any local variable is. The binding is as cheap as an assignment.

---

## 3.12 Pattern Matching with Interfaces and Abstract Classes

Pattern matching is not limited to concrete classes. You can match against interfaces and abstract classes exactly as you would with traditional `instanceof`:

```java
public interface Serializable {}
public interface Auditable { java.time.Instant lastModified(); }
public abstract class BaseEntity implements Serializable {
    public abstract String id();
}

public record Order(String id, java.math.BigDecimal total,
                    java.time.Instant lastModified)
    extends BaseEntity implements Auditable {}

public record Customer(String id, String name,
                       java.time.Instant lastModified)
    extends BaseEntity implements Auditable {}

public class AuditLogger {

    public void logIfAuditable(Object entity) {
        if (entity instanceof Auditable auditable) {
            System.out.println("Last modified: " + auditable.lastModified());
        }
    }

    public void logEntityInfo(Object obj) {
        if (obj instanceof BaseEntity entity && obj instanceof Auditable auditable) {
            System.out.printf("Entity %s last modified %s%n",
                entity.id(), auditable.lastModified());
        }
    }

    // More specific dispatch
    public String summarize(Object obj) {
        if (obj instanceof Order o) {
            return "Order " + o.id() + " total=" + o.total();
        }
        if (obj instanceof Customer c) {
            return "Customer " + c.id() + " name=" + c.name();
        }
        if (obj instanceof Auditable a) {
            return "Auditable entity last modified " + a.lastModified();
        }
        return "Unknown entity";
    }
}
```

Note the ordering in `summarize`: more specific types come first. If `Auditable` appeared before `Order`, the `Order` branch would never be reached for `Order` instances, because `Order` implements `Auditable`. This is the same ordering concern as with traditional `instanceof` chains, and it is a motivation for the exhaustiveness checking that `switch` with sealed types provides.

---

## 3.13 Migration Guide: Converting Existing instanceof Chains

Migrating existing code to use pattern matching is mechanical and safe. Here is a systematic approach.

**Step 1: Identify the target pattern.** Look for this structure:

```java
if (x instanceof SomeType) {
    SomeType st = (SomeType) x;
    // use st
}
```

**Step 2: Apply the transformation.** Replace with:

```java
if (x instanceof SomeType st) {
    // use st
}
```

**Step 3: Remove now-unused local variables.** The explicit cast variable is gone; delete it.

**Step 4: Look for scope-narrowing opportunities.** If the local variable was used only within the branch, the scope is already correct. If it was referenced later in the method in a way that should not compile post-migration, that is a code smell worth fixing.

Consider this before-and-after of a real-world configuration reader:

```java
// BEFORE: Classic instanceof-cast idiom
public String renderConfigValue(ConfigValue value) {
    String result;
    if (value instanceof StringValue) {
        StringValue sv = (StringValue) value;
        result = sv.get();
    } else if (value instanceof IntValue) {
        IntValue iv = (IntValue) value;
        result = String.valueOf(iv.get());
    } else if (value instanceof BooleanValue) {
        BooleanValue bv = (BooleanValue) value;
        result = bv.get() ? "true" : "false";
    } else if (value instanceof ListValue) {
        ListValue lv = (ListValue) value;
        result = lv.items().stream()
                   .map(this::renderConfigValue)
                   .collect(java.util.stream.Collectors.joining(", ", "[", "]"));
    } else {
        result = "<unknown>";
    }
    return result;
}

// AFTER: Pattern matching
public String renderConfigValue(ConfigValue value) {
    if (value instanceof StringValue sv) {
        return sv.get();
    } else if (value instanceof IntValue iv) {
        return String.valueOf(iv.get());
    } else if (value instanceof BooleanValue bv) {
        return bv.get() ? "true" : "false";
    } else if (value instanceof ListValue lv) {
        return lv.items().stream()
                  .map(this::renderConfigValue)
                  .collect(java.util.stream.Collectors.joining(", ", "[", "]"));
    }
    return "<unknown>";
}
```

The `result` accumulator variable is gone. Each branch returns directly. The method is shorter, the logic is clearer, and the scope of each pattern variable is minimal.

**Step 5: Consider a future switch migration.** If the type hierarchy is sealed or logically closed, mark the migration for a follow-up pass when you adopt Java 21+ features. The `instanceof` chain converts cleanly to a `switch` expression with exhaustiveness checking.

**Automated migration.** Both IntelliJ IDEA and Eclipse offer automated inspections and quick-fixes for this transformation. The IntelliJ inspection "Pattern variable can be used" will highlight all eligible `instanceof`-cast idioms and offer a one-keystroke replacement. Use it as a discovery tool in large codebases, but review each transformation: occasionally the existing variable name is intentionally different from what the automated tool would choose, or the scope change matters.

---

## 3.14 Summary

Pattern matching for `instanceof` (JEP 394) is a focused, well-designed language feature that eliminates a specific and pervasive source of verbosity and error in Java code. Key takeaways:

- **Pattern variables** combine a type test and a binding into a single syntactic construct, removing the redundant explicit cast that the compiler previously required.

- **Scope rules** are based on definite assignment and flow-sensitive typing. Pattern variables are available only where the compiler can prove the match succeeded. This prevents a new class of variable misuse bugs.

- **`&&` extends scope** into the right operand because short-circuit evaluation guarantees the match holds there. `||` does not extend scope into the right operand because the right is evaluated when the left fails.

- **Negation** (`!`) and early return allow the guard-clause pattern, making pattern matching idiomatic for precondition checking.

- **Null** is never matched by any type pattern, preserving `instanceof`'s existing null-safe semantics.

- **Generics and erasure** limit type patterns to reifiable types. Use `List<?>` and similar wildcards to match generic containers.

- **No performance overhead**: pattern matching compiles to equivalent bytecode as the traditional idiom, with no additional runtime cost.

- **Migration is mechanical** and is supported by IDE quick-fixes. Prioritize methods with multiple `instanceof`-cast idioms for the highest readability gain.

Pattern matching for `instanceof` is the first step. Its scope rules, syntax, and semantics form the foundation for pattern matching in `switch` (Chapter 6), record patterns (Chapter 7), and the fully compositional pattern matching arriving in Java 25. The investment in understanding these fundamentals now will pay dividends throughout the rest of this book.

---

*Chapter 4 continues with Text Blocks, another Java 17 cornerstone feature that addresses a different but equally pervasive source of Java verbosity.*


# Chapter 4: Text Blocks in Depth

Text blocks (JEP 378, finalized in Java 15 and present in Java 17) seem simple at first glance — they're just multi-line strings with nicer syntax. But there's genuine depth here: the indentation algorithm, the escape sequences, and the compositional patterns make text blocks a powerful tool that experienced developers should fully understand, not just skim.

---

## 4.1 String Literals Before Text Blocks: The Escape Hell

Before text blocks, embedding structured text in Java code was painful:

```java
// Embedding JSON: escape every quote, add \n, concatenate
String json = "{\n" +
              "  \"customerId\": \"" + customerId + "\",\n" +
              "  \"items\": [\n" +
              "    {\"productId\": \"" + productId + "\", \"qty\": " + qty + "}\n" +
              "  ]\n" +
              "}";

// Embedding SQL: same problem, harder to read
String sql = "SELECT o.id, o.created_at, c.name, c.email\n" +
             "FROM orders o\n" +
             "JOIN customers c ON o.customer_id = c.id\n" +
             "WHERE o.status = 'PENDING'\n" +
             "  AND o.created_at > ?\n" +
             "ORDER BY o.created_at DESC\n" +
             "LIMIT 100";
```

This code is technically correct but visually miserable. Every double-quote must be escaped, every newline is explicit, and the actual structure of the embedded text is obscured by Java syntax noise.

---

## 4.2 Syntax: The Triple-Quote Delimiter

A text block begins with `"""` followed by optional whitespace and a newline, and ends with `"""`:

```java
// The opening """ MUST be followed by a newline
String json = """
        {
          "customerId": "C-001",
          "status": "ACTIVE"
        }
        """;
```

Key rules:
- The opening `"""` cannot be followed by content on the same line
- The closing `"""` determines the indentation baseline (see Section 4.3)
- The result is a `String` — no new type, fully compatible everywhere a `String` is accepted

With text blocks, our SQL query becomes:

```java
String sql = """
        SELECT o.id, o.created_at, c.name, c.email
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.status = 'PENDING'
          AND o.created_at > ?
        ORDER BY o.created_at DESC
        LIMIT 100
        """;
```

---

## 4.3 Incidental vs Essential Whitespace: The Indentation Algorithm

This is the most important and least-understood aspect of text blocks. The compiler distinguishes between:

- **Incidental whitespace**: indentation added to align the text block with the surrounding code
- **Essential whitespace**: whitespace that is actually part of the string content

The algorithm determines the "common leading whitespace prefix" and strips it from every line. The **position of the closing `"""`** is the key:

```java
// Case 1: closing """ on its own line at column 8
// All 8 leading spaces are stripped
String a = """
        Hello
        World
        """;
// Result: "Hello\nWorld\n"

// Case 2: closing """ at column 0 — no stripping
String b = """
        Hello
        World
""";
// Result: "        Hello\n        World\n"

// Case 3: closing """ inline with content
String c = """
        Hello
        World""";
// Result: "        Hello\n        World"  (no trailing newline!)
```

The practical pattern: **put the closing `"""` on its own line, indented to the same level as the content**. This gives you clean, unpadded content:

```java
public String buildQuery(String tableName) {
    return """
            SELECT *
            FROM %s
            WHERE active = true
            """.formatted(tableName);
    // Result: "SELECT *\nFROM %s\nWHERE active = true\n"
    // (leading 12 spaces stripped, matching the closing """ position)
}
```

---

## 4.4 Line Terminator Handling

Text blocks always normalize line endings to `\n` (LF) regardless of the platform. This is critical for cross-platform consistency:

```java
// Always LF, even on Windows
String block = """
        line one
        line two
        """;
assert block.equals("line one\nline two\n");
```

If you need Windows-style line endings (CRLF) in the text block output, use the `\r` escape explicitly:

```java
String withCRLF = """
        line one\r
        line two\r
        """;
```

---

## 4.5 New Escape Sequences: `\<line-terminator>` and `\s`

Java 14+ added two new escape sequences specifically for text blocks:

### `\` — line continuation (suppress newline)

```java
// Without line continuation: a newline after each line
String withNewlines = """
        The quick brown fox
        jumps over the lazy dog
        """;
// "The quick brown fox\njumps over the lazy dog\n"

// With \: suppress the newline, logically join lines
String singleLine = """
        The quick brown fox \
        jumps over the lazy dog
        """;
// "The quick brown fox jumps over the lazy dog\n"
```

This is useful when a string is logically a single line but you want to break it for readability.

### `\s` — explicit space (preserve trailing whitespace)

The compiler strips trailing whitespace from each line by default. `\s` represents a space and prevents stripping of whitespace to its left:

```java
// Trailing spaces stripped:
String padded = """
        red
        green
        blue
        """;
// "red\ngreen\nblue\n"  (trailing spaces gone)

// \s preserves trailing spaces:
String preserved = """
        red  \s
        green\s
        blue \s
        """;
// "red   \ngreen \nblue  \n"  (spaces before \s are preserved)
```

This is useful when the text block content is used in contexts where precise spacing matters (protocol messages, fixed-width formats).

---

## 4.6 Text Blocks for Common Data Formats

### JSON

```java
record CreateUserRequest(String name, String email, String role) {
    String toJson() {
        return """
                {
                  "name": "%s",
                  "email": "%s",
                  "role": "%s"
                }
                """.formatted(name, email, role);
    }
}

// Usage in tests: expected JSON for assertion
String expectedJson = """
        {
          "id": "U-001",
          "name": "Alice",
          "status": "ACTIVE"
        }
        """;
```

### SQL

```java
String findActiveOrdersSql = """
        SELECT
            o.id          AS order_id,
            o.created_at  AS placed_at,
            c.name        AS customer_name,
            SUM(oi.price * oi.quantity) AS total
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status IN ('PENDING', 'CONFIRMED')
          AND o.created_at BETWEEN :from AND :to
        GROUP BY o.id, o.created_at, c.name
        ORDER BY o.created_at DESC
        """;
```

### HTML

```java
String emailBody(String name, String confirmationLink) {
    return """
            <!DOCTYPE html>
            <html lang="en">
            <body>
              <h1>Welcome, %s!</h1>
              <p>Please confirm your email:</p>
              <a href="%s">Confirm Email</a>
            </body>
            </html>
            """.formatted(name, confirmationLink);
}
```

### XML / YAML

```java
String kubernetesDeployment(String appName, String image, int replicas) {
    return """
            apiVersion: apps/v1
            kind: Deployment
            metadata:
              name: %s
            spec:
              replicas: %d
              template:
                spec:
                  containers:
                  - name: %s
                    image: %s
            """.formatted(appName, replicas, appName, image);
}
```

---

## 4.7 Text Blocks in String.formatted() and String Methods

Text blocks are `String` instances and work with all `String` methods:

```java
// String.formatted() — Java 15+ instance method (cleaner than String.format())
String greeting = """
        Dear %s,

        Your order #%s has been shipped.
        Expected delivery: %s

        Thank you for shopping with us.
        """.formatted(customerName, orderId, deliveryDate);

// String.stripIndent() — manual indentation stripping (for dynamically built strings)
String dynamic = "\t\tline one\n\t\tline two\n";
System.out.println(dynamic.stripIndent()); // "line one\nline two\n"

// String.translateEscapes() — process escape sequences in dynamically built strings
String withEscape = "Hello\\nWorld";
System.out.println(withEscape.translateEscapes()); // "Hello\nWorld"
```

---

## 4.8 Text Blocks in Test Code

Text blocks shine brightest in test code — expected values become readable:

```java
@Test
void shouldReturnJsonRepresentation() {
    var user = new User("U-001", "Alice", "alice@example.com");

    String actualJson = userSerializer.toJson(user);

    String expectedJson = """
            {
              "id": "U-001",
              "name": "Alice",
              "email": "alice@example.com"
            }
            """.stripTrailing();  // Remove trailing newline if needed

    assertThat(actualJson).isEqualToIgnoringWhitespace(expectedJson);
}

@Test
void shouldExecuteCorrectQuery() {
    String expectedSql = """
            SELECT u.id, u.name
            FROM users u
            WHERE u.active = true
            """;

    verify(jdbcTemplate).query(
        eq(expectedSql.strip()),
        any(RowMapper.class)
    );
}
```

---

## 4.9 Multi-Line String Alignment Strategies

Sometimes you need the text block to align differently from the enclosing code:

```java
class EmailBuilder {
    // The text block content will be aligned to the left margin
    // even though the class is indented
    String buildTemplate() {
        return """
                Subject: Your Order Update

                Dear Customer,

                Your order has been processed.
                """;
        // With 16-space indentation, that's stripped off.
        // Result starts with "Subject: Your Order Update\n..."
    }
}
```

For multi-level indentation within the text block itself (e.g., JSON with nested objects), the indentation within the block is preserved as *essential* whitespace:

```java
String nestedJson = """
        {
          "order": {
            "id": "O-001",
            "items": [
              {"sku": "A1", "qty": 2},
              {"sku": "B2", "qty": 1}
            ]
          }
        }
        """;
// The internal 2-space and 4-space indentation is preserved
```

---

## 4.10 Common Pitfalls

### Trailing whitespace invisibility

IDE auto-formatters often strip trailing whitespace. If your text block content requires trailing spaces, use `\s` to prevent accidental stripping.

### The closing `"""` position matters enormously

```java
// Common mistake: closing """ at column 0 adds unwanted indentation
String bad = """
    hello
    world
""";
// Includes 4 leading spaces on each line! "    hello\n    world\n"

// Correct: closing """ matches content indentation
String good = """
    hello
    world
    """;
// "hello\nworld\n"
```

### No trailing newline when closing `"""` is inline

```java
String noTrailingNewline = """
        content""";
// "content" — no trailing \n

String withTrailingNewline = """
        content
        """;
// "content\n" — trailing \n present
```

Be consistent: most callers don't care about a trailing newline, but SQL drivers and JSON parsers might. Use `.strip()` when in doubt.

### Windows CRLF in source files

If your source file uses CRLF line endings (Windows default), the text block content will still be normalized to LF — the compiler does this. This is almost always correct behavior.

---

## 4.11 Summary

Text blocks are a straightforward but nuanced addition to Java's string handling:

- **Eliminate escape noise** for multi-line JSON, SQL, HTML, XML, YAML, and other structured formats
- **The indentation algorithm** strips common leading whitespace; the closing `"""` position controls the baseline
- **New escape sequences**: `\` for line continuation, `\s` for explicit space preservation
- **Work seamlessly with `String.formatted()`** for interpolation
- **Most impactful in test code**, where expected values become readable documentation

Adopt text blocks aggressively. Any time you find yourself concatenating strings with `\n` and `\"` for structured text, a text block will improve both readability and maintainability.


# Chapter 5: Switch Expressions and Pattern Matching for Switch

> **JEP 361** (finalized, Java 14) · **JEP 406** (preview, Java 17) · **JEP 420** (second preview, Java 18) · **JEP 441** (finalized, Java 21)

The `switch` construct has undergone the most dramatic evolution of any language feature in the history of Java. From a humble C-derived statement plagued by fall-through bugs to a fully expressive pattern-matching expression capable of replacing cascading `instanceof` chains, the modern `switch` is a first-class citizen of idiomatic Java. This chapter traces that evolution in full, from the failings of the classic statement to the exhaustive, type-safe pattern matching finalized in Java 21.

---

## 5.1 The Classic Switch Statement: Limitations and Fall-through Traps

For the better part of three decades, Java's `switch` statement carried the same semantics it inherited from C: execution enters at the matching `case` label and continues sequentially through every subsequent case until it hits an explicit `break` or the end of the block. This "fall-through" behavior is occasionally useful — grouping multiple values that share identical logic — but it is far more often the source of subtle, hard-to-diagnose bugs.

Consider the canonical footgun:

```java
// Example 5.1 — Classic fall-through bug
int day = 3;
String type;

switch (day) {
    case 1:
        type = "Monday";    // intended: set type and stop
    case 2:
        type = "Tuesday";   // fall-through: overwrites the assignment above
    case 3:
        type = "Wednesday";
        break;
    default:
        type = "Other";
}
System.out.println(type); // "Wednesday" even when day == 1
```

The omitted `break` on `case 1` is silent: the compiler issues no warning by default, and the test suite may not catch it until a production incident. Static analysis tools help, but the language itself bears no responsibility.

Beyond the fall-through problem, the classic `switch` statement carried three additional limitations that became increasingly painful as Java evolved toward functional idioms:

1. **No expression semantics.** A `switch` statement cannot appear on the right-hand side of an assignment or be used as a method argument. Every branch must independently assign to a pre-declared variable, leading to verbose patterns where a `final` local variable cannot be initialized from a switch without surrendering its `final`-ness or resorting to a helper method.

2. **Limited selector types.** Before Java 7, only integral types were supported. Java 7 added `String` support, but `float`, `double`, `boolean`, and arbitrary objects remained forbidden until the pattern-matching extensions arrived.

3. **No compile-time exhaustiveness.** A `switch` statement over an `enum` with no `default` branch compiles happily even when cases are missing. The compiler may emit an optional warning, but the program silently does nothing when control reaches a missing case.

These limitations were not merely inconveniences. They actively pushed developers toward `if-else` chains that are less readable and harder to optimize. The JDK team recognized this and began addressing it systematically, starting with switch expressions in JEP 361.

---

## 5.2 Switch Expressions (JEP 361): Arrow Labels and `yield`

JEP 361, finalized in Java 14 after preview periods in Java 12 and 13, introduced two critical innovations:

- **Switch expressions**: a `switch` construct that produces a value
- **Arrow labels** (`case X ->`): a non-fall-through, concise form of case label

Arrow labels are the simpler change to grasp. Each `case X -> expression` arm is self-contained: only the expression or block on the right-hand side of the arrow executes. There is no fall-through to the next arm, no `break` required, and no implicit sequencing.

```java
// Example 5.2 — Switch expression with arrow labels
int day = 3;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    case 6 -> "Saturday";
    case 7 -> "Sunday";
    default -> throw new IllegalArgumentException("Invalid day: " + day);
};
System.out.println(dayName); // "Wednesday"
```

Several points merit attention. The entire `switch` block is an expression: it yields a value (a `String` here) that is directly assigned to `dayName`. The `default` arm throws an exception, which is legal — an expression arm may be a `throw` statement. The variable `dayName` can be declared `final` because the switch expression initializes it in a single, definitive evaluation.

Multiple labels can share a single arm using a comma-separated list:

```java
// Example 5.3 — Multiple labels per arrow arm
String season = switch (month) {
    case 12, 1, 2  -> "Winter";
    case 3, 4, 5   -> "Spring";
    case 6, 7, 8   -> "Summer";
    case 9, 10, 11 -> "Autumn";
    default        -> throw new IllegalArgumentException("month=" + month);
};
```

This replaces what previously required either multiple fall-through `case` labels with shared `break` points or a `Map` lookup — a significant readability win.

---

## 5.3 Switch Expressions vs. Switch Statements: When to Use Which

The introduction of switch expressions does not deprecate switch statements. Both forms remain valid Java, and understanding when to reach for each is an important part of mastering modern Java.

**Use a switch expression** when:

- The switch arms each produce a value and you want to capture that value.
- You want the compiler to enforce exhaustiveness (see Section 5.5).
- The arms are pure computations with no side effects: domain translations, category lookups, state machine transitions that return a new state.

**Use a switch statement** when:

- The switch arms perform side-effectful operations: writing to a database, publishing an event, updating mutable state.
- Not every arm needs to produce the same type of value.
- You genuinely need fall-through behavior (rare, but it still exists in the colon-label form of switch expressions too, though it is discouraged).

```java
// Example 5.4 — Switch statement is appropriate for side effects
switch (event.type()) {
    case ORDER_PLACED   -> orderService.reserve(event.orderId());
    case ORDER_CANCELLED -> orderService.release(event.orderId());
    case ORDER_SHIPPED  -> notificationService.notifyShipped(event.orderId());
    default             -> log.warn("Unknown event type: {}", event.type());
}
```

Note that arrow labels are also valid in switch statements; they eliminate fall-through while keeping the statement semantics (no value produced). This is the preferred style for all new switch statements — the old colon-label form should be reserved for the rare situation where intentional fall-through is required, and that intent should be documented with a `// falls through` comment.

---

## 5.4 Returning Values from Switch: The `yield` Keyword

When a switch expression arm requires more than a single expression — when you need local variables, loops, or conditional logic inside the arm — you use a block arm combined with the `yield` keyword:

```java
// Example 5.5 — Block arms and yield
double discountedPrice = switch (customer.tier()) {
    case GOLD -> {
        double base = product.price();
        double discount = base * 0.20;
        yield base - discount;
    }
    case SILVER -> {
        double base = product.price();
        double discount = base * 0.10;
        yield base - discount;
    }
    case BRONZE -> product.price() * 0.95;
    case STANDARD -> product.price();
};
```

The `yield` statement exits the block arm and provides the value of the entire switch expression. It is not a general `return`; it only works inside a switch expression arm. This distinction matters: `yield` does not exit the enclosing method, and its scope is strictly the switch expression.

The keyword `yield` was chosen carefully. Because `yield` was not a reserved keyword before Java 14, existing code using `yield` as an identifier continues to compile — the keyword is context-sensitive. The compiler distinguishes `yield(value)` (a method call to a hypothetical `yield` method) from the `yield value;` statement by examining the syntactic context.

```java
// Example 5.6 — yield is context-sensitive; this still compiles in Java 17
int yield = 42;             // local variable named yield — valid
int result = switch (x) {
    case 0 -> yield;        // expression arm: returns the local variable yield
    default -> {
        yield yield + 1;    // block arm: yields the value of (yield + 1)
    }
};
```

While this compiles, naming a variable `yield` is confusing and should be avoided in new code.

---

## 5.5 Exhaustiveness in Switch Expressions

Switch expressions impose a constraint that switch statements do not: the compiler requires the switch to be **exhaustive** — every possible value of the selector must be covered. This is checked at compile time, and failure to cover all cases is a compile error, not a warning.

For primitive selectors and `String`, a `default` arm satisfies exhaustiveness trivially. The real benefit emerges with `enum` types:

```java
// Example 5.7 — Enum exhaustiveness
enum Status { PENDING, ACTIVE, SUSPENDED, CLOSED }

String label = switch (status) {
    case PENDING   -> "Awaiting activation";
    case ACTIVE    -> "Operational";
    case SUSPENDED -> "Temporarily unavailable";
    case CLOSED    -> "Account closed";
    // No default needed: all enum constants are covered
};
```

If you add a new constant to `Status` — say, `ARCHIVED` — the compiler immediately flags all switch expressions over `Status` that lack coverage, turning a runtime oversight into a compile-time error. This is a profound advantage over the equivalent `if-else` chain or `Map`-based dispatch, where a missing entry silently does nothing at runtime.

The exhaustiveness guarantee is an opt-in: switch statements over enums do not require exhaustiveness. Only switch expressions do. This asymmetry is intentional — it preserves backward compatibility while offering stronger guarantees when you choose the expression form.

---

## 5.6 Pattern Matching for Switch (JEP 406 — Preview in Java 17)

JEP 406, previewed in Java 17, extended the switch selector from the narrow set of integral types, strings, and enums to **any reference type**, and extended the case labels from constants to **patterns**. This is the cornerstone of modern Java's type-safe dispatch mechanism.

To compile preview features in Java 17, you must pass the `--enable-preview` flag to both `javac` and `java`:

```bash
# Compiling with preview features enabled (Java 17)
javac --enable-preview --release 17 PatternSwitch.java

# Running the compiled class
java --enable-preview PatternSwitch
```

With pattern matching for switch, you can dispatch on the dynamic type of an object in a single, readable construct:

```java
// Example 5.8 — Pattern matching for switch (preview in Java 17)
// Compile with: javac --enable-preview --release 17
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
record Triangle(double base, double height) implements Shape {}

double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.width() * r.height();
        case Triangle t  -> 0.5 * t.base() * t.height();
    };
}
```

Compare this to the pre-Java 17 equivalent:

```java
// Before pattern matching — verbose and error-prone
double area(Shape shape) {
    if (shape instanceof Circle c) {
        return Math.PI * c.radius() * c.radius();
    } else if (shape instanceof Rectangle r) {
        return r.width() * r.height();
    } else if (shape instanceof Triangle t) {
        return 0.5 * t.base() * t.height();
    } else {
        throw new IllegalArgumentException("Unknown shape: " + shape);
    }
}
```

The switch version is not just more concise; it is semantically richer. The compiler can verify exhaustiveness for sealed types (as discussed in Section 5.10), eliminating the defensive `else` branch entirely.

---

## 5.7 Type Patterns in Switch

A **type pattern** in a `case` label consists of a type and a binding variable: `case SomeType varName`. When the selector matches the pattern, `varName` is bound to the selector value cast to `SomeType`, and the binding is in scope for the arm's expression or block.

```java
// Example 5.9 — Type patterns with multiple reference types (Java 21+)
Object serialize(Object value) {
    return switch (value) {
        case Integer i    -> "INT:" + i;
        case Long l       -> "LONG:" + l;
        case Double d     -> "DBL:" + String.format("%.4f", d);
        case String s     -> "STR:" + s.length() + ":" + s;
        case int[] arr    -> "INT_ARR[" + arr.length + "]";
        case null         -> "NULL";
        default           -> "OBJ:" + value.getClass().getSimpleName();
    };
}
```

Type patterns in switch follow the same dominance rules as patterns in `instanceof`: a more specific pattern must appear before a more general one, or the compiler reports a dominance error.

```java
// Example 5.10 — Dominance ordering (Java 21+)
String describe(Number n) {
    return switch (n) {
        case Integer i -> "integer: " + i;       // must precede Number
        case Long l    -> "long: " + l;
        case Number x  -> "other number: " + x;  // catches Float, Double, etc.
    };
}
// ERROR if you swap Number and Integer: case Integer i would be unreachable
```

---

## 5.8 Guarded Patterns with `when` Clauses (Java 21 Final Syntax)

Pattern matching for switch is most powerful when combined with additional boolean guards. In the final Java 21 syntax (JEP 441), guards are expressed with a `when` clause appended to the pattern:

```java
// Example 5.11 — Guarded patterns with when (Java 21, finalized)
String classify(Object obj) {
    return switch (obj) {
        case Integer i when i < 0       -> "negative integer";
        case Integer i when i == 0      -> "zero";
        case Integer i                  -> "positive integer";
        case String s when s.isEmpty()  -> "empty string";
        case String s                   -> "non-empty string: " + s;
        case null                       -> "null";
        default                         -> "other: " + obj.getClass().getSimpleName();
    };
}
```

The `when` clause is evaluated only after the type test succeeds. The binding variable introduced by the pattern is in scope within the `when` expression, enabling precise sub-classification without nested `if` statements.

Note that during the preview period in Java 17 and 18, guards used the `&&` syntax: `case Integer i && i < 0`. The `when` keyword replaced this in Java 19 preview and was finalized in Java 21. When reading older code or preview-era tutorials, be aware of this syntactic difference.

```java
// Example 5.12 — Preview-era syntax (Java 17/18 ONLY — do not use in Java 21+)
// Compile with: javac --enable-preview --release 17
String oldSyntax(Object obj) {
    return switch (obj) {
        case Integer i && i > 0 -> "positive";    // old guard syntax
        case Integer i          -> "non-positive";
        default                 -> "not an integer";
    };
}
```

---

## 5.9 Null Handling in Switch

Historically, passing `null` to a switch statement caused a `NullPointerException` at runtime. This was a consistent source of defensive null checks surrounding switch blocks. Pattern matching for switch (finalized in Java 21) addresses this directly by allowing a `case null` arm:

```java
// Example 5.13 — Null handling in switch (Java 21+)
void process(String command) {
    switch (command) {
        case null            -> System.out.println("No command provided");
        case "start"         -> startService();
        case "stop"          -> stopService();
        case "restart"       -> { stopService(); startService(); }
        default              -> System.out.println("Unknown command: " + command);
    }
}
```

Without the `case null` arm, passing `null` still throws `NullPointerException`. The `case null` arm must be handled explicitly — the compiler does not insert implicit null handling. This design preserves backward compatibility: existing switches without `case null` throw `NullPointerException` for null selectors, exactly as before.

`case null` can also be combined with `default`:

```java
// Example 5.14 — Combining null and default
String normalize(String input) {
    return switch (input) {
        case "yes", "y", "true", "1" -> "true";
        case "no", "n", "false", "0" -> "false";
        case null, default           -> "unknown";
    };
}
```

---

## 5.10 Combining Switch with Sealed Classes: Exhaustiveness Guarantee

Sealed classes (JEP 409, finalized in Java 17) and pattern matching for switch are designed to work together. When a sealed interface or class is the selector type, the compiler knows the complete set of permitted subtypes and can verify that all of them are covered without requiring a `default` arm.

```java
// Example 5.15 — Sealed hierarchy with exhaustive switch (Java 21+)
sealed interface Expr
    permits Literal, Add, Multiply, Negate {}

record Literal(double value)              implements Expr {}
record Add(Expr left, Expr right)         implements Expr {}
record Multiply(Expr left, Expr right)    implements Expr {}
record Negate(Expr expr)                  implements Expr {}

double evaluate(Expr expr) {
    return switch (expr) {
        case Literal(double v)          -> v;
        case Add(Expr l, Expr r)        -> evaluate(l) + evaluate(r);
        case Multiply(Expr l, Expr r)   -> evaluate(l) * evaluate(r);
        case Negate(Expr e)             -> -evaluate(e);
        // No default needed: sealed hierarchy is fully covered
    };
}
```

Note that the `case Literal(double v)` syntax uses **record deconstruction patterns**, which are part of JEP 440 (finalized in Java 21). We cover these in detail in Section 5.11.

The key implication for software design is powerful: **you can model variant types in Java using sealed interfaces and pattern-matched switch expressions, obtaining the same structural guarantees as algebraic data types in functional languages**. Adding a new permitted subtype to the sealed interface breaks all exhaustive switches at compile time, forcing you to handle the new case explicitly. This is the closest Java has come to the "make illegal states unrepresentable" principle that Haskell and Rust developers rely on.

If you do add a `default` arm to a switch over a sealed type, the compiler's exhaustiveness checking is satisfied but the compile-time guarantee is lost: the `default` arm silently absorbs any new subtypes you add later.

---

## 5.11 Switch with Records and Deconstruction (Preview Path)

Record patterns, finalized in Java 21 (JEP 440), allow case labels to destructure record instances directly, binding the record's components to named variables:

```java
// Example 5.16 — Record patterns in switch (Java 21+)
sealed interface JsonValue
    permits JsonNull, JsonBool, JsonNumber, JsonString, JsonArray, JsonObject {}

record JsonNull()                        implements JsonValue {}
record JsonBool(boolean value)           implements JsonValue {}
record JsonNumber(double value)          implements JsonValue {}
record JsonString(String value)          implements JsonValue {}
record JsonArray(List<JsonValue> items)  implements JsonValue {}
record JsonObject(Map<String,JsonValue> fields) implements JsonValue {}

String toYaml(JsonValue val) {
    return switch (val) {
        case JsonNull()              -> "null";
        case JsonBool(boolean b)     -> b ? "true" : "false";
        case JsonNumber(double d)    -> Double.toString(d);
        case JsonString(String s)    -> "\"" + s + "\"";
        case JsonArray(var items)    -> items.stream()
                                            .map(v -> "- " + toYaml(v))
                                            .collect(Collectors.joining("\n"));
        case JsonObject(var fields)  -> fields.entrySet().stream()
                                            .map(e -> e.getKey() + ": " + toYaml(e.getValue()))
                                            .collect(Collectors.joining("\n"));
    };
}
```

Record patterns can be nested, enabling deep structural matching:

```java
// Example 5.17 — Nested record patterns (Java 21+)
record Point(double x, double y) {}
record Line(Point start, Point end) {}

String describeLine(Line line) {
    return switch (line) {
        case Line(Point(double x1, double y1), Point(double x2, double y2))
            when x1 == x2 -> "vertical line at x=" + x1;
        case Line(Point(double x1, double y1), Point(double x2, double y2))
            when y1 == y2 -> "horizontal line at y=" + y1;
        case Line(Point p1, Point p2) ->
            String.format("diagonal from (%.1f,%.1f) to (%.1f,%.1f)",
                p1.x(), p1.y(), p2.x(), p2.y());
    };
}
```

Nested record patterns are an area of active evolution. In Java 25, further refinements to deconstruction are expected, particularly for generics and primitive patterns. Watch this space closely.

---

## 5.12 Performance: Switch vs. If-Else Chains

A common question from experienced Java engineers is whether the more expressive modern switch comes at a performance cost. The answer is nuanced, and understanding it requires knowing how the JVM translates switch constructs at the bytecode level.

**Classic integer switch statements** compile to either `tableswitch` (for dense integer ranges) or `lookupswitch` (for sparse integer sets). Both are O(1) or O(log n) operations respectively — significantly faster than a linear `if-else` chain for many values.

**Switch expressions with arrow labels** compile to the same `tableswitch`/`lookupswitch` bytecodes as classic switch statements when the selector is an integral type or enum. There is no runtime overhead from adopting the expression form.

**Pattern-matching switch** is more complex. Because the JVM's bytecode does not natively support type-pattern dispatch, the compiler generates type tests (`instanceof` checks) under the hood, which the JIT compiler then optimizes aggressively. In practice, for small numbers of alternatives (fewer than ~10), the performance of pattern-matching switch is indistinguishable from a hand-written `if-else instanceof` chain. For larger alternatives, the switch form may be faster due to JIT-level dispatch table optimizations.

```java
// Example 5.18 — Microbenchmark structure (JMH, illustrative)
// To benchmark properly, use JMH. This is the structure:
@Benchmark
public String switchPatternMatch(BenchmarkState state) {
    return switch (state.nextObject()) {
        case Integer i -> "int:" + i;
        case Long l    -> "long:" + l;
        case String s  -> "str:" + s;
        default        -> "other";
    };
}

@Benchmark
public String ifElseChain(BenchmarkState state) {
    Object obj = state.nextObject();
    if (obj instanceof Integer i) return "int:" + i;
    if (obj instanceof Long l)    return "long:" + l;
    if (obj instanceof String s)  return "str:" + s;
    return "other";
}
```

In JMH benchmarks run on Java 21, pattern-matching switch and equivalent `if-else instanceof` chains perform within 2-5% of each other, well within the noise floor for most applications. **Prefer switch for readability and correctness guarantees; resort to performance profiling only if measurements indicate a bottleneck.**

---

## 5.13 Real-World Use: Command Processors, Parsers, State Machines

The practical value of modern switch emerges most clearly in three canonical domains: command dispatch, data format translation, and finite state machines.

**Command Processors**

A typical command-line or message-driven application receives commands as records or sealed types and dispatches them to handlers:

```java
// Example 5.19 — Command processor with sealed interface
sealed interface Command permits
    CreateUser, UpdateEmail, DeleteUser, ListUsers {}

record CreateUser(String username, String email) implements Command {}
record UpdateEmail(long userId, String newEmail)  implements Command {}
record DeleteUser(long userId)                    implements Command {}
record ListUsers(int page, int pageSize)          implements Command {}

CommandResult dispatch(Command cmd) {
    return switch (cmd) {
        case CreateUser(String name, String email) ->
            userService.create(name, email);
        case UpdateEmail(long id, String email) ->
            userService.updateEmail(id, email);
        case DeleteUser(long id) ->
            userService.delete(id);
        case ListUsers(int page, int size) ->
            userService.list(page, size);
    };
}
```

The compiler guarantees that every command type is handled. Adding a new command type without updating `dispatch` is a compile error.

**Expression Parsers / Interpreters**

Recursive interpreters for expression trees are a classic use case for structural dispatch:

```java
// Example 5.20 — AST interpreter (Java 21+)
sealed interface Statement permits
    Assignment, Print, IfStatement, Block {}

record Assignment(String var, Expr value) implements Statement {}
record Print(Expr value)                  implements Statement {}
record IfStatement(Expr cond, Statement then, Statement else_) implements Statement {}
record Block(List<Statement> stmts)       implements Statement {}

void execute(Statement stmt, Map<String, Object> env) {
    switch (stmt) {
        case Assignment(String var, Expr val) ->
            env.put(var, evaluate(val, env));
        case Print(Expr val) ->
            System.out.println(evaluate(val, env));
        case IfStatement(Expr cond, Statement then, Statement else_) -> {
            boolean test = (boolean) evaluate(cond, env);
            execute(test ? then : else_, env);
        }
        case Block(List<Statement> stmts) ->
            stmts.forEach(s -> execute(s, env));
    }
}
```

**State Machines**

Event-driven state machines benefit from the combination of exhaustiveness checking and pattern matching:

```java
// Example 5.21 — Order state machine (Java 21+)
sealed interface OrderEvent permits
    PaymentReceived, ItemShipped, DeliveryConfirmed, Cancelled {}

record PaymentReceived(String txId)      implements OrderEvent {}
record ItemShipped(String trackingCode)  implements OrderEvent {}
record DeliveryConfirmed(Instant time)   implements OrderEvent {}
record Cancelled(String reason)          implements OrderEvent {}

enum OrderState { PENDING, PAID, SHIPPED, DELIVERED, CANCELLED }

OrderState transition(OrderState current, OrderEvent event) {
    return switch (current) {
        case PENDING -> switch (event) {
            case PaymentReceived p -> {
                log.info("Payment {}", p.txId());
                yield OrderState.PAID;
            }
            case Cancelled c -> OrderState.CANCELLED;
            default          -> throw new IllegalStateException(
                "Event " + event + " invalid in PENDING state");
        };
        case PAID -> switch (event) {
            case ItemShipped s -> {
                log.info("Shipped: {}", s.trackingCode());
                yield OrderState.SHIPPED;
            }
            case Cancelled c -> OrderState.CANCELLED;
            default          -> throw new IllegalStateException(
                "Event " + event + " invalid in PAID state");
        };
        case SHIPPED -> switch (event) {
            case DeliveryConfirmed d -> {
                log.info("Delivered at {}", d.time());
                yield OrderState.DELIVERED;
            }
            default -> throw new IllegalStateException(
                "Event " + event + " invalid in SHIPPED state");
        };
        case DELIVERED, CANCELLED ->
            throw new IllegalStateException(
                "No transitions from terminal state " + current);
    };
}
```

This nested switch construction makes every valid state/event combination explicit. The compiler ensures the outer switch is exhaustive over `OrderState`. You retain full type safety — `event` inside each inner switch is still the sealed `OrderEvent` type, and the inner switches can also be made exhaustive by covering all event types.

---

## 5.14 Summary

The evolution of `switch` from Java 1 to Java 21 represents one of the most carefully designed feature progressions in the language's history. The changes arrived incrementally, each building on the last:

- **Switch expressions (JEP 361, Java 14)** eliminated fall-through from the happy path with arrow labels, enabled value-producing switches with `yield`, and introduced compile-time exhaustiveness for enum selectors.
- **Pattern matching for switch (JEP 406/420/441)** extended the switch selector to arbitrary reference types and the case labels to type patterns, guarded patterns, and null patterns, reaching its final form in Java 21.
- **Record patterns (JEP 440, Java 21)** added structural deconstruction directly in case labels, enabling deep, nested pattern matching on record hierarchies.

Together, these features bring Java into alignment with the pattern-matching capabilities long available in Scala, Kotlin, and functional languages — while doing so with a syntax that is immediately recognizable to Java engineers and backward compatible with existing code.

The practical guidance is straightforward: prefer switch expressions over switch statements for value-producing dispatches, use sealed interfaces to define closed type hierarchies, and rely on the compiler's exhaustiveness checking to prevent missing-case bugs as your domain model evolves. The combination of sealed types, records, and pattern-matching switch is the modern Java idiom for type-safe variant dispatch, and it should be in every experienced Java engineer's daily toolkit.

---

*Next: Chapter 6 examines the remaining Java 17 features — enhanced pseudorandom number generators, strong encapsulation of JDK internals, and the deprecations and removals that demand attention before upgrading.*


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


---

# PART II: JAVA 21 — CONCURRENCY, COLLECTIONS, AND PATTERNS (LTS)

---

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


# Chapter 10: Sequenced Collections

Sequenced collections (JEP 431, finalized in Java 21) solve a surprising gap in the Java Collections Framework: the lack of a uniform API for accessing the first and last elements of ordered collections, and for iterating in reverse. Before Java 21, you needed different methods for different types — `list.get(0)` vs `deque.peekFirst()` vs `sortedSet.first()`, with no polymorphic way to write code that works across all ordered collections.

---

## 10.1 The Problem: Inconsistent First/Last Access

```java
// Getting the first element — every collection type is different
List<String> list = List.of("a", "b", "c");
String firstFromList = list.get(0);              // indexed access

Deque<String> deque = new ArrayDeque<>(List.of("a", "b", "c"));
String firstFromDeque = deque.peekFirst();        // or getFirst()

SortedSet<String> sortedSet = new TreeSet<>(List.of("a", "b", "c"));
String firstFromSet = sortedSet.first();          // SortedSet-specific

LinkedHashSet<String> linkedSet = new LinkedHashSet<>(List.of("a", "b", "c"));
String firstFromLinked = linkedSet.iterator().next(); // iterator hack!

// Getting the last element — equally inconsistent
String lastFromList = list.get(list.size() - 1); // error-prone
String lastFromDeque = deque.peekLast();
String lastFromSet = sortedSet.last();
String lastFromLinked = /* ... there's no clean way without iterating */;
```

This fragmentation makes it impossible to write generic code that works uniformly across ordered collections.

---

## 10.2 The Three New Interfaces

Java 21 introduced three new interfaces in `java.util`:

```
SequencedCollection<E>   extends Collection<E>
SequencedSet<E>          extends SequencedCollection<E>, Set<E>
SequencedMap<K,V>        extends Map<K,V>
```

---

## 10.3 SequencedCollection

```java
public interface SequencedCollection<E> extends Collection<E> {
    // Add to beginning/end
    void addFirst(E e);
    void addLast(E e);

    // Get first/last (throws NoSuchElementException if empty)
    E getFirst();
    E getLast();

    // Remove first/last (throws NoSuchElementException if empty)
    E removeFirst();
    E removeLast();

    // Reversed view (not a copy — changes to one are reflected in the other)
    SequencedCollection<E> reversed();
}
```

All ordered collections now implement this interface uniformly:

```java
List<String>       list       = new ArrayList<>(List.of("a", "b", "c"));
Deque<String>      deque      = new ArrayDeque<>(List.of("a", "b", "c"));
LinkedHashSet<String> linked  = new LinkedHashSet<>(List.of("a", "b", "c"));

// Uniform API — same code works for all three!
for (SequencedCollection<String> coll : List.of(list, deque, linked)) {
    System.out.println(coll.getFirst());  // "a"
    System.out.println(coll.getLast());   // "c"
}
```

### The reversed() View

`reversed()` returns a **live view** — it does not copy the collection. Mutations to the original are reflected in the reversed view, and vice versa:

```java
List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5));
List<Integer> reversed = (List<Integer>) numbers.reversed();

System.out.println(reversed.getFirst()); // 5
System.out.println(reversed.getLast());  // 1

numbers.add(6);
System.out.println(reversed.getFirst()); // 6 — live view reflects the change

// Iterating in reverse — clean and idiomatic
for (String item : list.reversed()) {
    System.out.println(item); // c, b, a
}

// Stream in reverse
list.reversed().stream()
    .filter(s -> !s.isEmpty())
    .forEach(System.out::println);
```

### Practical: Efficient Deque Operations

```java
// LRU cache skeleton using Deque as a SequencedCollection
class LruCache<K, V> {
    private final int capacity;
    private final LinkedHashMap<K, V> cache;

    LruCache(int capacity) {
        this.capacity = capacity;
        // LinkedHashMap in access-order mode
        this.cache = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > capacity;
            }
        };
    }

    // Using SequencedMap to get the most-recently-used entry
    public Map.Entry<K, V> getMostRecent() {
        return cache.sequencedEntrySet().getLast();  // Java 21 SequencedMap API
    }
}
```

---

## 10.4 SequencedSet

`SequencedSet<E>` adds no new methods but signals that the collection is both a `Set` (no duplicates) and a `SequencedCollection` (defined order). The `reversed()` return type is `SequencedSet<E>`.

```java
// LinkedHashSet now implements SequencedSet
LinkedHashSet<String> set = new LinkedHashSet<>(List.of("banana", "apple", "cherry"));

System.out.println(set.getFirst()); // "banana" (insertion order)
System.out.println(set.getLast());  // "cherry"

// TreeSet (sorted set) also implements SequencedSet
TreeSet<String> sorted = new TreeSet<>(Set.of("banana", "apple", "cherry"));
System.out.println(sorted.getFirst()); // "apple" (sorted order)
System.out.println(sorted.getLast());  // "cherry"

// Reverse iteration over a sorted set
for (String s : sorted.reversed()) {
    System.out.println(s); // cherry, banana, apple
}
```

---

## 10.5 SequencedMap

`SequencedMap<K,V>` adds first/last entry access and reversed views:

```java
public interface SequencedMap<K, V> extends Map<K, V> {
    Map.Entry<K,V> firstEntry();   // null-safe (returns null if empty)
    Map.Entry<K,V> lastEntry();    // null-safe

    Map.Entry<K,V> pollFirstEntry(); // removes and returns, or null
    Map.Entry<K,V> pollLastEntry();  // removes and returns, or null

    K firstKey();   // throws NoSuchElementException if empty
    K lastKey();

    V putFirst(K k, V v);  // insert at beginning
    V putLast(K k, V v);   // insert at end

    SequencedMap<K,V> reversed();

    // Sequenced views of keys, values, entries:
    SequencedSet<K>            sequencedKeySet();
    SequencedCollection<V>     sequencedValues();
    SequencedSet<Map.Entry<K,V>> sequencedEntrySet();
}
```

Usage:

```java
// LinkedHashMap maintains insertion order — now it's a SequencedMap
LinkedHashMap<String, Integer> scores = new LinkedHashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Carol", 92);

System.out.println(scores.firstEntry()); // Alice=95
System.out.println(scores.lastEntry());  // Carol=92
System.out.println(scores.firstKey());   // Alice

// Reverse iteration — crucial for LRU and recent-first ordering
scores.reversed().forEach((name, score) ->
    System.out.println(name + ": " + score));
// Carol: 92, Bob: 87, Alice: 95

// Sequenced views for stream operations
String topScorer = scores.sequencedEntrySet().reversed().stream()
    .max(Map.Entry.comparingByValue())
    .map(Map.Entry::getKey)
    .orElseThrow();
System.out.println("Top scorer: " + topScorer); // Alice
```

---

## 10.6 Collection Implementation Matrix

| Collection | Implements | Notes |
|-----------|-----------|-------|
| `ArrayList` | `SequencedCollection` | `addFirst`/`addLast` are O(n)/O(1) |
| `LinkedList` | `SequencedCollection`, `SequencedSet` if used as Deque | All ops O(1) |
| `ArrayDeque` | `SequencedCollection` | All ops O(1) |
| `LinkedHashSet` | `SequencedSet` | Insertion-order set |
| `TreeSet` | `SequencedSet` | Sorted-order set |
| `LinkedHashMap` | `SequencedMap` | Insertion-order map |
| `TreeMap` | `SequencedMap` | Sorted-order map |

**Not implementing**: `HashSet`, `HashMap`, `ArrayList` (for `SequencedSet`) — unordered collections do not implement these interfaces.

---

## 10.7 Migration: Replacing Pre-Java-21 Workarounds

```java
// BEFORE:
String last = list.get(list.size() - 1);       // error-prone, verbose
String first = deque.isEmpty() ? null : deque.peekFirst(); // null-safe check
for (Iterator<String> it = /* reverse iterator */; it.hasNext();) { ... }

// AFTER:
String last  = list.getLast();
String first = deque.isEmpty() ? null : deque.getFirst();
for (String s : list.reversed()) { ... }
```

---

## 10.8 Summary

Sequenced collections complete a long-overdue gap in the Collections Framework:

- **Uniform first/last access** across all ordered collections via `getFirst()`, `getLast()`
- **Uniform mutation** via `addFirst()`, `addLast()`, `removeFirst()`, `removeLast()`
- **`reversed()` live view** for clean reverse iteration and streaming
- **`SequencedMap`** brings the same uniformity to maps with entry-level first/last access

The impact is subtle but wide: generic code that works across `List`, `Deque`, `LinkedHashSet`, `TreeSet`, `LinkedHashMap`, and `TreeMap` without instanceof checks or type-specific method calls.


# Chapter 11: Record Patterns

Record patterns (JEP 440, finalized in Java 21) extend pattern matching to support **deconstruction of record values**. Where type patterns let you test and extract the type of an object, record patterns let you simultaneously test the type *and* destructure its components in a single expression. Combined with sealed classes, this enables exhaustive, readable, compiler-verified data navigation.

---

## 11.1 From Type Patterns to Record Patterns

Type patterns (finalized in Java 16, Chapter 3) allow:

```java
if (obj instanceof String s) {
    System.out.println(s.length()); // s is bound as String
}
```

Record patterns extend this: if `obj` is a record, you can **destructure** its components inline:

```java
record Point(double x, double y) {}

// Type pattern: extract the whole record
if (obj instanceof Point p) {
    System.out.println(p.x() + ", " + p.y()); // call accessors
}

// Record pattern: destructure directly
if (obj instanceof Point(double x, double y)) {
    System.out.println(x + ", " + y); // components bound directly
}
```

---

## 11.2 Record Deconstruction Pattern Syntax

```java
record Person(String name, int age) {}
record Address(String street, String city, String country) {}
record Employee(Person person, Address address, String department) {}

// In instanceof:
if (emp instanceof Employee(Person p, Address a, String dept)) {
    System.out.println(p.name() + " in " + dept + " at " + a.city());
}

// You can use var for component types:
if (emp instanceof Employee(var p, var a, var dept)) {
    System.out.println(p.name() + ", " + dept);
}
```

---

## 11.3 Nested Record Patterns

The real power of record patterns is **nesting** — drilling into arbitrarily deep record structures:

```java
record Point(double x, double y) {}
record Line(Point start, Point end) {}
record BoundingBox(Line horizontal, Line vertical) {}

Object shape = new BoundingBox(
    new Line(new Point(0, 0), new Point(10, 0)),
    new Line(new Point(0, 0), new Point(0, 10))
);

// Nested destructuring — one pattern, all levels
if (shape instanceof BoundingBox(
        Line(Point(double x1, double y1), Point(double x2, double y2)),
        Line(Point(double x3, double y3), Point(double x4, double y4)))) {
    System.out.printf("Width: %.1f, Height: %.1f%n",
        Math.abs(x2 - x1), Math.abs(y4 - y3));
}
```

Compare this to the pre-record-patterns approach:

```java
// Old: verbose, error-prone, misses exhaustiveness
if (shape instanceof BoundingBox bb) {
    Line h = bb.horizontal();
    Line v = bb.vertical();
    Point start = h.start();
    Point end   = h.end();
    double width  = Math.abs(end.x() - start.x());
    double height = Math.abs(v.end().y() - v.start().y());
    System.out.printf("Width: %.1f, Height: %.1f%n", width, height);
}
```

The record pattern version is more concise and the compiler verifies the structure.

---

## 11.4 Record Patterns in switch

Record patterns work in switch expressions and statements — this is where they shine most:

```java
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
record Triangle(double base, double height, double hypotenuse) implements Shape {}

double area(Shape shape) {
    return switch (shape) {
        case Circle(double r)                  -> Math.PI * r * r;
        case Rectangle(double w, double h)     -> w * h;
        case Triangle(double b, double h, var _) -> 0.5 * b * h;
    };
}

String describe(Shape shape) {
    return switch (shape) {
        case Circle(double r)    when r < 1 -> "tiny circle (r=" + r + ")";
        case Circle(double r)               -> "circle (r=" + r + ")";
        case Rectangle(double w, double h)
            when w == h                     -> "square (" + w + "x" + h + ")";
        case Rectangle(double w, double h)  -> "rectangle (" + w + "x" + h + ")";
        case Triangle(var b, var h, var hyp) -> "triangle";
    };
}
```

---

## 11.5 AST Processing with Nested Record Patterns

One of the most compelling use cases is processing Abstract Syntax Trees or hierarchical data models:

```java
sealed interface Expr permits Num, Add, Mul, Neg, Var {}
record Num(double value) implements Expr {}
record Var(String name) implements Expr {}
record Add(Expr left, Expr right) implements Expr {}
record Mul(Expr left, Expr right) implements Expr {}
record Neg(Expr expr) implements Expr {}

// Evaluate an expression tree
double eval(Expr expr, Map<String, Double> env) {
    return switch (expr) {
        case Num(double v)          -> v;
        case Var(String name)       -> env.getOrDefault(name, 0.0);
        case Neg(Expr inner)        -> -eval(inner, env);
        case Add(Expr l, Expr r)    -> eval(l, env) + eval(r, env);
        case Mul(Expr l, Expr r)    -> eval(l, env) * eval(r, env);
    };
}

// Constant-fold optimization: Mul(Num(0), anything) = Num(0)
Expr simplify(Expr expr) {
    return switch (expr) {
        case Mul(Num(0.0), var _)     -> new Num(0);
        case Mul(var _, Num(0.0))     -> new Num(0);
        case Mul(Num(1.0), Expr e)    -> simplify(e);
        case Mul(Expr e, Num(1.0))    -> simplify(e);
        case Add(Num(0.0), Expr e)    -> simplify(e);
        case Add(Expr e, Num(0.0))    -> simplify(e);
        case Add(Expr l, Expr r)      -> new Add(simplify(l), simplify(r));
        case Mul(Expr l, Expr r)      -> new Mul(simplify(l), simplify(r));
        case Neg(Neg(Expr inner))     -> simplify(inner);  // double negation
        default                       -> expr;
    };
}
```

---

## 11.6 Generic Record Patterns

Generic records work with type inference in patterns:

```java
record Box<T>(T value) {}
record Pair<A, B>(A first, B second) {}

Object obj = new Box<>(new Pair<>("hello", 42));

if (obj instanceof Box(Pair(String s, Integer n))) {
    System.out.println(s + " -> " + n); // "hello -> 42"
}

// In switch:
String process(Object o) {
    return switch (o) {
        case Box(String s)          -> "String box: " + s;
        case Box(Integer n)         -> "Int box: " + n;
        case Box(Pair(var a, var b)) -> "Pair box: " + a + ", " + b;
        case Box(var v)             -> "Box: " + v;
        default                     -> "unknown";
    };
}
```

---

## 11.7 Domain Event Dispatching

Record patterns excel at domain event processing:

```java
sealed interface OrderEvent permits
    OrderPlaced, PaymentReceived, ItemShipped, OrderCancelled {}

record OrderPlaced(String orderId, List<String> items, BigDecimal total)
    implements OrderEvent {}
record PaymentReceived(String orderId, String transactionId, BigDecimal amount)
    implements OrderEvent {}
record ItemShipped(String orderId, String trackingNumber)
    implements OrderEvent {}
record OrderCancelled(String orderId, String reason)
    implements OrderEvent {}

// Event processor using record patterns
String summarizeEvent(OrderEvent event) {
    return switch (event) {
        case OrderPlaced(var id, var items, var total) ->
            "Order %s placed: %d items, $%.2f".formatted(id, items.size(), total);

        case PaymentReceived(var id, var txnId, var amount) ->
            "Payment $%.2f received for order %s (txn: %s)".formatted(amount, id, txnId);

        case ItemShipped(var id, var tracking) ->
            "Order %s shipped, tracking: %s".formatted(id, tracking);

        case OrderCancelled(var id, var reason) ->
            "Order %s cancelled: %s".formatted(id, reason);
    };
}
```

---

## 11.8 Record Patterns vs Manual Accessor Calls

```java
record Customer(String id, String name, Address address) {}
record Address(String street, String city, String zip) {}

// Before record patterns: verbose, lots of intermediate variables
void sendWelcome(Object obj) {
    if (obj instanceof Customer c) {
        String city = c.address().city();
        String name = c.name();
        emailService.send(c.id(), "Welcome " + name + " from " + city);
    }
}

// With record patterns: concise, components named directly
void sendWelcomeV2(Object obj) {
    if (obj instanceof Customer(String id, String name, Address(var _, String city, var _))) {
        emailService.send(id, "Welcome " + name + " from " + city);
    }
}
```

---

## 11.9 Summary

Record patterns are the natural complement to records and sealed classes:

- **Destructure record components** directly in patterns — no intermediate variables, no accessor calls
- **Nest arbitrarily deep** for drilling into complex record hierarchies
- **Work in both `instanceof` and `switch`** — seamlessly compose with guarded patterns
- **Enable exhaustive matching** when combined with sealed interfaces
- **Dramatically improve readability** of data-processing code — ASTs, domain events, DTOs
- **Finalized in Java 21** — use without `--enable-preview`

When you find yourself writing `if (x instanceof Foo f) { var y = f.bar(); var z = y.baz(); }`, that's a record pattern waiting to be written.


# Chapter 12: Pattern Matching for Switch — Finalized

Pattern matching for switch (JEP 441, finalized in Java 21) completes the pattern matching story that began with `instanceof` in Java 16. It allows switch expressions and statements to match against arbitrary patterns — type patterns, record patterns, guarded patterns — with full exhaustiveness checking. This is the feature that makes the combination of records + sealed classes + switch into a genuine algebraic data type system.

---

## 12.1 The Journey: From JEP 406 (Preview) to JEP 441 (Final)

- **Java 17** (JEP 406): First preview — type patterns in switch
- **Java 18** (JEP 420): Second preview — refined semantics, guarded patterns with `&&`
- **Java 19** (JEP 427): Third preview — introduced `when` clause for guards
- **Java 20** (JEP 433): Fourth preview — further refinements
- **Java 21** (JEP 441): **Finalized** — no preview flag needed

---

## 12.2 Type Patterns in Switch

```java
sealed interface JsonValue permits JsonNull, JsonBool, JsonNumber, JsonString,
                                   JsonArray, JsonObject {}
record JsonNull()                        implements JsonValue {}
record JsonBool(boolean value)           implements JsonValue {}
record JsonNumber(double value)          implements JsonValue {}
record JsonString(String value)          implements JsonValue {}
record JsonArray(List<JsonValue> items)  implements JsonValue {}
record JsonObject(Map<String, JsonValue> fields) implements JsonValue {}

// Type-pattern switch — exhaustive, no default needed
String jsonToString(JsonValue val) {
    return switch (val) {
        case JsonNull   n -> "null";
        case JsonBool   b -> String.valueOf(b.value());
        case JsonNumber n -> String.valueOf(n.value());
        case JsonString s -> "\"" + s.value().replace("\"", "\\\"") + "\"";
        case JsonArray  a -> "[" + a.items().stream()
                                    .map(this::jsonToString)
                                    .collect(Collectors.joining(", ")) + "]";
        case JsonObject o -> "{" + o.fields().entrySet().stream()
                                    .map(e -> "\"" + e.getKey() + "\": "
                                              + jsonToString(e.getValue()))
                                    .collect(Collectors.joining(", ")) + "}";
    };
}
```

---

## 12.3 Guarded Patterns: The `when` Clause

Guarded patterns add a condition to a case arm:

```java
double computeDiscount(Object customer) {
    return switch (customer) {
        case PremiumCustomer pc when pc.yearsActive() > 5 -> 0.25;
        case PremiumCustomer pc                           -> 0.15;
        case StandardCustomer sc when sc.totalSpend().compareTo(
                                           new BigDecimal("1000")) > 0  -> 0.10;
        case StandardCustomer sc                          -> 0.05;
        case null, default                                -> 0.0;
    };
}
```

Order matters: more specific cases (with guards) must come before more general cases. The compiler enforces that more specific patterns dominate less specific ones in the correct order.

---

## 12.4 Null Handling in Switch

Before Java 21, passing `null` to a switch always threw `NullPointerException`. Now you can handle it explicitly:

```java
// Explicit null case
String describe(Object obj) {
    return switch (obj) {
        case null         -> "null value";
        case Integer i    -> "integer: " + i;
        case String s     -> "string: " + s;
        case default      -> "other: " + obj;
    };
}

// Combine null with another case
String process(String input) {
    return switch (input) {
        case null, ""     -> "empty or null";
        case String s when s.length() > 100 -> "very long: " + s.substring(0, 20) + "...";
        case String s     -> "normal: " + s;
    };
}
```

---

## 12.5 Exhaustiveness: Compiler Guarantees

With sealed types, the compiler verifies that all cases are covered:

```java
sealed interface Status permits Active, Inactive, Suspended {}
record Active(Instant since)                    implements Status {}
record Inactive(Instant since, String reason)   implements Status {}
record Suspended(Instant until, String cause)   implements Status {}

String statusMessage(Status status) {
    return switch (status) {
        case Active(var since)              -> "Active since " + since;
        case Inactive(var since, var reason) -> "Inactive since " + since + ": " + reason;
        case Suspended(var until, var cause) -> "Suspended until " + until + ": " + cause;
        // No default needed — sealed type guarantees exhaustiveness
    };
}
// If you add a new permitted subtype to Status,
// the compiler FAILS with "switch expression does not cover all possible input values"
```

---

## 12.6 Dominance Rules

Pattern cases have a **dominance** order: if pattern P dominates pattern Q, Q must come after P:

```java
// COMPILE ERROR: 'case Object o' dominates 'case String s'
// String o = switch (obj) {
//     case Object o -> "object";  // too general — compiler error
//     case String s -> "string";
// };

// CORRECT: more specific first
String describe(Object obj) {
    return switch (obj) {
        case String s when s.isEmpty() -> "empty string";  // most specific
        case String s                  -> "string: " + s;  // less specific
        case Integer i                 -> "integer: " + i;
        case null                      -> "null";
        default                        -> "other";
    };
}
```

---

## 12.7 Full Expression Evaluator with Patterns

A complete, realistic example combining sealed classes, record patterns, and switch:

```java
sealed interface Expr permits Lit, Add, Sub, Mul, Div, Neg, Var, Let {}
record Lit(double value)             implements Expr {}
record Var(String name)              implements Expr {}
record Add(Expr left, Expr right)    implements Expr {}
record Sub(Expr left, Expr right)    implements Expr {}
record Mul(Expr left, Expr right)    implements Expr {}
record Div(Expr left, Expr right)    implements Expr {}
record Neg(Expr expr)                implements Expr {}
record Let(String var, Expr value, Expr body) implements Expr {}

// Evaluator
static double eval(Expr expr, Map<String, Double> env) {
    return switch (expr) {
        case Lit(double v)                 -> v;
        case Var(String name)              -> {
            var val = env.get(name);
            if (val == null) throw new RuntimeException("Unbound variable: " + name);
            yield val;
        }
        case Add(Expr l, Expr r)           -> eval(l, env) + eval(r, env);
        case Sub(Expr l, Expr r)           -> eval(l, env) - eval(r, env);
        case Mul(Expr l, Expr r)           -> eval(l, env) * eval(r, env);
        case Div(Expr l, Expr r)           -> {
            double divisor = eval(r, env);
            if (divisor == 0.0) throw new ArithmeticException("Division by zero");
            yield eval(l, env) / divisor;
        }
        case Neg(Expr inner)               -> -eval(inner, env);
        case Let(String var, Expr val, Expr body) -> {
            var newEnv = new HashMap<>(env);
            newEnv.put(var, eval(val, env));
            yield eval(body, newEnv);
        }
    };
}

// Pretty printer
static String prettyPrint(Expr expr) {
    return switch (expr) {
        case Lit(double v)              -> String.valueOf(v);
        case Var(String name)           -> name;
        case Neg(Expr e)                -> "(-" + prettyPrint(e) + ")";
        case Add(Expr l, Expr r)        -> "(" + prettyPrint(l) + " + " + prettyPrint(r) + ")";
        case Sub(Expr l, Expr r)        -> "(" + prettyPrint(l) + " - " + prettyPrint(r) + ")";
        case Mul(Expr l, Expr r)        -> "(" + prettyPrint(l) + " * " + prettyPrint(r) + ")";
        case Div(Expr l, Expr r)        -> "(" + prettyPrint(l) + " / " + prettyPrint(r) + ")";
        case Let(String v, Expr val, Expr body) ->
            "let " + v + " = " + prettyPrint(val) + " in " + prettyPrint(body);
    };
}
```

---

## 12.8 The default vs `_` in Switch

Both `default` and `_` (unnamed pattern) catch unmatched cases:

```java
// 'default' — traditional, matches non-null and null if not handled
String x = switch (val) {
    case String s -> "string";
    default -> "other";
};

// '_' — unnamed pattern, matches all remaining (non-null)
String y = switch (val) {
    case String s -> "string";
    case _ -> "other";
};

// Difference: 'default' is also tried if no pattern matches for null
// '_' is a pattern and doesn't match null
```

---

## 12.9 Summary

Pattern matching for switch, finalized in Java 21, is the culmination of the pattern matching journey:

- **Type patterns** in switch for concise dispatch without casts
- **Guarded patterns** with `when` for conditional case refinement
- **Null handling** with explicit `case null`
- **Exhaustiveness checking** with sealed types — compiler-verified completeness
- **Record patterns** in switch arms — destructure and test in one operation
- **Dominance rules** enforced by the compiler — no ambiguous case ordering

Combined with records and sealed classes, this makes Java a practical language for building type-safe, exhaustively-handled data models that rival Kotlin's `when` expressions and Scala's match expressions.


# Chapter 13: Foreign Function and Memory API

The Foreign Function and Memory API (JEP 454, finalized in Java 21) is the result of Project Panama — a multi-year effort to replace JNI with a safer, more expressive API for calling native code and manipulating native memory. If you've ever wrestled with JNI boilerplate, hand-written C header files, or unsafe `Unsafe` usage, FFM API is the modern solution.

---

## 13.1 Why JNI Needed Replacing

JNI (Java Native Interface) has served Java since 1.1, but it has well-known problems:

- **Verbose**: writing JNI requires C header generation (`javah`), C implementation, loading shared libraries
- **Unsafe by default**: native memory manipulation is entirely unchecked
- **Error-prone**: C-side JNI code mixes Java object handling with native code — easy to crash the JVM
- **Poor developer experience**: no IDE support, manual type mapping, crash-to-desktop on errors

```c
// JNI: C code required for every native method
JNIEXPORT jstring JNICALL
Java_com_example_Native_greet(JNIEnv *env, jobject obj, jstring name) {
    const char *nativeName = (*env)->GetStringUTFChars(env, name, NULL);
    char buffer[256];
    snprintf(buffer, sizeof(buffer), "Hello, %s!", nativeName);
    (*env)->ReleaseStringUTFChars(env, name, nativeName);
    return (*env)->NewStringUTF(env, buffer);
}
```

The FFM API eliminates the C side entirely for many use cases.

---

## 13.2 Key Abstractions

| Class | Purpose |
|-------|---------|
| `MemorySegment` | A contiguous region of memory (heap or off-heap) |
| `MemoryLayout` | Describes the structure of memory (struct, union, array) |
| `Arena` | Controls the lifetime of native memory allocations |
| `Linker` | Links Java method handles to native functions |
| `SymbolLookup` | Finds native function symbols in shared libraries |
| `FunctionDescriptor` | Describes a native function's parameter and return types |

---

## 13.3 Arena: Managing Native Memory Lifetimes

`Arena` is the key safety primitive. All native memory allocated through an Arena is released when the Arena closes — no manual `free()` required:

```java
import java.lang.foreign.*;

// Confined Arena: single-threaded, closed with try-with-resources
try (Arena arena = Arena.ofConfined()) {
    // Allocate 1024 bytes of native memory, managed by this arena
    MemorySegment buffer = arena.allocate(1024);

    // Write to it
    buffer.set(ValueLayout.JAVA_INT, 0, 42);

    // Read from it
    int value = buffer.get(ValueLayout.JAVA_INT, 0);
    System.out.println(value); // 42

} // arena closes here, native memory is freed automatically

// Shared Arena: multi-threaded, closed explicitly
Arena shared = Arena.ofShared();
MemorySegment sharedBuffer = shared.allocate(4096);
// ... use from multiple threads ...
shared.close();

// Auto Arena: freed by GC when segment becomes unreachable
Arena auto = Arena.ofAuto();
MemorySegment autoBuffer = auto.allocate(512);
// Freed when GC collects — no explicit close needed (but unpredictable timing)

// Global Arena: never freed — for library-lifetime resources
MemorySegment globalBuffer = Arena.global().allocate(256);
```

---

## 13.4 MemoryLayout: Describing C Structs

`MemoryLayout` describes the structure of C data in a type-safe way:

```java
import java.lang.foreign.*;
import java.lang.invoke.VarHandle;

// Equivalent to the C struct:
// struct Point { int32_t x; int32_t y; };
StructLayout pointLayout = MemoryLayout.structLayout(
    ValueLayout.JAVA_INT.withName("x"),
    ValueLayout.JAVA_INT.withName("y")
);

// Struct with padding
// struct Aligned { int8_t flag; /* 3 bytes padding */ int32_t value; };
StructLayout alignedLayout = MemoryLayout.structLayout(
    ValueLayout.JAVA_BYTE.withName("flag"),
    MemoryLayout.paddingLayout(3),  // explicit padding
    ValueLayout.JAVA_INT.withName("value")
);

// Array of structs
SequenceLayout arrayOfPoints = MemoryLayout.sequenceLayout(10, pointLayout);

// VarHandle for structured access
VarHandle xHandle = pointLayout.varHandle(MemoryLayout.PathElement.groupElement("x"));
VarHandle yHandle = pointLayout.varHandle(MemoryLayout.PathElement.groupElement("y"));

try (Arena arena = Arena.ofConfined()) {
    MemorySegment point = arena.allocate(pointLayout);
    xHandle.set(point, 0L, 5);    // set x = 5
    yHandle.set(point, 0L, 10);   // set y = 10

    int x = (int) xHandle.get(point, 0L); // get x
    int y = (int) yHandle.get(point, 0L); // get y
    System.out.println("x=" + x + ", y=" + y); // x=5, y=10
}
```

---

## 13.5 Calling Native Functions: strlen Example

The `Linker` connects Java method handles to native C functions:

```java
import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;

public class NativeStringLength {

    private static final Linker LINKER = Linker.nativeLinker();
    private static final SymbolLookup STDLIB = LINKER.defaultLookup();

    // Load strlen from the standard C library
    private static final MethodHandle STRLEN;
    static {
        STRLEN = LINKER.downcallHandle(
            STDLIB.findOrThrow("strlen"),
            FunctionDescriptor.of(
                ValueLayout.JAVA_LONG,   // return type: size_t (long on 64-bit)
                ValueLayout.ADDRESS      // parameter: const char*
            )
        );
    }

    public static long strlen(String s) throws Throwable {
        try (Arena arena = Arena.ofConfined()) {
            // Convert Java String to C string (null-terminated)
            MemorySegment cString = arena.allocateFrom(s);
            return (long) STRLEN.invokeExact(cString);
        }
    }

    public static void main(String[] args) throws Throwable {
        System.out.println(strlen("Hello, World!")); // 13
        System.out.println(strlen("Java 21 FFM API")); // 15
    }
}
```

---

## 13.6 Working with C Structs: Allocate and Read

A more realistic example: allocating and reading a C `timespec` struct:

```java
import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.VarHandle;

public class TimeExample {
    private static final Linker LINKER = Linker.nativeLinker();
    private static final SymbolLookup STDLIB = LINKER.defaultLookup();

    // struct timespec { long tv_sec; long tv_nsec; };
    static final StructLayout TIMESPEC = MemoryLayout.structLayout(
        ValueLayout.JAVA_LONG.withName("tv_sec"),
        ValueLayout.JAVA_LONG.withName("tv_nsec")
    );

    static final VarHandle TV_SEC  =
        TIMESPEC.varHandle(MemoryLayout.PathElement.groupElement("tv_sec"));
    static final VarHandle TV_NSEC =
        TIMESPEC.varHandle(MemoryLayout.PathElement.groupElement("tv_nsec"));

    // clock_gettime(clockid_t, struct timespec*) -> int
    static final MethodHandle CLOCK_GETTIME = LINKER.downcallHandle(
        STDLIB.findOrThrow("clock_gettime"),
        FunctionDescriptor.of(
            ValueLayout.JAVA_INT,
            ValueLayout.JAVA_INT,
            ValueLayout.ADDRESS
        )
    );

    public static long getMonotonicNanos() throws Throwable {
        int CLOCK_MONOTONIC = 1;
        try (Arena arena = Arena.ofConfined()) {
            MemorySegment ts = arena.allocate(TIMESPEC);
            int result = (int) CLOCK_GETTIME.invokeExact(CLOCK_MONOTONIC, ts);
            if (result != 0) throw new RuntimeException("clock_gettime failed: " + result);

            long seconds = (long) TV_SEC.get(ts, 0L);
            long nanos   = (long) TV_NSEC.get(ts, 0L);
            return seconds * 1_000_000_000L + nanos;
        }
    }
}
```

---

## 13.7 Loading External Libraries

```java
// Load a custom shared library
SymbolLookup myLib = SymbolLookup.libraryLookup(
    Path.of("/usr/local/lib/libmymath.so"),
    Arena.ofAuto()
);

// Or load by name (searches LD_LIBRARY_PATH / system paths)
SymbolLookup mathLib = SymbolLookup.libraryLookup("m", Arena.ofAuto()); // libm

// double pow(double base, double exp)
MethodHandle POW = LINKER.downcallHandle(
    mathLib.findOrThrow("pow"),
    FunctionDescriptor.of(
        ValueLayout.JAVA_DOUBLE,
        ValueLayout.JAVA_DOUBLE,
        ValueLayout.JAVA_DOUBLE
    )
);

double result = (double) POW.invokeExact(2.0, 10.0); // 1024.0
```

---

## 13.8 Upcalls: Java Callbacks from Native Code

The FFM API also supports **upcalls** — passing Java method handles as C function pointers to native code:

```java
import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class QSortExample {

    private static final Linker LINKER = Linker.nativeLinker();
    private static final SymbolLookup STDLIB = LINKER.defaultLookup();

    // C comparator: int compare(const void* a, const void* b)
    static int intCompare(MemorySegment a, MemorySegment b) {
        int x = a.get(ValueLayout.JAVA_INT, 0);
        int y = b.get(ValueLayout.JAVA_INT, 0);
        return Integer.compare(x, y);
    }

    public static void qsort(int[] array) throws Throwable {
        MethodHandle compareHandle = MethodHandles.lookup()
            .findStatic(QSortExample.class, "intCompare",
                MethodType.methodType(int.class, MemorySegment.class, MemorySegment.class));

        FunctionDescriptor comparatorDesc = FunctionDescriptor.of(
            ValueLayout.JAVA_INT,
            ValueLayout.ADDRESS,
            ValueLayout.ADDRESS
        );

        try (Arena arena = Arena.ofConfined()) {
            // Create a native function pointer wrapping our Java method
            MemorySegment comparatorPtr =
                LINKER.upcallStub(compareHandle, comparatorDesc, arena);

            // Allocate native array and copy Java array into it
            MemorySegment nativeArray =
                arena.allocateFrom(ValueLayout.JAVA_INT, array);

            // void qsort(void* base, size_t nmemb, size_t size, comparator)
            MethodHandle QSORT = LINKER.downcallHandle(
                STDLIB.findOrThrow("qsort"),
                FunctionDescriptor.ofVoid(
                    ValueLayout.ADDRESS,
                    ValueLayout.JAVA_LONG,
                    ValueLayout.JAVA_LONG,
                    ValueLayout.ADDRESS
                )
            );

            QSORT.invokeExact(nativeArray, (long) array.length,
                              (long) ValueLayout.JAVA_INT.byteSize(), comparatorPtr);

            // Copy sorted values back to Java array
            MemorySegment.copy(nativeArray, ValueLayout.JAVA_INT, 0,
                               array, 0, array.length);
        }
    }
}
```

---

## 13.9 FFM vs JNI: Comparison

| Aspect | JNI | FFM API (Java 21) |
|--------|-----|-------------------|
| C boilerplate required | Yes (for every method) | No |
| Type safety | Weak (C side is unchecked) | Strong (layouts verified) |
| Memory safety | None — can crash JVM | Arena-managed, safe |
| Tool support | javah (deprecated) | jextract (auto-generates bindings) |
| Performance | Excellent | Comparable (JIT-optimized) |
| Null-terminated strings | Manual | `allocateFrom(String)` |
| Struct mapping | Manual offset calculation | `MemoryLayout.structLayout()` |
| Upcalls (Java callbacks from C) | Complex | `Linker.upcallStub()` |

---

## 13.10 Summary

The Foreign Function and Memory API eliminates the pain of JNI:

- **`Arena`** manages native memory lifetime safely — no manual `free()`
- **`MemorySegment`** provides type-safe access to native memory regions
- **`MemoryLayout`** describes C struct layouts with padding and alignment
- **`Linker`** connects Java `MethodHandle`s to native C functions
- **`SymbolLookup`** finds symbols in shared libraries
- **Upcalls** allow passing Java callbacks to native code as function pointers
- **Finalized in Java 21** — production-ready, replaces JNI for new interop code

For projects with significant native interop requirements, pair FFM API with `jextract` (available from OpenJDK tooling) to auto-generate Java bindings from C header files.


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
record Triangle(double base, double height, double hyp) implements Shape {}

// Ignore components you don't need with _
String quickDescribe(Shape shape) {
    return switch (shape) {
        case Circle(double r)            -> "circle r=" + r;
        case Rectangle(double w, double h) -> "rectangle " + w + "×" + h;
        case Triangle(double b, var _, var _) -> "triangle base=" + b; // ignore h and hyp
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


---

# PART III: JAVA 25 — THE NEXT LTS

---

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

One important API note on `orElse()`: the method signature is actually:
```java
public T orElse(T other);
```

If the scoped value is not bound in the current scope, it returns `other` instead of throwing.

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


# Chapter 16: Structured Concurrency in Java 25 (JEP 505 — 5th Preview)

Structured concurrency continues its preview evolution in Java 25 with JEP 505. The most significant change from the Java 21 preview (Chapter 8) is the introduction of a new `StructuredTaskScope.open()` factory method and a pluggable `Joiner` interface that replaces the subclassing model of `ShutdownOnFailure` and `ShutdownOnSuccess`.

---

## 16.1 API Refinements Since Java 21

The Java 21 API required subclassing `StructuredTaskScope` to create custom join policies. The Java 25 API introduces a cleaner design:

| Java 21 API | Java 25 API |
|-------------|-------------|
| `new StructuredTaskScope.ShutdownOnFailure()` | `StructuredTaskScope.open(Joiner.awaitAll())` or `StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())` |
| `new StructuredTaskScope.ShutdownOnSuccess<T>()` | `StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())` |
| Custom subclass | Implement `Joiner<T, R>` interface |
| `scope.join()` then `scope.throwIfFailed()` | `scope.join()` returns the joiner result directly |

---

## 16.2 StructuredTaskScope.open() — The New Factory

```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Joiner;
import java.util.concurrent.StructuredTaskScope.Subtask;

// Java 25 style — open() with a Joiner
public OrderDetail getOrderDetail(String orderId) throws Exception {
    try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {

        Subtask<Order>    orderTask = scope.fork(() -> orderService.find(orderId));
        Subtask<Customer> custTask  = scope.fork(() -> customerService.find(orderId));

        // join() returns the Joiner's result — in this case Void (all-or-nothing)
        scope.join();

        return new OrderDetail(orderTask.get(), custTask.get());
    }
}
```

---

## 16.3 Built-in Joiners

### Joiner.allSuccessfulOrThrow() — Replaces ShutdownOnFailure

```java
// All tasks must succeed; throws the first exception if any fail
try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
    var task1 = scope.fork(() -> serviceA.call());
    var task2 = scope.fork(() -> serviceB.call());
    scope.join(); // throws if any task failed

    String a = task1.get();
    String b = task2.get();
    return a + b;
}
```

### Joiner.anySuccessfulResultOrThrow() — Replaces ShutdownOnSuccess

```java
// Returns the first successful result; throws if all tasks fail
try (var scope = StructuredTaskScope.open(Joiner.anySuccessfulResultOrThrow())) {
    scope.fork(() -> primaryEndpoint.call());
    scope.fork(() -> fallbackEndpoint.call());

    String result = scope.join(); // returns first successful result
    return result;
}
```

### Joiner.awaitAll() — Wait, Don't Fail Fast

```java
// Wait for all tasks regardless of failures; collect results manually
try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    var task1 = scope.fork(() -> serviceA.call());
    var task2 = scope.fork(() -> serviceB.call());
    var task3 = scope.fork(() -> serviceC.call());

    scope.join(); // waits for all to finish; doesn't throw on failure

    // Process results, including partial failures
    var results = new ArrayList<String>();
    var errors  = new ArrayList<String>();

    for (var task : List.of(task1, task2, task3)) {
        switch (task.state()) {
            case SUCCESS     -> results.add(task.get());
            case FAILED      -> errors.add(task.exception().getMessage());
            case UNAVAILABLE -> errors.add("cancelled");
        }
    }

    if (!errors.isEmpty()) {
        log.warn("Partial failure: {}", errors);
    }
    return results;
}
```

---

## 16.4 Custom Joiner Implementation

The `Joiner<T, R>` interface allows building fully custom join policies:

```java
// Custom joiner: collect all successful results, ignore failures
// T = task result type, R = joiner result type
class CollectSuccessful<T> implements Joiner<T, List<T>> {
    private final List<T> results = new CopyOnWriteArrayList<>();

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        if (subtask.state() == Subtask.State.SUCCESS) {
            results.add(subtask.get());
        }
        return false; // don't shut down on any individual completion
    }

    @Override
    public List<T> result() {
        return Collections.unmodifiableList(results);
    }
}

// Usage:
try (var scope = StructuredTaskScope.open(new CollectSuccessful<String>())) {
    urls.forEach(url -> scope.fork(() -> httpClient.fetch(url)));
    List<String> successful = scope.join(); // only successful results
}
```

Another custom joiner — timeout-aware with partial results:

```java
class TimeBoundedJoiner<T> implements Joiner<T, List<T>> {
    private final Duration timeout;
    private final List<T> results = new CopyOnWriteArrayList<>();
    private final long startNanos = System.nanoTime();

    TimeBoundedJoiner(Duration timeout) {
        this.timeout = timeout;
    }

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        if (subtask.state() == Subtask.State.SUCCESS) {
            results.add(subtask.get());
        }
        // Shut down if timeout exceeded
        long elapsed = System.nanoTime() - startNanos;
        return elapsed >= timeout.toNanos();
    }

    @Override
    public List<T> result() {
        return Collections.unmodifiableList(results);
    }
}
```

---

## 16.5 Subtask States

```java
// Subtask.State is the same as in Java 21:
enum State {
    UNAVAILABLE, // Task was forked but scope hasn't joined yet, or it was cancelled
    SUCCESS,     // Completed normally
    FAILED       // Completed with an exception
}
```

---

## 16.6 Integration with Scoped Values (Finalized in Java 25)

In Java 25, both structured concurrency and scoped values are either finalized or in late preview — and they integrate seamlessly:

```java
public static final ScopedValue<String> TENANT = ScopedValue.newInstance();
public static final ScopedValue<User> USER     = ScopedValue.newInstance();

public TenantReport generateReport(String tenantId, User user) throws Exception {
    return ScopedValue.where(TENANT, tenantId)
                      .where(USER,   user)
                      .call(() -> {
        try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
            // Each forked task inherits TENANT and USER automatically
            var orders   = scope.fork(() -> orderService.getOrders());
            var invoices = scope.fork(() -> invoiceService.getInvoices());
            var metrics  = scope.fork(() -> metricsService.getMetrics());

            scope.join();

            return new TenantReport(
                orders.get(), invoices.get(), metrics.get(),
                TENANT.get(), USER.get()
            );
        }
    });
}
```

---

## 16.7 Production Patterns

### Circuit Breaker Pattern

```java
class CircuitBreakerJoiner<T> implements Joiner<T, Optional<T>> {
    private final int maxFailures;
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private volatile T successResult;

    CircuitBreakerJoiner(int maxFailures) {
        this.maxFailures = maxFailures;
    }

    @Override
    public boolean onComplete(Subtask<? extends T> subtask) {
        return switch (subtask.state()) {
            case SUCCESS -> {
                successResult = subtask.get();
                yield true; // got a result, shut down
            }
            case FAILED -> failureCount.incrementAndGet() >= maxFailures;
            case UNAVAILABLE -> false;
        };
    }

    @Override
    public Optional<T> result() {
        return Optional.ofNullable(successResult);
    }
}
```

---

## 16.8 When to Use vs CompletableFuture vs Reactive

The guidance from Chapter 8 still holds, with additional nuance in Java 25:

- **Structured concurrency**: use for parallel I/O with defined task sets and structured results. Pairs with virtual threads naturally.
- **CompletableFuture**: still valid for simple async composition when you don't need the full lifecycle management. Prefer structured concurrency for new code.
- **Reactive streams (Reactor, RxJava)**: use when you need **backpressure** — streaming data from slow producers, processing pipelines where the consumer controls the rate.

---

## 16.9 Summary

Structured concurrency in Java 25 (5th preview) brings:

- **`StructuredTaskScope.open(joiner)`** — cleaner factory vs. subclassing
- **`Joiner` interface** — pluggable join policies: `allSuccessfulOrThrow()`, `anySuccessfulResultOrThrow()`, `awaitAll()`
- **Custom Joiners** — implement any collection/shutdown policy
- **Automatic scoped value inheritance** — forked tasks see parent's scoped value bindings
- **Improved thread dumps** — hierarchical task structure visible in JVM diagnostic tools

Still requires `--enable-preview` in Java 25. Expect finalization in Java 27 or the following LTS.


# Chapter 17: Flexible Constructor Bodies (JEP 492, Finalized Java 25)

Flexible Constructor Bodies — also known informally as "Statements before super()" — finalize in Java 25 after preview rounds in Java 22 (JEP 447) and Java 23 (JEP 482). This feature relaxes the long-standing restriction that `super()` or `this()` must be the *first statement* in a constructor, allowing certain statements to precede the super-constructor call.

---

## 17.1 The Old Rule: super() Must Come First

Java has always required `super()` or `this()` to be the first statement in a constructor. This rule was designed to ensure that instance fields are properly initialized before any code runs on the partially-constructed object. But it created a persistent pain point:

```java
// BEFORE Java 25: forced into ugly static helper pattern
public class ValidatedList<E> extends ArrayList<E> {
    private final int maxSize;

    public ValidatedList(List<E> source, int maxSize) {
        // We WANT to validate before super(), but we CAN'T
        // So we use a static helper to transform the argument
        super(ValidatedList.validate(source, maxSize));  // HACK
        this.maxSize = maxSize;
    }

    private static <E> List<E> validate(List<E> source, int maxSize) {
        if (source == null) throw new NullPointerException("source is null");
        if (source.size() > maxSize)
            throw new IllegalArgumentException("source exceeds maxSize " + maxSize);
        return source;
    }
}
```

The static helper pattern is a workaround, not a design choice. It pollutes the class with methods that exist only to work around a constructor restriction.

---

## 17.2 What's Now Allowed: Statements Before super()

Java 25 allows statements before `super()` or `this()` **as long as they don't access `this`** (neither directly nor indirectly through instance method calls):

```java
// AFTER Java 25: clean validation before super()
public class ValidatedList<E> extends ArrayList<E> {
    private final int maxSize;

    public ValidatedList(List<E> source, int maxSize) {
        // These statements can now precede super()
        if (source == null) throw new NullPointerException("source is null");
        if (source.size() > maxSize)
            throw new IllegalArgumentException("source exceeds maxSize " + maxSize);

        super(source);  // super() called after validation — no static helper needed
        this.maxSize = maxSize;
    }
}
```

---

## 17.3 The Primary Use Case: Validation Before Delegation

The canonical use case is validating or transforming arguments before passing them to the super-constructor:

```java
public class BoundedChannel<T> extends ArrayBlockingQueue<T> {

    public BoundedChannel(int capacity, boolean fair, Collection<? extends T> initial) {
        // Validate before super()
        Objects.requireNonNull(initial, "initial collection must not be null");
        if (initial.size() > capacity) {
            throw new IllegalArgumentException(
                "Initial collection size (%d) exceeds capacity (%d)"
                    .formatted(initial.size(), capacity));
        }
        // No nulls allowed in elements
        for (T item : initial) {
            if (item == null) throw new NullPointerException("null elements not allowed");
        }

        super(capacity, fair, initial);
    }
}
```

---

## 17.4 Preparing Arguments for super() with Complex Logic

Sometimes the argument to `super()` needs non-trivial computation:

```java
public class ConfigurableThreadPool extends ThreadPoolExecutor {

    public ConfigurableThreadPool(PoolConfig config) {
        // Compute values from config before calling super()
        int coreSize = Math.max(1, config.minThreads());
        int maxSize  = Math.max(coreSize, config.maxThreads());
        long keepAlive = config.keepAliveSeconds();

        // Choose the queue implementation based on config
        BlockingQueue<Runnable> workQueue = config.unbounded()
            ? new LinkedBlockingQueue<>()
            : new ArrayBlockingQueue<>(config.queueCapacity());

        ThreadFactory factory = Thread.ofVirtual()
            .name(config.threadNamePrefix() + "-", 0)
            .factory();

        super(coreSize, maxSize, keepAlive, TimeUnit.SECONDS, workQueue, factory);
    }
}
```

Before Java 25, this required extracting logic into multiple static helper methods, or using a builder/factory pattern instead of a constructor.

---

## 17.5 Constructors with this() Chaining

The feature also works with `this()` delegation:

```java
public class Connection {
    private final String host;
    private final int port;
    private final int timeout;

    public Connection(String host, int port, int timeout) {
        if (host == null || host.isBlank())
            throw new IllegalArgumentException("host must not be blank");
        if (port < 1 || port > 65535)
            throw new IllegalArgumentException("port must be in range [1, 65535]: " + port);
        if (timeout < 0)
            throw new IllegalArgumentException("timeout must be non-negative");

        this.host    = host;
        this.port    = port;
        this.timeout = timeout;
    }

    // Convenience constructors delegate to the validated canonical constructor
    public Connection(String host, int port) {
        // Can validate before this()
        if (host == null) throw new NullPointerException("host");
        this(host, port, 30_000);  // default timeout
    }

    public Connection(String hostAndPort) {
        // Complex parsing before this()
        String[] parts = hostAndPort.split(":", 2);
        if (parts.length != 2) {
            throw new IllegalArgumentException("Expected host:port, got: " + hostAndPort);
        }
        int parsedPort;
        try {
            parsedPort = Integer.parseInt(parts[1]);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid port: " + parts[1], e);
        }
        this(parts[0], parsedPort);
    }
}
```

---

## 17.6 What You Still CANNOT Do Before super()

The restriction remains for any access to `this`:

```java
public class Restricted extends Base {

    private int value;

    public Restricted(int v) {
        // Still ILLEGAL before super():
        // this.value = v;              // accessing instance field
        // this.validate(v);            // calling instance method
        // int x = this.value;         // reading instance field
        // super.someMethod();          // calling super method (accesses this)
        // Objects.requireNonNull(this); // passing this reference

        // These are all LEGAL (don't access this):
        int processed = Math.abs(v);    // local computation
        String msg = "Value: " + v;     // string operations
        if (v < 0) throw new IllegalArgumentException(msg);
        var helper = new Helper(v);     // creating other objects (not this)

        super(processed);
        this.value = processed;         // LEGAL: after super()
    }
}
```

The compiler enforces this rule. Any statement before `super()` that accesses `this` (directly or transitively) is a compile error.

---

## 17.7 Real-World Refactoring: Cleaning Up Static Helpers

```java
// BEFORE: static helper methods cluttering the API
public class SecureEndpoint extends HttpEndpoint {
    private final SecretKey signingKey;

    public SecureEndpoint(String url, byte[] rawKey) {
        super(url, SecureEndpoint.buildOptions(rawKey));
        this.signingKey = SecureEndpoint.deriveKey(rawKey);
    }

    private static EndpointOptions buildOptions(byte[] rawKey) {
        if (rawKey == null || rawKey.length < 32)
            throw new IllegalArgumentException("Key too short");
        return EndpointOptions.defaults().withTLS(true);
    }

    private static SecretKey deriveKey(byte[] rawKey) {
        return new SecretKeySpec(rawKey, 0, 32, "HmacSHA256");
    }
}

// AFTER: clean constructor, no static helpers
public class SecureEndpoint extends HttpEndpoint {
    private final SecretKey signingKey;

    public SecureEndpoint(String url, byte[] rawKey) {
        if (rawKey == null || rawKey.length < 32)
            throw new IllegalArgumentException("Key must be at least 32 bytes");

        var options = EndpointOptions.defaults().withTLS(true);
        super(url, options);

        this.signingKey = new SecretKeySpec(rawKey, 0, 32, "HmacSHA256");
    }
}
```

---

## 17.8 Summary

Flexible Constructor Bodies (JEP 492, final in Java 25) solve a real, recurring pain:

- **Validate arguments before delegating** to `super()` or `this()` — the primary use case
- **Compute complex arguments** for `super()` without static helper methods
- **Still protected from unsafe access** — any reference to `this` before `super()` is a compile error
- **Applies to both `super()` and `this()`** delegation
- **No syntax changes** — it's a relaxation of the existing constructor grammar

This feature quietly improves the quality of constructor code across Java codebases. Watch for it in framework code, collection subclasses, and domain layer builders.


# Chapter 18: Compact Source Files and Instance Main Methods (JEP 512, Finalized Java 25)

Compact Source Files and Instance Main Methods (JEP 512) finalize in Java 25 after four preview rounds (Java 21–24). This feature allows Java programs to run without the traditional ceremony of `public class`, `public static void main(String[] args)`, and import statements — making Java suitable for scripting, quick prototypes, and teaching beginners without sacrificing anything for production code.

---

## 18.1 The Goal: A Smooth On-Ramp Without Compromise

The Java team's stated goal: *students can write their first programs without needing to understand language features designed for large programs*. But for experienced engineers, this translates to: **write Java scripts and utilities with minimal boilerplate**.

---

## 18.2 Instance Main Methods

The traditional `main` method requires three modifiers: `public`, `static`, and `String[] args`. In Java 25, these are all optional:

```java
// Traditional (still works, always will):
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Java 25: all modifiers optional
class Hello {
    void main() {
        System.out.println("Hello, World!");
    }
}
```

The launcher tries these variants in order, using the first one found:

| Priority | Signature |
|----------|-----------|
| 1 | `public static void main(String[])` |
| 2 | `static void main(String[])` |
| 3 | `public static void main()` |
| 4 | `static void main()` |
| 5 | `public void main(String[])` |
| 6 | `public void main()` |
| 7 | `void main(String[])` |
| 8 | `void main()` |

---

## 18.3 Unnamed Classes: Files Without class Declarations

An **unnamed class** is a source file with no explicit class declaration. The compiler wraps the contents in a synthetic, unnamed class:

```java
// File: Hello.java — no class declaration
void main() {
    System.out.println("Hello, World!");
}
```

```bash
java Hello.java   # direct source launching (Java 11+)
javac Hello.java  # compiles to Hello.class
java Hello        # run compiled version
```

Unnamed classes can contain:
- Method declarations
- Field declarations
- Static initializers

They **cannot** contain:
- Package declarations
- Explicit class/interface declarations
- Module declarations
- Constructors (no class name to construct)

---

## 18.4 Implicitly Imported Classes

Unnamed classes implicitly import:

```java
// These are auto-available in unnamed classes (Java 25):
import java.lang.*;   // String, System, Math, etc.
import java.io.*;     // println() and the java.io.IO class
import java.util.*;   // List, Map, ArrayList, etc.
```

The `java.io.IO` class provides `println()`, `print()`, and `readln()` as static methods for simplified I/O:

```java
// File: Calculator.java
void main() {
    println("Enter a number:");         // java.io.IO.println()
    String input = readln(">> ");       // java.io.IO.readln()
    double number = Double.parseDouble(input);
    println("Square root: " + Math.sqrt(number));
}
```

---

## 18.5 Expert Use: Scripts and Utilities

For experienced engineers, unnamed classes are powerful for scripting tasks:

```java
// File: ProcessLog.java — log analysis script
import java.nio.file.*;
import java.util.regex.*;

void main(String[] args) throws Exception {
    if (args.length == 0) {
        println("Usage: java ProcessLog.java <logfile>");
        return;
    }

    var logFile = Path.of(args[0]);
    var errorPattern = Pattern.compile("ERROR.*OutOfMemory", Pattern.CASE_INSENSITIVE);

    var errors = Files.lines(logFile)
        .filter(line -> errorPattern.matcher(line).find())
        .toList();

    println("Found " + errors.size() + " OOM errors:");
    errors.forEach(this::println);
}

void println(String s) {
    System.out.println(s);
}
```

Run it:
```bash
java ProcessLog.java application.log
```

---

## 18.6 Data Processing Script

```java
// File: CsvSummary.java
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

record Sale(String region, String product, double amount) {}

void main(String[] args) throws Exception {
    var csvFile = Path.of(args.length > 0 ? args[0] : "sales.csv");

    var sales = Files.lines(csvFile)
        .skip(1)  // skip header
        .map(line -> {
            var cols = line.split(",");
            return new Sale(cols[0].trim(), cols[1].trim(), Double.parseDouble(cols[2].trim()));
        })
        .toList();

    println("=== Sales Summary ===");
    sales.stream()
        .collect(Collectors.groupingBy(Sale::region,
                 Collectors.summingDouble(Sale::amount)))
        .entrySet().stream()
        .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
        .forEach(e -> println("%-15s $%,.2f".formatted(e.getKey(), e.getValue())));

    double total = sales.stream().mapToDouble(Sale::amount).sum();
    println("\nTotal: $" + "%,.2f".formatted(total));
}

void println(String s) { System.out.println(s); }
```

---

## 18.7 How It Compiles: Under the Hood

The compiler wraps an unnamed class file in a synthetic class:

```java
// Source: Hello.java
void main() {
    println("Hello!");
}

// Compiled as approximately:
final class Hello {
    void main() {
        System.out.println("Hello!");
    }
    // Synthetic no-arg constructor
    Hello() {}
}
```

The class name is derived from the file name. The `main()` method is instance-based — the launcher creates an instance via the no-arg constructor, then calls `main()`.

---

## 18.8 Module Import Declarations in Unnamed Classes

Java 25's Module Import Declarations (Chapter 19) pair naturally with unnamed classes:

```java
// Import all exported packages of java.base and java.net.http
import module java.base;
import module java.net.http;

void main() throws Exception {
    var client = HttpClient.newHttpClient();
    var request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.example.com/data"))
        .build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    println(response.body());
}

void println(String s) { System.out.println(s); }
```

---

## 18.9 Limitations

- **No package declaration**: unnamed classes belong to the unnamed package
- **Cannot be referenced by name**: you can't import an unnamed class from another class
- **No nested class declarations** (though record declarations are allowed)
- **IDE support varies**: IntelliJ and VS Code Java extension support unnamed classes in Java 25

---

## 18.10 Summary

Compact Source Files and Instance Main Methods finalize in Java 25:

- **Instance `main()` method**: drop `public`, `static`, `String[] args` — all optional
- **Unnamed classes**: write Java without a class declaration — file name becomes class name
- **Implicit imports**: `java.lang`, `java.io`, `java.util` auto-imported
- **Expert value**: Java scripting without a build system — run `.java` files directly
- **Production code unchanged**: traditional class structure is still correct and preferred for production

This feature doesn't change production Java — it lowers the entry cost for scripts, tutorials, and quick experiments where the traditional structure is pure ceremony.


# Chapter 19: Module Import Declarations (JEP 511, Finalized Java 25)

Module Import Declarations (JEP 511) finalize in Java 25 after a single preview round in Java 24 (JEP 476). This feature allows importing all exported packages of a module with a single `import module` declaration — dramatically reducing import boilerplate for code that uses many classes from a module.

---

## 19.1 The Problem: Verbose Wildcard Imports Across Module Boundaries

Wildcard imports (`import java.util.*`) import all types from a single package. But modules contain multiple packages. If you use many classes from `java.net.http`, you need multiple imports:

```java
// Traditional: need to import each package separately
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpHeaders;
import java.net.http.WebSocket;
// ... and more for other packages in the module
```

With module imports:

```java
// Java 25: one import covers all exported packages of java.net.http
import module java.net.http;
// Now all exported types from java.net.http are available
```

---

## 19.2 Syntax: `import module <module-name>;`

```java
import module java.base;          // imports all exported packages of java.base
import module java.net.http;      // imports all exported packages of java.net.http
import module java.sql;           // imports all exported packages of java.sql
import module java.desktop;       // imports all exported packages of java.desktop
```

Module imports appear in the same place as regular imports, after the package declaration:

```java
package com.example.demo;

import module java.base;       // String, List, Map, etc. — actually java.base is already implicit
import module java.net.http;   // HttpClient, HttpRequest, HttpResponse, etc.

public class ApiClient {
    public String fetch(String url) throws Exception {
        var client  = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString()).body();
    }
}
```

---

## 19.3 What Gets Imported

Only **exported** packages are imported — the same packages visible in the module graph from outside the module. Unexported packages (implementation-internal) are never accessible:

```java
// java.base exports (among others):
// java.lang, java.util, java.io, java.math, java.nio, java.net, etc.

import module java.base;
// Now available: String, List, Map, Path, Files, Optional, BigDecimal,
//                ByteBuffer, Duration, Instant, etc.
// NOT available: sun.misc.*, jdk.internal.*, etc. (unexported)
```

---

## 19.4 Conflict Resolution

If two module imports export the same simple type name, you get a compile error on ambiguous use. Resolve with a specific single-type import:

```java
import module java.sql;       // exports java.sql.Date
import module java.util;      // ... wait, java.util is in java.base, not its own module
                              // Let's use a realistic example:

import module java.sql;       // exports java.sql.Date, java.sql.Time, etc.
// java.util.Date is available via java.base's implicit import

// Using 'Date' is ambiguous — could be java.sql.Date or java.util.Date
// Solution: specific import takes precedence
import java.util.Date;        // this single-type import wins over module imports

Date d = new Date();          // java.util.Date — specific import wins
```

The rule: **single-type imports always take precedence over module imports**, and module imports are tried last in the resolution order.

---

## 19.5 Module Imports in Unnamed Modules (Classpath Code)

A key design decision: **you don't need to be in a named module** to use `import module`. Code running from the classpath (unnamed module) can use module imports freely:

```java
// Traditional classpath application (no module-info.java needed)
// File: OrderProcessor.java, compiled with classpath

import module java.base;       // String, List, Map, Optional, etc.
import module java.net.http;   // HttpClient, etc.
import module java.sql;        // Connection, PreparedStatement, etc.

public class OrderProcessor {
    public void processOrders(Connection db) throws Exception {
        var stmt = db.prepareStatement(
            "SELECT * FROM orders WHERE status = ?");
        stmt.setString(1, "PENDING");
        var rs = stmt.executeQuery();
        // ... process results
    }
}
```

---

## 19.6 Module Imports in Named Modules

In modular applications, `import module` in source files is **independent** of `requires` in `module-info.java`:

```java
// module-info.java: declares module dependencies at the module level
module com.example.orders {
    requires java.sql;           // must still declare dependencies here
    requires java.net.http;
    exports com.example.orders;
}

// OrderService.java: import module is a convenience at source file level
import module java.sql;          // still useful inside named modules
import module java.net.http;

public class OrderService {
    // No need to type out each individual package import
}
```

**Critical distinction**: `requires java.sql` in `module-info.java` is a **module dependency declaration** — it affects module resolution, encapsulation, and classpath. `import module java.sql` in a source file is purely a **source convenience** — it affects only what simple names are resolvable in that file. They serve different purposes and are both needed when writing modular code.

---

## 19.7 Practical Use: Common Module Imports

```java
// java.base — implicitly available, but explicit module import useful to document intent
import module java.base;

// java.net.http — HTTP client API
import module java.net.http;

// java.sql — JDBC API
import module java.sql;

// java.xml — XML processing
import module java.xml;

// java.logging — java.util.logging
import module java.logging;

// java.management — JMX
import module java.management;

// Third-party modules (when using the module system)
import module com.fasterxml.jackson.databind;
import module io.micrometer.core;
```

---

## 19.8 Module Imports in Unnamed Classes

Module imports pair particularly well with unnamed classes (Chapter 18), where you want to use multiple APIs without an explicit `module-info.java`:

```java
// File: HttpDemo.java — unnamed class with module imports
import module java.net.http;

void main() throws Exception {
    var client = HttpClient.newHttpClient();
    var request = HttpRequest.newBuilder()
        .uri(URI.create("https://httpbin.org/get"))
        .GET()
        .build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    println(response.statusCode() + ": " + response.body().substring(0, 100) + "...");
}

void println(Object o) { System.out.println(o); }
```

Run directly:
```bash
java HttpDemo.java
```

---

## 19.9 Summary

Module Import Declarations (JEP 511, finalized Java 25):

- **`import module <name>`** imports all exported packages of a module in one declaration
- **Works everywhere**: unnamed modules (classpath), named modules, unnamed classes
- **Conflict resolution**: single-type imports always win over module imports
- **Not a module dependency**: `import module` in source ≠ `requires` in `module-info.java`
- **Pairs perfectly with unnamed classes** for concise, low-ceremony Java scripts

Adopt module imports aggressively in code that uses many types from the same module. The reduction in import boilerplate is especially welcome in unnamed classes and exploratory code.


# Chapter 20: Security Enhancements — Key Derivation Function API and PEM Encodings

Java 25 brings two significant security additions: the Key Derivation Function API (JEP 510, finalized) and PEM Encodings for Cryptographic Objects (JEP 470, preview). Together they address important gaps in Java's cryptography landscape — standardized key derivation and native PEM format support.

---

## 20.1 What Is Key Derivation and Why It Matters

A Key Derivation Function (KDF) derives cryptographic key material from a primary secret. This is fundamental to:

- **TLS handshakes**: deriving session keys from a shared secret
- **Password-based encryption**: deriving an AES key from a user password (PBKDF2)
- **Application-level security**: deriving multiple purpose-specific keys from a master key
- **Post-quantum cryptography**: key derivation is central to many PQC schemes

Before Java 25, Java developers had to use provider-specific APIs or third-party libraries (Bouncy Castle) for standardized KDF operations. The new `KDF` API brings this into the standard JDK.

---

## 20.2 KDF API Overview (JEP 510 — Finalized Java 25)

```java
import javax.crypto.KDF;
import javax.crypto.spec.HKDFParameterSpec;
import java.security.spec.AlgorithmParameterSpec;

// The core interface
KDF kdf = KDF.getInstance("HKDF-SHA256");

// derive a SecretKey
SecretKey derivedKey = kdf.deriveKey("AES", spec);

// derive raw bytes
byte[] keyMaterial = kdf.deriveData(spec);
```

The API follows the established `getInstance()` factory pattern familiar from `Cipher`, `MessageDigest`, and `KeyPairGenerator`.

---

## 20.3 HKDF — HMAC-based Key Derivation Function

HKDF (RFC 5869) is the most widely used modern KDF. It consists of two steps:
1. **Extract**: distill entropy from input key material (IKM) using a salt
2. **Expand**: produce output key material (OKM) of any desired length

```java
import javax.crypto.KDF;
import javax.crypto.SecretKey;
import javax.crypto.spec.HKDFParameterSpec;
import java.security.SecureRandom;

public class HkdfExample {

    private static final int AES_256_KEY_SIZE = 32; // 256 bits = 32 bytes

    // Extract-then-expand: the full HKDF operation
    public static SecretKey deriveAesKey(byte[] inputKeyMaterial, byte[] salt, byte[] info)
            throws Exception {
        KDF hkdf = KDF.getInstance("HKDF-SHA256");

        HKDFParameterSpec spec = HKDFParameterSpec.expandOnly(
            // First run extract to get a pseudorandom key (PRK)
            HKDFParameterSpec.ofExtract()
                .addIKM(inputKeyMaterial)
                .addSalt(salt)
                .extractExpand(info, AES_256_KEY_SIZE)
        );

        return hkdf.deriveKey("AES", spec);
    }

    // Just the Expand step (when you already have a PRK)
    public static byte[] expand(byte[] prk, byte[] info, int length) throws Exception {
        KDF hkdf = KDF.getInstance("HKDF-SHA256");

        HKDFParameterSpec spec = HKDFParameterSpec.expandOnly(prk, info, length);

        return hkdf.deriveData(spec);
    }

    // Practical example: derive AES and HMAC keys from a shared Diffie-Hellman secret
    public static void main(String[] args) throws Exception {
        // Simulated shared secret from ECDH key exchange
        byte[] sharedSecret = new byte[32];
        new SecureRandom().nextBytes(sharedSecret);

        byte[] salt = new byte[32];
        new SecureRandom().nextBytes(salt);

        // Derive AES key for encryption
        byte[] aesInfo = "encryption-key-v1".getBytes();
        SecretKey aesKey = deriveAesKey(sharedSecret, salt, aesInfo);
        System.out.println("AES key algorithm: " + aesKey.getAlgorithm());
        System.out.println("AES key length: " + aesKey.getEncoded().length + " bytes");

        // Derive HMAC key for authentication
        byte[] hmacInfo = "authentication-key-v1".getBytes();
        KDF hkdf = KDF.getInstance("HKDF-SHA256");
        HKDFParameterSpec hmacSpec = HKDFParameterSpec.expandOnly(
            HKDFParameterSpec.ofExtract().addIKM(sharedSecret).addSalt(salt)
                .extractExpand(hmacInfo, 32)
        );
        SecretKey hmacKey = hkdf.deriveKey("HmacSHA256", hmacSpec);
        System.out.println("HMAC key: " + hmacKey.getAlgorithm());
    }
}
```

---

## 20.4 PBKDF2 — Password-Based Key Derivation

PBKDF2 (Password-Based Key Derivation Function 2) is the standard for deriving keys from user passwords. The new API makes it cleaner than the old `SecretKeyFactory` approach:

```java
import javax.crypto.KDF;
import javax.crypto.SecretKey;
import javax.crypto.spec.PBEKeySpec;
import java.security.spec.AlgorithmParameterSpec;

public class PasswordDerivedKey {

    private static final int ITERATIONS = 600_000;  // NIST recommendation 2023
    private static final int KEY_LENGTH_BITS = 256;
    private static final int SALT_BYTES = 32;

    public static SecretKey deriveFromPassword(char[] password, byte[] salt)
            throws Exception {
        KDF pbkdf2 = KDF.getInstance("PBKDF2WithHmacSHA256");

        // New API: cleaner than the old SecretKeyFactory path
        AlgorithmParameterSpec spec = new PBEKeySpec(
            password,
            salt,
            ITERATIONS,
            KEY_LENGTH_BITS
        );

        return pbkdf2.deriveKey("AES", spec);
    }

    // Generate a cryptographically random salt
    public static byte[] generateSalt() {
        byte[] salt = new byte[SALT_BYTES];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    // Usage example: storing a user password securely
    record StoredPassword(byte[] salt, byte[] hash) {}

    public static StoredPassword hashPassword(char[] password) throws Exception {
        byte[] salt = generateSalt();
        SecretKey key = deriveFromPassword(password, salt);
        return new StoredPassword(salt, key.getEncoded());
    }

    public static boolean verifyPassword(char[] password, StoredPassword stored)
            throws Exception {
        SecretKey key = deriveFromPassword(password, stored.salt());
        return MessageDigest.isEqual(key.getEncoded(), stored.hash());
    }
}
```

---

## 20.5 PEM Encodings API (JEP 470 — Preview in Java 25)

PEM (Privacy-Enhanced Mail) format is the ubiquitous format for storing and exchanging cryptographic objects — public keys, private keys, certificates, CSRs. Every `openssl` output, every TLS certificate, every SSH key uses PEM.

Before Java 25, there was no standard PEM encoding/decoding in the JDK. Developers used Bouncy Castle or hand-rolled Base64 parsing.

### Encoding Keys to PEM

```java
import java.security.*;
import java.security.pem.PEMEncoder;
import java.security.pem.PEMDecoder;

public class PemExample {

    // Encode a key pair to PEM format
    public static void encodePem() throws Exception {
        KeyPairGenerator gen = KeyPairGenerator.getInstance("EC");
        gen.initialize(256);
        KeyPair keyPair = gen.generateKeyPair();

        PEMEncoder encoder = PEMEncoder.of();

        // Encode private key
        String privateKeyPem = encoder.encodeToString(keyPair.getPrivate());
        System.out.println(privateKeyPem);
        // -----BEGIN PRIVATE KEY-----
        // MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg...
        // -----END PRIVATE KEY-----

        // Encode public key
        String publicKeyPem = encoder.encodeToString(keyPair.getPublic());
        System.out.println(publicKeyPem);
        // -----BEGIN PUBLIC KEY-----
        // MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...
        // -----END PUBLIC KEY-----
    }

    // Encode a certificate to PEM
    public static String encodeCertificate(X509Certificate cert) throws Exception {
        PEMEncoder encoder = PEMEncoder.of();
        return encoder.encodeToString(cert);
    }

    // Decode a PEM-encoded private key
    public static PrivateKey decodePemPrivateKey(String pemString) throws Exception {
        PEMDecoder decoder = PEMDecoder.of();
        return (PrivateKey) decoder.decode(pemString).get(0);
    }

    // Decode from file
    public static PrivateKey loadPrivateKeyFromFile(Path pemFile) throws Exception {
        String pemContent = Files.readString(pemFile);
        PEMDecoder decoder = PEMDecoder.of();
        var decodedObjects = decoder.decode(pemContent);
        return decodedObjects.stream()
            .filter(o -> o instanceof PrivateKey)
            .map(o -> (PrivateKey) o)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("No private key found in PEM"));
    }
}
```

### Loading TLS Certificates from PEM Files

A common real-world use case:

```java
public class TlsContextBuilder {

    public static SSLContext buildFromPem(Path certPem, Path keyPem) throws Exception {
        PEMDecoder decoder = PEMDecoder.of();

        // Load certificate
        String certContent = Files.readString(certPem);
        X509Certificate cert = (X509Certificate) decoder.decode(certContent).get(0);

        // Load private key
        String keyContent = Files.readString(keyPem);
        PrivateKey privateKey = (PrivateKey) decoder.decode(keyContent).get(0);

        // Build KeyStore
        KeyStore ks = KeyStore.getInstance("PKCS12");
        ks.load(null, null);
        ks.setKeyEntry("server", privateKey, new char[0],
            new Certificate[]{cert});

        // Build SSLContext
        KeyManagerFactory kmf = KeyManagerFactory.getInstance(
            KeyManagerFactory.getDefaultAlgorithm());
        kmf.init(ks, new char[0]);

        SSLContext ctx = SSLContext.getInstance("TLS");
        ctx.init(kmf.getKeyManagers(), null, null);
        return ctx;
    }
}
```

---

## 20.6 Security Best Practices

```java
// 1. Always use appropriate iteration counts for PBKDF2
//    NIST SP 800-63B (2023) recommends >= 600,000 for SHA-256
private static final int MIN_PBKDF2_ITERATIONS = 600_000;

// 2. Always use a random, unique salt per password/key derivation
byte[] salt = new byte[32];
new SecureRandom().nextBytes(salt);

// 3. Clear sensitive data from memory after use
char[] password = getPassword();
try {
    // use password
} finally {
    Arrays.fill(password, '\0');  // clear from memory
}

// 4. Don't use HKDF Extract-only — always include Expand
// The PRK from Extract alone should not be used as a key directly

// 5. Use algorithm-specific info strings to domain-separate derived keys
byte[] aesInfo  = "v1:com.example:aes-encryption".getBytes(StandardCharsets.UTF_8);
byte[] hmacInfo = "v1:com.example:hmac-auth".getBytes(StandardCharsets.UTF_8);
```

---

## 20.7 Summary

Java 25's security enhancements:

- **KDF API (JEP 510, final)**: standard `KDF.getInstance()` factory for HKDF and PBKDF2
  - `HKDF-SHA256`: modern key derivation for session keys, derived subkeys
  - `PBKDF2WithHmacSHA256`: password-based key derivation with configurable iterations
- **PEM Encodings (JEP 470, preview)**: `PEMEncoder` and `PEMDecoder` for encoding/decoding cryptographic objects to/from PEM format
  - Load private keys, public keys, certificates from `.pem` files natively
  - Encode keys and certificates for export/storage

These APIs eliminate the need for Bouncy Castle in many common cryptography workflows, reducing dependency complexity while improving security through well-vetted standard implementations.


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


---

# APPENDICES

---

# Appendix A: Java Version Compatibility and Migration Guide

---

## A.1 Understanding the Java Release Cadence

Since Java 9, Oracle and the OpenJDK community follow a strict 6-month release cadence:
- New features are released every 6 months (March and September)
- LTS (Long-Term Support) releases occur every 3 years (Java 11, 17, 21, 25)
- LTS releases receive support for 8+ years (Oracle) or 5+ years (Adoptium/Temurin)

| Version | Release | LTS | Oracle Support |
|---------|---------|-----|----------------|
| Java 11 | Sep 2018 | ✅ LTS | Until Sep 2026 |
| Java 17 | Sep 2021 | ✅ LTS | Until Sep 2029 |
| Java 21 | Sep 2023 | ✅ LTS | Until Sep 2031 |
| **Java 25** | **Sep 2025** | **✅ LTS** | **Until Sep 2033** |

**Recommendation for enterprises**: Upgrade from Java 11 → Java 17 → Java 21 → Java 25 (or skip to 25 directly if currently on 11).

---

## A.2 Migrating from Java 11 to Java 17

### Breaking Changes

**Strong Encapsulation (JEP 403)**:
```bash
# Java 11: --illegal-access=permit was the default (and worked)
# Java 17: --illegal-access is REMOVED. Reflective access to JDK internals throws.

# Error you'll see:
# java.lang.reflect.InaccessibleObjectException: Unable to make ... accessible

# Short-term fix: add --add-opens
java --add-opens java.base/java.lang=ALL-UNNAMED \
     --add-opens java.base/java.util=ALL-UNNAMED \
     -jar myapp.jar
```

**Common libraries that needed updates for Java 17**:

| Library | Min version for Java 17 |
|---------|------------------------|
| Spring Boot | 2.7.x (full support in 3.0+) |
| Hibernate | 5.6+ (6.0+ for full support) |
| Mockito | 4.0+ |
| ByteBuddy | 1.12+ |
| Jackson | 2.13+ |
| Lombok | 1.18.20+ |
| CGLIB | 3.3.0+ (or switch to ByteBuddy) |

### Maven Configuration for Java 17

```xml
<project>
    <properties>
        <java.version>17</java.version>
        <maven.compiler.release>17</maven.compiler.release>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>17</release>
                    <!-- For preview features: -->
                    <!-- <compilerArgs>
                        <arg>--enable-preview</arg>
                    </compilerArgs> -->
                </configuration>
            </plugin>

            <!-- Enable preview in tests/runtime if needed -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
                <configuration>
                    <!-- Add if using preview features or need internal access -->
                    <argLine>
                        --add-opens java.base/java.lang=ALL-UNNAMED
                        --add-opens java.base/java.util=ALL-UNNAMED
                    </argLine>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Gradle Configuration for Java 17

```kotlin
// build.gradle.kts
plugins {
    java
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

tasks.withType<JavaCompile>().configureEach {
    options.release = 17
    // For preview features:
    // options.compilerArgs.addAll(listOf("--enable-preview", "--release", "17"))
}

tasks.withType<Test>().configureEach {
    jvmArgs(
        "--add-opens", "java.base/java.lang=ALL-UNNAMED",
        "--add-opens", "java.base/java.util=ALL-UNNAMED"
    )
    // For preview at test runtime:
    // jvmArgs("--enable-preview")
}
```

---

## A.3 Migrating from Java 17 to Java 21

Java 21 has **no major breaking changes** for well-behaved Java 17 code. The migration is primarily about updating frameworks and adopting new features.

### Framework Versions for Java 21

| Framework | Min version for Java 21 |
|-----------|------------------------|
| Spring Boot | 3.2+ (virtual thread support) |
| Quarkus | 3.6+ |
| Micronaut | 4.2+ |
| Hibernate | 6.4+ |
| JUnit | 5.10+ |
| Mockito | 5.4+ |

### Enabling Virtual Threads

```yaml
# Spring Boot 3.2+ — single property
spring:
  threads:
    virtual:
      enabled: true
```

```java
// Custom executor service — drop-in replacement
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
```

### Maven Configuration for Java 21

```xml
<properties>
    <maven.compiler.release>21</maven.compiler.release>
</properties>

<!-- Spring Boot parent for Java 21 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.1</version>
</parent>
```

---

## A.4 Migrating from Java 21 to Java 25

### Scoped Values API (if using preview from Java 21)

The Scoped Values API was **finalized without changes** from the Java 24 preview. If you were using `--enable-preview` in Java 21–24 for `ScopedValue`:

```bash
# Before Java 25: required --enable-preview
java --enable-preview -jar myapp.jar

# Java 25: ScopedValue is final, no flag needed
java -jar myapp.jar
```

No code changes required.

### Structured Concurrency (if using preview)

The `StructuredTaskScope.ShutdownOnFailure` and `ShutdownOnSuccess` subclasses are **replaced** by `StructuredTaskScope.open(Joiner.*)` in Java 25. Migration:

```java
// Java 21 preview:
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var t1 = scope.fork(() -> serviceA.call());
    var t2 = scope.fork(() -> serviceB.call());
    scope.join().throwIfFailed();
    return new Result(t1.get(), t2.get());
}

// Java 25 preview (new API):
try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
    var t1 = scope.fork(() -> serviceA.call());
    var t2 = scope.fork(() -> serviceB.call());
    scope.join();
    return new Result(t1.get(), t2.get());
}
```

### Compact Object Headers

Opt-in — existing code works unchanged:
```bash
java -XX:+UseCompactObjectHeaders -jar myapp.jar
```

---

## A.5 Docker Configuration

### Multi-stage builds with Java 25

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:25-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Extract layers for better Docker caching
FROM builder AS layers
WORKDIR /app
RUN java -Djarmode=layertools -jar target/*.jar extract

# Stage 3: Runtime image
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy layers in order of change frequency (least to most)
COPY --from=layers /app/dependencies/ ./
COPY --from=layers /app/spring-boot-loader/ ./
COPY --from=layers /app/snapshot-dependencies/ ./
COPY --from=layers /app/application/ ./

# Enable virtual threads (if not configured in application.yml)
ENV JAVA_OPTS="-XX:+UseZGC -XX:+ZGenerational -XX:+UseCompactObjectHeaders"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} org.springframework.boot.loader.launch.JarLauncher"]
```

### JVM Flags for Production Containers

```bash
# Recommended JVM flags for Java 25 containers (adjust -Xmx to container memory)
java \
  -XX:+UseZGC -XX:+ZGenerational \
  -XX:+UseCompactObjectHeaders \
  -Xmx$(expr $CONTAINER_MEMORY_MB - 256)m \
  -XX:MaxDirectMemorySize=256m \
  -XX:+ExitOnOutOfMemoryError \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/tmp/heapdump.hprof \
  -jar myapp.jar
```

---

## A.6 Common Migration Issues and Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| `InaccessibleObjectException` | Strong encapsulation (Java 17+) | Add `--add-opens` or update library |
| `NoSuchMethodError: Thread.getId()` | `Thread.getId()` deprecated in Java 19, removed in Java 21 | Use `Thread.threadId()` |
| `ClassNotFoundException: sun.misc.BASE64Encoder` | Internal class, removed | Use `java.util.Base64` |
| `SecurityException: Security Manager` | Security Manager removal (Java 17 deprecated, 24 removed) | Remove Security Manager code |
| Reflection breaks on JDK internals | Strong encapsulation | Update library version |
| `synchronized` blocks causing pinning on VTs | Virtual thread pinning | Use `ReentrantLock` |
| High memory with ThreadLocal on VTs | O(thread) ThreadLocal copies | Use `ScopedValue` |
| `--illegal-access` flag error | Removed in Java 17 | Remove flag, add `--add-opens` if needed |

---

## A.7 IDE and Tool Support Matrix

| Tool | Java 17 | Java 21 | Java 25 |
|------|---------|---------|---------|
| IntelliJ IDEA | 2021.2+ | 2023.3+ | 2025.3+ |
| Eclipse | 4.21+ | 4.29+ | 4.34+ |
| VS Code (Java Ext) | 1.10+ | 1.24+ | Latest |
| Maven | 3.8+ | 3.9+ | 3.9+ |
| Gradle | 7.3+ | 8.4+ | 8.10+ |
| JUnit | 5.8+ | 5.10+ | 5.11+ |
| Checkstyle | 9.x | 10.x | 10.x |
| PMD | 6.41+ | 7.x | 7.x |
| SpotBugs | 4.4+ | 4.8+ | 4.9+ |


# Appendix B: Complete JEP Reference Index

---

## B.1 Java 17 JEPs (All 14 JEPs)

| JEP | Feature | Status | Chapter | Description |
|-----|---------|--------|---------|-------------|
| 306 | Restore Always-Strict Floating-Point Semantics | ✅ Final | 6 | All floating-point is now IEEE 754 — strictfp is a no-op |
| 356 | Enhanced Pseudo-Random Number Generators | ✅ Final | 6 | New RandomGenerator interface hierarchy; LXM, Xoshiro generators |
| 382 | New macOS Rendering Pipeline | ✅ Final | 6 | Metal-based rendering pipeline for macOS |
| 391 | macOS/AArch64 Port | ✅ Final | 6 | Native support for Apple M1/M2 silicon |
| 394 | Pattern Matching for instanceof | ✅ Final | 3 | Bind pattern variables in instanceof expressions |
| 395 | Records | ✅ Final | 1 | Transparent, immutable data carrier classes |
| 398 | Deprecate Applet API for Removal | Deprecated | 6 | java.applet.Applet deprecated; removed in Java 23 |
| 403 | Strongly Encapsulate JDK Internals | ✅ Final | 6 | --illegal-access removed; internal APIs inaccessible |
| 406 | Pattern Matching for switch | 1st Preview | 5 | Type patterns in switch (finalized in Java 21) |
| 407 | Remove RMI Activation | Removal | 6 | java.rmi.activation removed |
| 409 | Sealed Classes | ✅ Final | 2 | Restrict class/interface inheritance with permits clause |
| 410 | Remove Experimental AOT and JIT Compiler | Removal | 6 | jaotc and Graal JIT removed from JDK |
| 411 | Deprecate Security Manager for Removal | Deprecated | 6 | Security Manager deprecated; removed in Java 24 |
| 412 | Foreign Function & Memory API | 1st Incubator | 13 | Access native code and memory (finalized in Java 21) |
| 414 | Vector API | 2nd Incubator | 21 | SIMD operations from Java |
| 415 | Context-Specific Deserialization Filters | ✅ Final | 6 | JVM-wide filter factory for ObjectInputStream |

---

## B.2 Java 21 JEPs (All 15 JEPs)

| JEP | Feature | Status | Chapter | Description |
|-----|---------|--------|---------|-------------|
| 430 | String Templates | 1st Preview | 14 | Embedded expressions in string literals (withdrawn in Java 23) |
| 431 | Sequenced Collections | ✅ Final | 10 | Uniform first/last access and reversed() for ordered collections |
| 439 | Generational ZGC | ✅ Final | 14 | Young/old generation support in ZGC |
| 440 | Record Patterns | ✅ Final | 11 | Destructure record components in patterns |
| 441 | Pattern Matching for switch | ✅ Final | 12 | Type patterns, guarded patterns, null handling in switch |
| 442 | Foreign Function & Memory API | 3rd Preview → Final | 13 | Access native functions and memory (finalized in Java 22) |
| 443 | Unnamed Patterns and Variables | 1st Preview | 14 | _ wildcard in patterns and variables |
| 444 | Virtual Threads | ✅ Final | 7 | JVM-managed lightweight threads for I/O scalability |
| 445 | Unnamed Classes and Instance Main Methods | 1st Preview | 18 | Reduce ceremony for simple programs |
| 446 | Scoped Values | 1st Preview | 9 | Immutable per-scope thread context (finalized in Java 25) |
| 448 | Vector API | 6th Incubator | 21 | SIMD operations from Java |
| 449 | Deprecate Windows 32-bit x86 Port | Deprecated | — | Windows 32-bit JVM deprecated |
| 451 | Prepare to Disallow the Dynamic Loading of Agents | Warning | — | JVM warns when agents loaded into running JVM |
| 452 | Key Encapsulation Mechanism API | ✅ Final | 20 | javax.crypto.KEM for post-quantum cryptography |
| 453 | Structured Concurrency | 1st Preview | 8 | Structured task lifetime management (evolving toward Java 27) |
| 454 | Foreign Function & Memory API | ✅ Final | 13 | Finalized in Java 21 |

---

## B.3 Java 25 JEPs (All 18 JEPs)

| JEP | Feature | Status | Chapter | Description |
|-----|---------|--------|---------|-------------|
| 470 | PEM Encodings of Cryptographic Objects | 1st Preview | 20 | PEMEncoder/PEMDecoder for key/cert PEM format |
| 492 | Flexible Constructor Bodies | ✅ Final | 17 | Statements before super()/this() in constructors |
| 502 | Stable Values | 1st Preview | 21 | Lazily-initialized JVM-optimized effectively-final values |
| 505 | Structured Concurrency | 5th Preview | 16 | New Joiner API; open() factory |
| 506 | Scoped Values | ✅ Final | 15 | Finalized after 4 preview rounds |
| 507 | Primitive Types in Patterns, instanceof, switch | 3rd Preview | — | Allow primitives in all pattern contexts |
| 508 | Vector API | 10th Incubator | 21 | SIMD operations; near-final pending Valhalla |
| 509 | JFR CPU-Time Profiling | Experimental | 21 | CPU-time vs wall-clock profiling in JFR (Linux) |
| 510 | Key Derivation Function API | ✅ Final | 20 | KDF.getInstance() for HKDF, PBKDF2 |
| 511 | Module Import Declarations | ✅ Final | 19 | import module java.base; imports all exported packages |
| 512 | Compact Source Files and Instance Main Methods | ✅ Final | 18 | No class declaration or public static main required |
| 519 | Compact Object Headers | ✅ Final | 21 | Object headers reduced from 96-128 bits to 64 bits |
| 520 | JFR Method Timing and Tracing | ✅ Final | 21 | Method-level tracing via bytecode instrumentation |
| 526 | Remove the 32-bit x86 Port | Removal | 21 | 32-bit x86 JVM code removed |
| — | Generational Shenandoah | ✅ Final | 21 | Generational mode for Shenandoah GC |

---

## B.4 Feature Evolution Table

Features that previewed across multiple releases before final:

| Feature | Preview Start | Final | Chapters |
|---------|--------------|-------|---------|
| Records | Java 14 (1st), Java 15 (2nd) | **Java 16** | 1 |
| Sealed Classes | Java 15 (1st), Java 16 (2nd) | **Java 17** | 2 |
| Pattern Matching for instanceof | Java 14 (1st), Java 15 (2nd) | **Java 16** | 3 |
| Text Blocks | Java 13 (1st), Java 14 (2nd) | **Java 15** | 4 |
| Switch Expressions | Java 13 (1st), Java 14 (2nd) | **Java 14** | 5 |
| Pattern Matching for switch | Java 17 (1st)…Java 20 (4th) | **Java 21** | 12 |
| Record Patterns | Java 19 (1st), Java 20 (2nd) | **Java 21** | 11 |
| Foreign Function & Memory API | Java 14…Java 21 (many rounds) | **Java 21/22** | 13 |
| Virtual Threads | N/A (single preview) | **Java 21** | 7 |
| Unnamed Patterns and Variables | Java 21 (1st), Java 22 (2nd) | **Java 22** | 14 |
| Scoped Values | Java 20 (incubator), Java 21–24 (preview) | **Java 25** | 9, 15 |
| Flexible Constructor Bodies | Java 22 (1st), Java 23 (2nd) | **Java 25** | 17 |
| Compact Source Files | Java 21–24 (preview) | **Java 25** | 18 |
| Module Import Declarations | Java 24 (1st preview) | **Java 25** | 19 |
| KDF API | Java 24 (1st preview) | **Java 25** | 20 |
| Compact Object Headers | Java 24 (experimental) | **Java 25** | 21 |

---

## B.5 Quick Reference: What Came With Which Java Version

### Language Features

| Feature | Java |
|---------|------|
| Text Blocks | 15 |
| Records | 16 |
| Sealed Classes | 17 |
| Pattern Matching for instanceof | 16 |
| Switch Expressions | 14 |
| Pattern Matching for switch | 21 |
| Record Patterns | 21 |
| Unnamed Patterns (_) | 22 |
| Flexible Constructor Bodies | 25 |
| Compact Source Files / Instance main() | 25 |
| Module Import Declarations | 25 |

### Concurrency

| Feature | Java |
|---------|------|
| Virtual Threads | 21 |
| Scoped Values | 25 (final) |
| Structured Concurrency | In preview (Java 21–25) |

### Collections

| Feature | Java |
|---------|------|
| Sequenced Collections | 21 |

### Security

| Feature | Java |
|---------|------|
| Context-Specific Deserialization Filters | 17 |
| Key Encapsulation Mechanism (KEM) | 21 |
| Key Derivation Function (KDF) | 25 (final) |
| PEM Encodings | 25 (preview) |

### JVM / GC / Performance

| Feature | Java |
|---------|------|
| ZGC | 11 |
| Shenandoah GC | 12 |
| Generational ZGC | 21 |
| Generational Shenandoah | 25 |
| Compact Object Headers | 25 (opt-in) |
| Vector API | Incubating since Java 16 |
| Foreign Function & Memory API | 21 (final) |

### APIs

| Feature | Java |
|---------|------|
| Enhanced PRNG (RandomGenerator) | 17 |
| HTTP Client (java.net.http) | 11 |
| JFR CPU-Time Profiling | 25 (experimental) |
| JFR Method Timing/Tracing | 25 |
