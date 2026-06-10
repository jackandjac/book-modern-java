# Chapter 13: Foreign Function and Memory API

The Foreign Function and Memory API (JEP 454, finalized in **Java 22**; 3rd preview JEP 442 in Java 21) is the result of Project Panama — a multi-year effort to replace JNI with a safer, more expressive API for calling native code and manipulating native memory. If you've ever wrestled with JNI boilerplate, hand-written C header files, or unsafe `Unsafe` usage, FFM API is the modern solution.

> **Note**: The code examples in this chapter use `findOrThrow()` and `Arena.allocateFrom(String)`, both of which are Java 22+ APIs. In Java 21 (preview), use `find("name").orElseThrow()` and `arena.allocateUtf8String("text")` respectively.

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
            STDLIB.find("strlen").orElseThrow(),  // Java 21 API (findOrThrow is Java 22+)
            FunctionDescriptor.of(
                ValueLayout.JAVA_LONG,   // return type: size_t (long on 64-bit)
                ValueLayout.ADDRESS      // parameter: const char*
            )
        );
    }

    public static long strlen(String s) throws Throwable {
        try (Arena arena = Arena.ofConfined()) {
            // Convert Java String to null-terminated C string
            // Java 21: arena.allocateUtf8String(s)
            // Java 22+: arena.allocateFrom(s)   ← preferred in Java 22+
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
        STDLIB.find("clock_gettime").orElseThrow(),  // Java 21; Java 22+ use findOrThrow()
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
    mathLib.find("pow").orElseThrow(),  // Java 21; Java 22+ use findOrThrow()
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
                STDLIB.find("qsort").orElseThrow(),  // Java 21; Java 22+ use findOrThrow()
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
