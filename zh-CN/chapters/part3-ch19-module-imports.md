# 第19章：模块导入声明（Module Import Declarations）（JEP 511，Java 25 正式发布）

模块导入声明（Module Import Declarations，JEP 511）在 Java 25 中正式发布，此前在 Java 24（JEP 476）中经历了一轮预览。该特性允许通过单个 `import module` 声明导入一个模块的所有导出包——大幅减少了使用大量模块类时的导入样板代码。

---

## 19.1 问题所在：跨模块边界的冗长通配符导入

通配符导入（Wildcard Import，`import java.util.*`）可以导入单个包中的所有类型。但模块包含多个包。如果你使用了 `java.net.http` 中的许多类，就需要多条导入语句：

```java
// 传统方式：需要分别导入每个包
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpHeaders;
import java.net.http.WebSocket;
// ... 以及该模块中其他包的更多导入
```

使用模块导入后：

```java
// Java 25：一条导入语句覆盖 java.net.http 的所有导出包
import module java.net.http;
// 现在 java.net.http 中所有导出的类型均可使用
```

---

## 19.2 语法：`import module <模块名>;`

```java
import module java.base;          // 导入 java.base 的所有导出包
import module java.net.http;      // 导入 java.net.http 的所有导出包
import module java.sql;           // 导入 java.sql 的所有导出包
import module java.desktop;       // 导入 java.desktop 的所有导出包
```

模块导入（Module Import）与普通导入出现在同一位置，即包声明之后：

```java
package com.example.demo;

import module java.base;       // String、List、Map 等——实际上 java.base 已经是隐式导入的
import module java.net.http;   // HttpClient、HttpRequest、HttpResponse 等

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

## 19.3 导入的内容

只有**已导出的**包会被导入——即从模块外部通过模块图（Module Graph）可见的那些包。未导出的包（内部实现）永远无法访问：

```java
// java.base 导出的包（部分列举）：
// java.lang、java.util、java.io、java.math、java.nio、java.net 等

import module java.base;
// 现在可用：String、List、Map、Path、Files、Optional、BigDecimal、
//           ByteBuffer、Duration、Instant 等
// 不可用：sun.misc.*、jdk.internal.* 等（未导出）
```

---

## 19.4 冲突解决

如果两个模块导入导出了相同的简单类型名（Simple Type Name），在使用时会产生编译错误（歧义）。可以通过具体的单类型导入（Single-Type Import）来解决：

```java
import module java.sql;       // 导出 java.sql.Date
import module java.util;      // ... 等等，java.util 属于 java.base，不是独立模块
                              // 让我们用一个更贴切的例子：

import module java.sql;       // 导出 java.sql.Date、java.sql.Time 等
// java.util.Date 可通过 java.base 的隐式导入获得

// 使用 'Date' 会产生歧义——可能是 java.sql.Date 或 java.util.Date
// 解决方案：具体的单类型导入优先
import java.util.Date;        // 该单类型导入优先于模块导入

Date d = new Date();          // java.util.Date——具体导入优先
```

规则是：**单类型导入始终优先于模块导入**，模块导入在解析顺序中最后被尝试。

---

## 19.5 在未命名模块（类路径代码）中使用模块导入

一个关键的设计决策：**你不需要处于命名模块（Named Module）中**就能使用 `import module`。从类路径（Classpath）运行的代码（即未命名模块，Unnamed Module）可以自由使用模块导入：

```java
// 传统类路径应用程序（不需要 module-info.java）
// 文件：OrderProcessor.java，使用类路径编译

import module java.base;       // String、List、Map、Optional 等
import module java.net.http;   // HttpClient 等
import module java.sql;        // Connection、PreparedStatement 等

public class OrderProcessor {
    public void processOrders(Connection db) throws Exception {
        var stmt = db.prepareStatement(
            "SELECT * FROM orders WHERE status = ?");
        stmt.setString(1, "PENDING");
        var rs = stmt.executeQuery();
        // ... 处理结果
    }
}
```

---

## 19.6 在命名模块中使用模块导入

在模块化应用程序中，源文件中的 `import module` 与 `module-info.java` 中的 `requires` 是**相互独立的**：

```java
// module-info.java：在模块级别声明模块依赖
module com.example.orders {
    requires java.sql;           // 仍然必须在此声明依赖
    requires java.net.http;
    exports com.example.orders;
}

// OrderService.java：import module 是源文件级别的便捷写法
import module java.sql;          // 在命名模块中同样有用
import module java.net.http;

public class OrderService {
    // 无需逐个输入每个包的导入语句
}
```

**关键区别**：`module-info.java` 中的 `requires java.sql` 是一个**模块依赖声明**——它影响模块解析、封装和类路径。源文件中的 `import module java.sql` 纯粹是一种**源码便捷写法**——它只影响该文件中哪些简单名称可以被解析。两者服务于不同的目的，在编写模块化代码时都是必需的。

---

## 19.7 实际使用：常见模块导入

```java
// java.base——隐式可用，但显式模块导入有助于表明意图
import module java.base;

// java.net.http——HTTP 客户端 API
import module java.net.http;

// java.sql——JDBC API
import module java.sql;

// java.xml——XML 处理
import module java.xml;

// java.logging——java.util.logging
import module java.logging;

// java.management——JMX
import module java.management;

// 第三方模块（使用模块系统时）
import module com.fasterxml.jackson.databind;
import module io.micrometer.core;
```

---

## 19.8 在未命名类中使用模块导入

模块导入与未命名类（Unnamed Class，见第18章）的搭配尤为出色，在这种场景下你希望使用多个 API 而不需要显式的 `module-info.java`：

```java
// 文件：HttpDemo.java——带有模块导入的未命名类
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

直接运行：
```bash
java HttpDemo.java
```

---

## 19.9 总结

模块导入声明（Module Import Declarations，JEP 511，Java 25 正式发布）：

- **`import module <名称>`** 通过一条声明导入模块的所有导出包
- **适用于所有场景**：未命名模块（类路径）、命名模块、未命名类
- **冲突解决**：单类型导入始终优先于模块导入
- **不是模块依赖**：源文件中的 `import module` 不等于 `module-info.java` 中的 `requires`
- **与未命名类完美搭配**，可编写简洁、低仪式感的 Java 脚本

在大量使用同一模块中类型的代码中，请积极采用模块导入。导入样板代码的减少在未命名类和探索性代码中尤为受欢迎。
