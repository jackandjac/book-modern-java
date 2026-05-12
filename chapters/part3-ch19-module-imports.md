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
