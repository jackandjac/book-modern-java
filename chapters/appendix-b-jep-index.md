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
| 412 | Foreign Function & Memory API | 1st Incubator | 13 | Access native code and memory (finalized in Java 22 as JEP 454) |
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
| 442 | Foreign Function & Memory API | 3rd Preview | 13 | Access native functions and memory (preview in Java 21; finalized in Java 22 as JEP 454) |
| 443 | Unnamed Patterns and Variables | 1st Preview | 14 | _ wildcard in patterns and variables |
| 444 | Virtual Threads | ✅ Final | 7 | JVM-managed lightweight threads for I/O scalability |
| 445 | Unnamed Classes and Instance Main Methods | 1st Preview | 18 | Reduce ceremony for simple programs |
| 446 | Scoped Values | 1st Preview | 9 | Immutable per-scope thread context (finalized in Java 25) |
| 448 | Vector API | 6th Incubator | 21 | SIMD operations from Java |
| 449 | Deprecate Windows 32-bit x86 Port | Deprecated | — | Windows 32-bit JVM deprecated |
| 451 | Prepare to Disallow the Dynamic Loading of Agents | Warning | — | JVM warns when agents loaded into running JVM |
| 452 | Key Encapsulation Mechanism API | ✅ Final | 20 | javax.crypto.KEM for post-quantum cryptography |
| 453 | Structured Concurrency | 1st Preview | 8 | Structured task lifetime management (evolving toward Java 27) |
| 454 | Foreign Function & Memory API | ✅ Final | 13 | Finalized in **Java 22** (not Java 21 — common mistake) |

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
