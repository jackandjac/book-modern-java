# 第13章：外部函数和内存 API（Foreign Function and Memory API）

外部函数和内存 API（Foreign Function and Memory API，JEP 454，在 Java 21 中正式发布）是 Panama 项目（Project Panama）的成果——这是一项历时多年的工作，旨在用一套更安全、更具表达力的 API 来替代 JNI（Java Native Interface），用于调用本地代码和操作本地内存。如果你曾经被 JNI 的样板代码、手写 C 头文件或不安全的 `Unsafe` 用法所困扰，那么 FFM API 就是现代化的解决方案。

---

## 13.1 为什么 JNI 需要被替代

JNI（Java Native Interface）自 Java 1.1 起就服务于 Java，但它存在众所周知的问题：

- **冗长繁琐**：编写 JNI 需要生成 C 头文件（`javah`）、编写 C 实现、加载共享库
- **默认不安全**：本地内存操作完全没有检查
- **容易出错**：C 端的 JNI 代码将 Java 对象处理与本地代码混合在一起——很容易导致 JVM 崩溃
- **开发体验差**：没有 IDE 支持，需要手动类型映射，出错时直接崩溃退出

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

FFM API 在许多使用场景中完全消除了 C 端代码的需要。

---

## 13.2 核心抽象

| 类 | 用途 |
|-------|---------|
| `MemorySegment` | 一段连续的内存区域（堆内或堆外） |
| `MemoryLayout` | 描述内存的结构（结构体、联合体、数组） |
| `Arena` | 控制本地内存分配的生命周期 |
| `Linker` | 将 Java 方法句柄（method handle）链接到本地函数 |
| `SymbolLookup` | 在共享库中查找本地函数符号 |
| `FunctionDescriptor` | 描述本地函数的参数类型和返回类型 |

---

## 13.3 Arena：管理本地内存生命周期

`Arena` 是关键的安全原语（safety primitive）。通过 Arena 分配的所有本地内存会在 Arena 关闭时释放——无需手动调用 `free()`：

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

## 13.4 MemoryLayout：描述 C 结构体

`MemoryLayout` 以类型安全的方式描述 C 数据的结构：

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

## 13.5 调用本地函数：strlen 示例

`Linker` 将 Java 方法句柄连接到本地 C 函数：

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

## 13.6 操作 C 结构体：分配与读取

一个更实际的示例：分配并读取 C `timespec` 结构体：

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

## 13.7 加载外部库

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

## 13.8 上行调用（Upcall）：从本地代码回调 Java

FFM API 还支持**上行调用（upcall）**——将 Java 方法句柄作为 C 函数指针传递给本地代码：

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

## 13.9 FFM 与 JNI：对比

| 方面 | JNI | FFM API（Java 21） |
|--------|-----|-------------------|
| 需要 C 样板代码 | 是（每个方法都需要） | 否 |
| 类型安全 | 弱（C 端无检查） | 强（布局经过验证） |
| 内存安全 | 无——可能导致 JVM 崩溃 | Arena 管理，安全 |
| 工具支持 | javah（已废弃） | jextract（自动生成绑定） |
| 性能 | 优秀 | 相当（JIT 优化） |
| 空终止字符串 | 手动处理 | `allocateFrom(String)` |
| 结构体映射 | 手动偏移量计算 | `MemoryLayout.structLayout()` |
| 上行调用（Java 回调 C） | 复杂 | `Linker.upcallStub()` |

---

## 13.10 总结

外部函数和内存 API 消除了 JNI 的痛点：

- **`Arena`** 安全地管理本地内存生命周期——无需手动 `free()`
- **`MemorySegment`** 提供对本地内存区域的类型安全访问
- **`MemoryLayout`** 描述 C 结构体布局，包括填充（padding）和对齐（alignment）
- **`Linker`** 将 Java `MethodHandle` 连接到本地 C 函数
- **`SymbolLookup`** 在共享库中查找符号
- **上行调用（Upcall）** 允许将 Java 回调作为函数指针传递给本地代码
- **在 Java 21 中正式发布** ——已可用于生产环境，替代 JNI 用于新的互操作代码

对于有大量本地互操作需求的项目，可以将 FFM API 与 `jextract`（可从 OpenJDK 工具集获取）配合使用，从 C 头文件自动生成 Java 绑定。
