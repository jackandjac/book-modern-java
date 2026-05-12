# 第4章：深入理解文本块

文本块（Text Blocks）（JEP 378，在 Java 15 中正式定稿，Java 17 中可用）乍看之下似乎很简单——它们只是具有更优雅语法的多行字符串。但其中蕴含着真正的深度：缩进算法（indentation algorithm）、转义序列（escape sequences）以及组合模式使文本块成为一个强大的工具，资深开发者应当充分理解它，而非仅仅一扫而过。

---

## 4.1 文本块出现之前的字符串字面量：转义地狱

在文本块出现之前，在 Java 代码中嵌入结构化文本是一件痛苦的事情：

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

这段代码在技术上是正确的，但在视觉上却令人痛苦。每个双引号都必须转义，每个换行符都需要显式声明，而嵌入文本的实际结构被 Java 语法噪音所淹没。

---

## 4.2 语法：三引号定界符

文本块以 `"""` 开头，后跟可选的空白符和一个换行符，并以 `"""` 结尾：

```java
// The opening """ MUST be followed by a newline
String json = """
        {
          "customerId": "C-001",
          "status": "ACTIVE"
        }
        """;
```

关键规则：
- 开头的 `"""` 之后不能在同一行上跟随内容
- 结尾的 `"""` 决定了缩进基线（参见第 4.3 节）
- 结果是一个 `String`——没有新类型，完全兼容所有接受 `String` 的地方

使用文本块后，我们的 SQL 查询变成了：

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

## 4.3 附带空白与必要空白：缩进算法

这是文本块中最重要但最不被理解的方面。编译器区分以下两种空白：

- **附带空白（incidental whitespace）**：为使文本块与周围代码对齐而添加的缩进
- **必要空白（essential whitespace）**：实际属于字符串内容一部分的空白

该算法确定"公共前导空白前缀"（common leading whitespace prefix）并从每一行中剥离它。**结尾 `"""` 的位置**是关键：

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

实用模式：**将结尾 `"""` 放在单独一行，缩进到与内容相同的层级**。这样可以得到干净的、无填充的内容：

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

## 4.4 行终止符处理

文本块始终将行尾规范化为 `\n`（LF），无论运行在什么平台上。这对于跨平台一致性至关重要：

```java
// Always LF, even on Windows
String block = """
        line one
        line two
        """;
assert block.equals("line one\nline two\n");
```

如果你需要在文本块输出中使用 Windows 风格的行尾（CRLF），请显式使用 `\r` 转义：

```java
String withCRLF = """
        line one\r
        line two\r
        """;
```

---

## 4.5 新转义序列：`\<行终止符>` 和 `\s`

Java 14+ 专门为文本块新增了两个转义序列：

### `\` —— 行续接（抑制换行）

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

当字符串在逻辑上是单行，但你希望为了可读性而换行时，这个特性非常有用。

### `\s` —— 显式空格（保留行尾空白）

编译器默认会剥离每行的行尾空白。`\s` 代表一个空格，并防止其左侧的空白被剥离：

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

当文本块内容用于对精确间距有要求的场景时（协议消息、定宽格式），这个特性非常有用。

---

## 4.6 文本块与常见数据格式

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

## 4.7 文本块与 String.formatted() 及 String 方法

文本块是 `String` 实例，可以与所有 `String` 方法配合使用：

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

## 4.8 文本块在测试代码中的应用

文本块在测试代码中最能大放异彩——期望值变得可读性极强：

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

## 4.9 多行字符串对齐策略

有时你需要文本块的对齐方式与包围它的代码不同：

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

对于文本块内部的多级缩进（例如包含嵌套对象的 JSON），块内的缩进会作为*必要空白*被保留：

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

## 4.10 常见陷阱

### 行尾空白的不可见性

IDE 自动格式化工具通常会剥离行尾空白。如果你的文本块内容需要行尾空格，请使用 `\s` 来防止意外剥离。

### 结尾 `"""` 的位置至关重要

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

### 结尾 `"""` 内联时没有尾随换行

```java
String noTrailingNewline = """
        content""";
// "content" — no trailing \n

String withTrailingNewline = """
        content
        """;
// "content\n" — trailing \n present
```

保持一致：大多数调用方不关心尾随换行，但 SQL 驱动程序和 JSON 解析器可能会在意。如有疑问，请使用 `.strip()`。

### 源文件中的 Windows CRLF

如果你的源文件使用 CRLF 行尾（Windows 默认），文本块内容仍然会被规范化为 LF——编译器会处理这一点。这几乎总是正确的行为。

---

## 4.11 总结

文本块是 Java 字符串处理中一个简洁但有深度的新增特性：

- **消除转义噪音**，适用于多行 JSON、SQL、HTML、XML、YAML 及其他结构化格式
- **缩进算法**剥离公共前导空白；结尾 `"""` 的位置控制基线
- **新转义序列**：`\` 用于行续接，`\s` 用于显式空格保留
- **与 `String.formatted()` 无缝配合**，实现字符串插值（string interpolation）
- **在测试代码中影响最大**，使期望值成为可读的文档

请大胆采用文本块。任何时候当你发现自己在为结构化文本使用 `\n` 和 `\"` 进行字符串拼接时，文本块都能同时提升可读性和可维护性。
