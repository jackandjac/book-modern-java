# Appendix A: Java Version Compatibility and Migration Guide

---

## A.1 Understanding the Java Release Cadence

Since Java 9, Oracle and the OpenJDK community follow a strict 6-month release cadence:
- New features are released every 6 months (March and September)
- LTS (Long-Term Support) releases occur every 3 years (Java 11, 17, 21, 25)
- LTS releases receive support for 8+ years (Oracle) or 5+ years (Adoptium/Temurin)

| Version | Release | LTS | Oracle Support |
|---------|---------|-----|----------------|
| Java 11 | Sep 2018 | ✅ LTS | Until Sep 2026 |
| Java 17 | Sep 2021 | ✅ LTS | Until Sep 2029 |
| Java 21 | Sep 2023 | ✅ LTS | Until Sep 2031 |
| **Java 25** | **Sep 2025** | **✅ LTS** | **Until Sep 2033** |

**Recommendation for enterprises**: Upgrade from Java 11 → Java 17 → Java 21 → Java 25 (or skip to 25 directly if currently on 11).

---

## A.2 Migrating from Java 11 to Java 17

### Breaking Changes

**Strong Encapsulation (JEP 403)**:
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

**Common libraries that needed updates for Java 17**:

| Library | Min version for Java 17 |
|---------|------------------------|
| Spring Boot | 2.7.x (full support in 3.0+) |
| Hibernate | 5.6+ (6.0+ for full support) |
| Mockito | 4.0+ |
| ByteBuddy | 1.12+ |
| Jackson | 2.13+ |
| Lombok | 1.18.20+ |
| CGLIB | 3.3.0+ (or switch to ByteBuddy) |

### Maven Configuration for Java 17

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

### Gradle Configuration for Java 17

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

## A.3 Migrating from Java 17 to Java 21

Java 21 has **no major breaking changes** for well-behaved Java 17 code. The migration is primarily about updating frameworks and adopting new features.

### Framework Versions for Java 21

| Framework | Min version for Java 21 |
|-----------|------------------------|
| Spring Boot | 3.2+ (virtual thread support) |
| Quarkus | 3.6+ |
| Micronaut | 4.2+ |
| Hibernate | 6.4+ |
| JUnit | 5.10+ |
| Mockito | 5.4+ |

### Enabling Virtual Threads

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

### Maven Configuration for Java 21

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

## A.4 Migrating from Java 21 to Java 25

### Scoped Values API (if using preview from Java 21)

The Scoped Values API was **finalized without changes** from the Java 24 preview. If you were using `--enable-preview` in Java 21–24 for `ScopedValue`:

```bash
# Before Java 25: required --enable-preview
java --enable-preview -jar myapp.jar

# Java 25: ScopedValue is final, no flag needed
java -jar myapp.jar
```

No code changes required.

### Structured Concurrency (if using preview)

The `StructuredTaskScope.ShutdownOnFailure` and `ShutdownOnSuccess` subclasses are **replaced** by `StructuredTaskScope.open(Joiner.*)` in Java 25. Migration:

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

### Compact Object Headers

Opt-in — existing code works unchanged:
```bash
java -XX:+UseCompactObjectHeaders -jar myapp.jar
```

---

## A.5 Docker Configuration

### Multi-stage builds with Java 25

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

### JVM Flags for Production Containers

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

## A.6 Common Migration Issues and Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| `InaccessibleObjectException` | Strong encapsulation (Java 17+) | Add `--add-opens` or update library |
| `NoSuchMethodError: Thread.getId()` | `Thread.getId()` deprecated in Java 19, removed in Java 21 | Use `Thread.threadId()` |
| `ClassNotFoundException: sun.misc.BASE64Encoder` | Internal class, removed | Use `java.util.Base64` |
| `SecurityException: Security Manager` | Security Manager removal (Java 17 deprecated, 24 removed) | Remove Security Manager code |
| Reflection breaks on JDK internals | Strong encapsulation | Update library version |
| `synchronized` blocks causing pinning on VTs | Virtual thread pinning | Use `ReentrantLock` |
| High memory with ThreadLocal on VTs | O(thread) ThreadLocal copies | Use `ScopedValue` |
| `--illegal-access` flag error | Removed in Java 17 | Remove flag, add `--add-opens` if needed |

---

## A.7 IDE and Tool Support Matrix

| Tool | Java 17 | Java 21 | Java 25 |
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
