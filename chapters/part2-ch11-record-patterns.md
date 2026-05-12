# Chapter 11: Record Patterns

Record patterns (JEP 440, finalized in Java 21) extend pattern matching to support **deconstruction of record values**. Where type patterns let you test and extract the type of an object, record patterns let you simultaneously test the type *and* destructure its components in a single expression. Combined with sealed classes, this enables exhaustive, readable, compiler-verified data navigation.

---

## 11.1 From Type Patterns to Record Patterns

Type patterns (finalized in Java 16, Chapter 3) allow:

```java
if (obj instanceof String s) {
    System.out.println(s.length()); // s is bound as String
}
```

Record patterns extend this: if `obj` is a record, you can **destructure** its components inline:

```java
record Point(double x, double y) {}

// Type pattern: extract the whole record
if (obj instanceof Point p) {
    System.out.println(p.x() + ", " + p.y()); // call accessors
}

// Record pattern: destructure directly
if (obj instanceof Point(double x, double y)) {
    System.out.println(x + ", " + y); // components bound directly
}
```

---

## 11.2 Record Deconstruction Pattern Syntax

```java
record Person(String name, int age) {}
record Address(String street, String city, String country) {}
record Employee(Person person, Address address, String department) {}

// In instanceof:
if (emp instanceof Employee(Person p, Address a, String dept)) {
    System.out.println(p.name() + " in " + dept + " at " + a.city());
}

// You can use var for component types:
if (emp instanceof Employee(var p, var a, var dept)) {
    System.out.println(p.name() + ", " + dept);
}
```

---

## 11.3 Nested Record Patterns

The real power of record patterns is **nesting** — drilling into arbitrarily deep record structures:

```java
record Point(double x, double y) {}
record Line(Point start, Point end) {}
record BoundingBox(Line horizontal, Line vertical) {}

Object shape = new BoundingBox(
    new Line(new Point(0, 0), new Point(10, 0)),
    new Line(new Point(0, 0), new Point(0, 10))
);

// Nested destructuring — one pattern, all levels
if (shape instanceof BoundingBox(
        Line(Point(double x1, double y1), Point(double x2, double y2)),
        Line(Point(double x3, double y3), Point(double x4, double y4)))) {
    System.out.printf("Width: %.1f, Height: %.1f%n",
        Math.abs(x2 - x1), Math.abs(y4 - y3));
}
```

Compare this to the pre-record-patterns approach:

```java
// Old: verbose, error-prone, misses exhaustiveness
if (shape instanceof BoundingBox bb) {
    Line h = bb.horizontal();
    Line v = bb.vertical();
    Point start = h.start();
    Point end   = h.end();
    double width  = Math.abs(end.x() - start.x());
    double height = Math.abs(v.end().y() - v.start().y());
    System.out.printf("Width: %.1f, Height: %.1f%n", width, height);
}
```

The record pattern version is more concise and the compiler verifies the structure.

---

## 11.4 Record Patterns in switch

Record patterns work in switch expressions and statements — this is where they shine most:

```java
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
record Triangle(double base, double height, double hypotenuse) implements Shape {}

double area(Shape shape) {
    return switch (shape) {
        case Circle(double r)                  -> Math.PI * r * r;
        case Rectangle(double w, double h)     -> w * h;
        case Triangle(double b, double h, var _) -> 0.5 * b * h;
    };
}

String describe(Shape shape) {
    return switch (shape) {
        case Circle(double r)    when r < 1 -> "tiny circle (r=" + r + ")";
        case Circle(double r)               -> "circle (r=" + r + ")";
        case Rectangle(double w, double h)
            when w == h                     -> "square (" + w + "x" + h + ")";
        case Rectangle(double w, double h)  -> "rectangle (" + w + "x" + h + ")";
        case Triangle(var b, var h, var hyp) -> "triangle";
    };
}
```

---

## 11.5 AST Processing with Nested Record Patterns

One of the most compelling use cases is processing Abstract Syntax Trees or hierarchical data models:

