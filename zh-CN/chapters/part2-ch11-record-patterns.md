# 第11章：记录模式（Record Patterns）

记录模式（Record Patterns，JEP 440，在 Java 21 中正式发布）将模式匹配（Pattern Matching）扩展为支持**记录值的解构（deconstruction）**。类型模式（Type Patterns）允许你测试和提取对象的类型，而记录模式则允许你在单个表达式中同时测试类型*并*解构其组件。结合密封类（Sealed Classes），这使得穷举性的、可读性强的、编译器验证的数据导航成为可能。

---

## 11.1 从类型模式到记录模式

类型模式（在 Java 16 中正式发布，见第3章）允许：

```java
if (obj instanceof String s) {
    System.out.println(s.length()); // s 被绑定为 String 类型
}
```

记录模式对此进行了扩展：如果 `obj` 是一个记录（Record），你可以**内联解构**其组件：

```java
record Point(double x, double y) {}

// 类型模式：提取整个记录
if (obj instanceof Point p) {
    System.out.println(p.x() + ", " + p.y()); // 调用访问器
}

// 记录模式：直接解构
if (obj instanceof Point(double x, double y)) {
    System.out.println(x + ", " + y); // 组件被直接绑定
}
```

---

## 11.2 记录解构模式语法

```java
record Person(String name, int age) {}
record Address(String street, String city, String country) {}
record Employee(Person person, Address address, String department) {}

// 在 instanceof 中使用：
if (emp instanceof Employee(Person p, Address a, String dept)) {
    System.out.println(p.name() + " in " + dept + " at " + a.city());
}

// 可以使用 var 来推断组件类型：
if (emp instanceof Employee(var p, var a, var dept)) {
    System.out.println(p.name() + ", " + dept);
}
```

---

## 11.3 嵌套记录模式

记录模式的真正威力在于**嵌套**——可以深入到任意层级的记录结构中：

```java
record Point(double x, double y) {}
record Line(Point start, Point end) {}
record BoundingBox(Line horizontal, Line vertical) {}

Object shape = new BoundingBox(
    new Line(new Point(0, 0), new Point(10, 0)),
    new Line(new Point(0, 0), new Point(0, 10))
);

// 嵌套解构——一个模式，处理所有层级
if (shape instanceof BoundingBox(
        Line(Point(double x1, double y1), Point(double x2, double y2)),
        Line(Point(double x3, double y3), Point(double x4, double y4)))) {
    System.out.printf("Width: %.1f, Height: %.1f%n",
        Math.abs(x2 - x1), Math.abs(y4 - y3));
}
```

将其与记录模式出现之前的写法进行比较：

```java
// 旧写法：冗长、容易出错、缺少穷举性检查
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

记录模式版本更加简洁，并且编译器会验证结构的正确性。

---

## 11.4 switch 中的记录模式

记录模式可以在 switch 表达式和语句中使用——这是它们最能大放异彩的地方：

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

## 11.5 使用嵌套记录模式处理 AST

最引人注目的用例之一是处理抽象语法树（Abstract Syntax Tree, AST）或层次化数据模型：

```java
sealed interface Expr permits Num, Add, Mul, Neg, Var {}
record Num(double value) implements Expr {}
record Var(String name) implements Expr {}
record Add(Expr left, Expr right) implements Expr {}
record Mul(Expr left, Expr right) implements Expr {}
record Neg(Expr expr) implements Expr {}

// 计算表达式树
double eval(Expr expr, Map<String, Double> env) {
    return switch (expr) {
        case Num(double v)          -> v;
        case Var(String name)       -> env.getOrDefault(name, 0.0);
        case Neg(Expr inner)        -> -eval(inner, env);
        case Add(Expr l, Expr r)    -> eval(l, env) + eval(r, env);
        case Mul(Expr l, Expr r)    -> eval(l, env) * eval(r, env);
    };
}

// 常量折叠优化：Mul(Num(0), anything) = Num(0)
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
        case Neg(Neg(Expr inner))     -> simplify(inner);  // 双重否定
        default                       -> expr;
    };
}
```

---

## 11.6 泛型记录模式

泛型记录（Generic Records）在模式中支持类型推断（Type Inference）：

```java
record Box<T>(T value) {}
record Pair<A, B>(A first, B second) {}

Object obj = new Box<>(new Pair<>("hello", 42));

if (obj instanceof Box(Pair(String s, Integer n))) {
    System.out.println(s + " -> " + n); // "hello -> 42"
}

// 在 switch 中使用：
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

## 11.7 领域事件分发

记录模式在领域事件（Domain Event）处理方面表现出色：

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

// 使用记录模式的事件处理器
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

## 11.8 记录模式与手动访问器调用的对比

```java
record Customer(String id, String name, Address address) {}
record Address(String street, String city, String zip) {}

// 记录模式出现之前：冗长，大量中间变量
void sendWelcome(Object obj) {
    if (obj instanceof Customer c) {
        String city = c.address().city();
        String name = c.name();
        emailService.send(c.id(), "Welcome " + name + " from " + city);
    }
}

// 使用记录模式：简洁，组件直接命名
void sendWelcomeV2(Object obj) {
    if (obj instanceof Customer(String id, String name, Address(var _, String city, var _))) {
        emailService.send(id, "Welcome " + name + " from " + city);
    }
}
```

---

## 11.9 总结

记录模式是记录（Records）和密封类（Sealed Classes）的天然补充：

- **直接在模式中解构记录组件**——无需中间变量，无需调用访问器
- **支持任意深度的嵌套**，可以深入复杂的记录层次结构
- **同时适用于 `instanceof` 和 `switch`**——与守卫模式（Guarded Patterns）无缝组合
- **结合密封接口（Sealed Interfaces）实现穷举匹配**
- **显著提升数据处理代码的可读性**——适用于 AST、领域事件、DTO 等场景
- **在 Java 21 中正式发布**——无需使用 `--enable-preview`

当你发现自己正在编写 `if (x instanceof Foo f) { var y = f.bar(); var z = y.baz(); }` 这样的代码时，那就是一个等待被改写为记录模式的信号。
