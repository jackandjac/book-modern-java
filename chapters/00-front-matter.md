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
