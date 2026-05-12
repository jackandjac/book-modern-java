# 附录 A：Java 版本兼容性与迁移指南

---

## A.1 了解 Java 发布节奏

自 Java 9 起，Oracle 和 OpenJDK 社区遵循严格的 6 个月发布节奏（release cadence）：
- 每 6 个月发布新功能（3 月和 9 月）
- LTS（长期支持，Long-Term Support）版本每 3 年发布一次（Java 11、17、21、25）
- LTS 版本可获得 8 年以上（Oracle）或 5 年以上（Adoptium/Temurin）的支持

| 版本 | 发布时间 | LTS | Oracle 支持期限 |
|---------|---------|-----|----------------|
| Java 11 | 2018 年 9 月 | ✅ LTS | 至 2026 年 9 月 |
| Java 17 | 2021 年 9 月 | ✅ LTS | 至 2029 年 9 月 |
| Java 21 | 2023 年 9 月 | ✅ LTS | 至 2031 年 9 月 |
| **Java 25** | **2025 年 9 月** | **✅ LTS** | **至 2033 年 9 月** |

**企业升级建议**：从 Java 11 → Java 17 → Java 21 → Java 25 逐步升级（如果目前使用的是 Java 11，也可以直接跳到 25）。

---

## A.2 从 Java 11 迁移到 Java 17

### 破坏性变更

**强封装（Strong Encapsulation，JEP 403）**：
```bash
# Java 11: --illegal-access=permit was the default (and worked)
# Java 17: --illegal-access is REMOVED. Reflective access to JDK internals throws.

# Error you'll see:
# java.lang.reflect.InaccessibleObjectException: Unable to make ... accessible

# Short-term fix: add --add-opens
java --add-opens java.base/java.lang=ALL-UNNAMED \
     --add-opens java.base/java.util=ALL-UNNAMED \
     -jar myapp.jar
```

**需要为 Java 17 更新的常用库**：

| 库 | Java 17 最低版本要求 |
|---------|------------------------|
| Spring Boot | 2.7.x（3.0+ 完全支持） |
| Hibernate | 5.6+（6.0+ 完全支持） |
| Mockito | 4.0+ |
| ByteBuddy | 1.12+ |
| Jackson | 2.13+ |
| Lombok | 1.18.20+ |
| CGLIB | 3.3.0+（或切换到 ByteBuddy） |

### Java 17 的 Maven 配置

```xml
<project>
    <properties>
        <java.version>17</java.version>
        <maven.compiler.release>17</maven.compiler.release>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>17</release>
                    <!-- For preview features: -->
                    <!-- <compilerArgs>
                        <arg>--enable-preview</arg>
                    </compilerArgs> -->
                </configuration>
            </plugin>

            <!-- Enable preview in tests/runtime if needed -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
                <configuration>
                    <!-- Add if using preview features or need internal access -->
                    <argLine>
                        --add-opens java.base/java.lang=ALL-UNNAMED
                        --add-opens java.base/java.util=ALL-UNNAMED
                    </argLine>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Java 17 的 Gradle 配置

```kotlin
// build.gradle.kts
plugins {
    java
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

tasks.withType<JavaCompile>().configureEach {
    options.release = 17
    // For preview features:
    // options.compilerArgs.addAll(listOf("--enable-preview", "--release", "17"))
}

tasks.withType<Test>().configureEach {
    jvmArgs(
        "--add-opens", "java.base/java.lang=ALL-UNNAMED",
        "--add-opens", "java.base/java.util=ALL-UNNAMED"
    )
    // For preview at test runtime:
    // jvmArgs("--enable-preview")
}
```

---

## A.3 从 Java 17 迁移到 Java 21

对于规范的 Java 17 代码，Java 21 **没有重大破坏性变更**。迁移工作主要集中在更新框架和采用新特性上。

### Java 21 的框架版本要求

| 框架 | Java 21 最低版本要求 |
|-----------|------------------------|
| Spring Boot | 3.2+（支持虚拟线程） |
| Quarkus | 3.6+ |
| Micronaut | 4.2+ |
| Hibernate | 6.4+ |
| JUnit | 5.10+ |
| Mockito | 5.4+ |

### 启用虚拟线程（Virtual Threads）

```yaml
# Spring Boot 3.2+ — single property
spring:
  threads:
    virtual:
      enabled: true
```

```java
// Custom executor service — drop-in replacement
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
```

### Java 21 的 Maven 配置

```xml
<properties>
    <maven.compiler.release>21</maven.compiler.release>
</properties>

<!-- Spring Boot parent for Java 21 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.1</version>
</parent>
```

---

## A.4 从 Java 21 迁移到 Java 25

### 作用域值 API（Scoped Values API）（如果使用了 Java 21 的预览功能）

作用域值 API 从 Java 24 的预览版开始**最终定稿且未做更改**。如果您在 Java 21-24 中通过 `--enable-preview` 使用了 `ScopedValue`：

```bash
# Before Java 25: required --enable-preview
java --enable-preview -jar myapp.jar

# Java 25: ScopedValue is final, no flag needed
java -jar myapp.jar
```

无需修改代码。

### 结构化并发（Structured Concurrency）（如果使用了预览功能）

`StructuredTaskScope.ShutdownOnFailure` 和 `ShutdownOnSuccess` 子类在 Java 25 中被 `StructuredTaskScope.open(Joiner.*)` **所取代**。迁移方式：

```java
// Java 21 preview:
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var t1 = scope.fork(() -> serviceA.call());
    var t2 = scope.fork(() -> serviceB.call());
    scope.join().throwIfFailed();
    return new Result(t1.get(), t2.get());
}

