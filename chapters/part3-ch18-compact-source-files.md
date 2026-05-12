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
