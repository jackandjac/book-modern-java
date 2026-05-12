# 第18章：紧凑源文件与实例 Main 方法（JEP 512，Java 25 正式发布）

紧凑源文件（Compact Source Files）与实例 Main 方法（Instance Main Methods）（JEP 512）在经历四轮预览（Java 21-24）后，于 Java 25 正式发布。该特性允许 Java 程序无需传统的 `public class`、`public static void main(String[] args)` 以及 import 语句即可运行——使 Java 适用于脚本编写、快速原型开发和初学者教学，同时不会对生产代码造成任何影响。

---

## 18.1 目标：平滑的入门路径，无需妥协

Java 团队明确提出的目标是：*学生可以编写他们的第一个程序，而无需理解那些为大型程序设计的语言特性*。但对于有经验的工程师而言，这意味着：**以最少的样板代码（boilerplate）编写 Java 脚本和工具程序**。

---

## 18.2 实例 Main 方法

传统的 `main` 方法需要三个修饰符（modifier）：`public`、`static` 和 `String[] args`。在 Java 25 中，这些都是可选的：

```java
// 传统方式（仍然有效，且将一直有效）：
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Java 25：所有修饰符均为可选
class Hello {
    void main() {
        System.out.println("Hello, World!");
    }
}
```

启动器（launcher）按以下顺序尝试这些变体，使用找到的第一个匹配项：

| 优先级 | 方法签名 |
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

## 18.3 未命名类：无需 class 声明的文件

**未命名类（unnamed class）** 是一种没有显式类声明的源文件。编译器会将其内容包装在一个合成的（synthetic）未命名类中：

```java
// 文件：Hello.java —— 没有类声明
void main() {
    System.out.println("Hello, World!");
}
```

```bash
java Hello.java   # 直接源文件启动（Java 11+）
javac Hello.java  # 编译为 Hello.class
java Hello        # 运行编译后的版本
```

未命名类可以包含：
- 方法声明（method declarations）
- 字段声明（field declarations）
- 静态初始化块（static initializers）

未命名类**不能**包含：
- 包声明（package declarations）
- 显式类/接口声明
- 模块声明（module declarations）
- 构造函数（没有类名可供构造）

---

## 18.4 隐式导入的类

未命名类会隐式导入以下内容：

```java
// 在未命名类中自动可用（Java 25）：
import java.lang.*;   // String, System, Math 等
import java.io.*;     // println() 和 java.io.IO 类
import java.util.*;   // List, Map, ArrayList 等
```

`java.io.IO` 类提供了 `println()`、`print()` 和 `readln()` 作为静态方法，用于简化 I/O 操作：

```java
// 文件：Calculator.java
void main() {
    println("Enter a number:");         // java.io.IO.println()
    String input = readln(">> ");       // java.io.IO.readln()
    double number = Double.parseDouble(input);
    println("Square root: " + Math.sqrt(number));
}
```

---

## 18.5 高级用法：脚本与工具程序

对于有经验的工程师而言，未命名类在脚本任务中非常强大：

```java
// 文件：ProcessLog.java —— 日志分析脚本
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

运行方式：
```bash
java ProcessLog.java application.log
```

---

## 18.6 数据处理脚本

```java
// 文件：CsvSummary.java
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

record Sale(String region, String product, double amount) {}

void main(String[] args) throws Exception {
    var csvFile = Path.of(args.length > 0 ? args[0] : "sales.csv");

    var sales = Files.lines(csvFile)
        .skip(1)  // 跳过表头
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

## 18.7 编译原理：底层机制

编译器将未命名类文件包装在一个合成类中：

```java
// 源文件：Hello.java
void main() {
    println("Hello!");
}

// 大致编译为：
final class Hello {
    void main() {
        System.out.println("Hello!");
    }
    // 合成的无参构造函数
    Hello() {}
}
```

类名从文件名派生。`main()` 方法是基于实例的——启动器通过无参构造函数创建实例，然后调用 `main()`。

---

## 18.8 未命名类中的模块导入声明

Java 25 的模块导入声明（Module Import Declarations）（第19章）与未命名类天然配合：

```java
// 导入 java.base 和 java.net.http 的所有导出包
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

## 18.9 局限性

- **无法使用包声明**：未命名类属于未命名包（unnamed package）
- **无法通过名称引用**：你无法从其他类中导入未命名类
- **不能包含嵌套类声明**（但允许使用记录类声明（record declarations））
- **IDE 支持程度不一**：IntelliJ 和 VS Code Java 扩展在 Java 25 中支持未命名类

---

## 18.10 总结

紧凑源文件与实例 Main 方法在 Java 25 中正式发布：

- **实例 `main()` 方法**：可省略 `public`、`static`、`String[] args`——全部可选
- **未命名类**：编写 Java 代码无需类声明——文件名即为类名
- **隐式导入**：`java.lang`、`java.io`、`java.util` 自动导入
- **对专业人员的价值**：无需构建系统即可编写 Java 脚本——直接运行 `.java` 文件
- **生产代码不受影响**：传统类结构仍然正确，且在生产环境中更为推荐

该特性并未改变生产环境中的 Java——它降低了脚本、教程和快速实验的入门成本，在这些场景中传统的类结构纯粹是多余的形式。