// Java 25 preview (new API):
try (var scope = StructuredTaskScope.open(Joiner.allSuccessfulOrThrow())) {
    var t1 = scope.fork(() -> serviceA.call());
    var t2 = scope.fork(() -> serviceB.call());
    scope.join();
    return new Result(t1.get(), t2.get());
}
```

### 紧凑对象头（Compact Object Headers）

可选启用 -- 现有代码无需更改即可正常运行：
```bash
java -XX:+UseCompactObjectHeaders -jar myapp.jar
```

---

## A.5 Docker 配置

### 使用 Java 25 的多阶段构建（Multi-stage Builds）

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:25-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Extract layers for better Docker caching
FROM builder AS layers
WORKDIR /app
RUN java -Djarmode=layertools -jar target/*.jar extract

# Stage 3: Runtime image
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy layers in order of change frequency (least to most)
COPY --from=layers /app/dependencies/ ./
COPY --from=layers /app/spring-boot-loader/ ./
COPY --from=layers /app/snapshot-dependencies/ ./
COPY --from=layers /app/application/ ./

# Enable virtual threads (if not configured in application.yml)
ENV JAVA_OPTS="-XX:+UseZGC -XX:+ZGenerational -XX:+UseCompactObjectHeaders"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} org.springframework.boot.loader.launch.JarLauncher"]
```

### 生产容器的 JVM 参数

```bash
# Recommended JVM flags for Java 25 containers (adjust -Xmx to container memory)
java \
  -XX:+UseZGC -XX:+ZGenerational \
  -XX:+UseCompactObjectHeaders \
  -Xmx$(expr $CONTAINER_MEMORY_MB - 256)m \
  -XX:MaxDirectMemorySize=256m \
  -XX:+ExitOnOutOfMemoryError \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/tmp/heapdump.hprof \
  -jar myapp.jar
```

---

## A.6 常见迁移问题与解决方案

| 问题 | 根本原因 | 解决方案 |
|-------|-----------|----------|
| `InaccessibleObjectException` | 强封装（Strong Encapsulation，Java 17+） | 添加 `--add-opens` 或更新库版本 |
| `NoSuchMethodError: Thread.getId()` | `Thread.getId()` 在 Java 19 中废弃，Java 21 中移除 | 使用 `Thread.threadId()` |
| `ClassNotFoundException: sun.misc.BASE64Encoder` | 内部类，已移除 | 使用 `java.util.Base64` |
| `SecurityException: Security Manager` | 安全管理器（Security Manager）移除（Java 17 废弃，Java 24 移除） | 移除安全管理器相关代码 |
| 反射访问 JDK 内部 API 失败 | 强封装 | 更新库版本 |
| `synchronized` 代码块导致虚拟线程固定（pinning） | 虚拟线程固定（Virtual Thread Pinning） | 使用 `ReentrantLock` |
| 虚拟线程上使用 ThreadLocal 导致高内存消耗 | O(线程数) 的 ThreadLocal 副本 | 使用 `ScopedValue` |
| `--illegal-access` 参数报错 | 该参数在 Java 17 中已移除 | 移除该参数，如有需要改用 `--add-opens` |

---

## A.7 IDE 与工具支持矩阵

| 工具 | Java 17 | Java 21 | Java 25 |
|------|---------|---------|---------|
| IntelliJ IDEA | 2021.2+ | 2023.3+ | 2025.3+ |
| Eclipse | 4.21+ | 4.29+ | 4.34+ |
| VS Code (Java Ext) | 1.10+ | 1.24+ | Latest |
| Maven | 3.8+ | 3.9+ | 3.9+ |
| Gradle | 7.3+ | 8.4+ | 8.10+ |
| JUnit | 5.8+ | 5.10+ | 5.11+ |
| Checkstyle | 9.x | 10.x | 10.x |
| PMD | 6.41+ | 7.x | 7.x |
| SpotBugs | 4.4+ | 4.8+ | 4.9+ |
