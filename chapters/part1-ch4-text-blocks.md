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

// Case 3: closing """ inline with content (after last content character)
String c = """
        Hello
        World""";
// Result: "Hello\nWorld"  (no trailing newline, and NO leading spaces —
// the closing """ position is at column 8, matching the content indentation,
// so all 8 leading spaces are still stripped)
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