```java
sealed interface Expr permits Num, Add, Mul, Neg, Var {}
record Num(double value) implements Expr {}
record Var(String name) implements Expr {}
record Add(Expr left, Expr right) implements Expr {}
record Mul(Expr left, Expr right) implements Expr {}
record Neg(Expr expr) implements Expr {}

// Evaluate an expression tree
double eval(Expr expr, Map<String, Double> env) {
    return switch (expr) {
        case Num(double v)          -> v;
        case Var(String name)       -> env.getOrDefault(name, 0.0);
        case Neg(Expr inner)        -> -eval(inner, env);
        case Add(Expr l, Expr r)    -> eval(l, env) + eval(r, env);
        case Mul(Expr l, Expr r)    -> eval(l, env) * eval(r, env);
    };
}

// Constant-fold optimization: Mul(Num(0), anything) = Num(0)
Expr simplify(Expr expr) {
    return switch (expr) {
        case Mul(Num(0.0), var _)     -> new Num(0);
        case Mul(var _, Num(0.0))     -> new Num(0);
        case Mul(Num(1.0), Expr e)    -> simplify(e);
        case Mul(Expr e, Num(1.0))    -> simplify(e);
        case Add(Num(0.0), Expr e)    -> simplify(e);
        case Add(Expr e, Num(0.0))    -> simplify(e);
        case Add(Expr l, Expr r)      -> new Add(simplify(l), simplify(r));
        case Mul(Expr l, Expr r)      -> new Mul(simplify(l), simplify(r));
        case Neg(Neg(Expr inner))     -> simplify(inner);  // double negation
        default                       -> expr;
    };
}
```

---

## 11.6 Generic Record Patterns

Generic records work with type inference in patterns:

```java
record Box<T>(T value) {}
record Pair<A, B>(A first, B second) {}

Object obj = new Box<>(new Pair<>("hello", 42));

if (obj instanceof Box(Pair(String s, Integer n))) {
    System.out.println(s + " -> " + n); // "hello -> 42"
}

// In switch:
String process(Object o) {
    return switch (o) {
        case Box(String s)          -> "String box: " + s;
        case Box(Integer n)         -> "Int box: " + n;
        case Box(Pair(var a, var b)) -> "Pair box: " + a + ", " + b;
        case Box(var v)             -> "Box: " + v;
        default                     -> "unknown";
    };
}
```

---

## 11.7 Domain Event Dispatching

Record patterns excel at domain event processing:

```java
sealed interface OrderEvent permits
    OrderPlaced, PaymentReceived, ItemShipped, OrderCancelled {}

record OrderPlaced(String orderId, List<String> items, BigDecimal total)
    implements OrderEvent {}
record PaymentReceived(String orderId, String transactionId, BigDecimal amount)
    implements OrderEvent {}
record ItemShipped(String orderId, String trackingNumber)
    implements OrderEvent {}
record OrderCancelled(String orderId, String reason)
    implements OrderEvent {}

// Event processor using record patterns
String summarizeEvent(OrderEvent event) {
    return switch (event) {
        case OrderPlaced(var id, var items, var total) ->
            "Order %s placed: %d items, $%.2f".formatted(id, items.size(), total);

        case PaymentReceived(var id, var txnId, var amount) ->
            "Payment $%.2f received for order %s (txn: %s)".formatted(amount, id, txnId);

        case ItemShipped(var id, var tracking) ->
            "Order %s shipped, tracking: %s".formatted(id, tracking);

        case OrderCancelled(var id, var reason) ->
            "Order %s cancelled: %s".formatted(id, reason);
    };
}
```

---

## 11.8 Record Patterns vs Manual Accessor Calls

```java
record Customer(String id, String name, Address address) {}
record Address(String street, String city, String zip) {}

// Before record patterns: verbose, lots of intermediate variables
void sendWelcome(Object obj) {
    if (obj instanceof Customer c) {
        String city = c.address().city();
        String name = c.name();
        emailService.send(c.id(), "Welcome " + name + " from " + city);
    }
}

// With record patterns: concise, components named directly
void sendWelcomeV2(Object obj) {
    if (obj instanceof Customer(String id, String name, Address(var _, String city, var _))) {
        emailService.send(id, "Welcome " + name + " from " + city);
    }
}
```

---

## 11.9 Summary

Record patterns are the natural complement to records and sealed classes:

- **Destructure record components** directly in patterns — no intermediate variables, no accessor calls
- **Nest arbitrarily deep** for drilling into complex record hierarchies
- **Work in both `instanceof` and `switch`** — seamlessly compose with guarded patterns
- **Enable exhaustive matching** when combined with sealed interfaces
- **Dramatically improve readability** of data-processing code — ASTs, domain events, DTOs
- **Finalized in Java 21** — use without `--enable-preview`

When you find yourself writing `if (x instanceof Foo f) { var y = f.bar(); var z = y.baz(); }`, that's a record pattern waiting to be written.
