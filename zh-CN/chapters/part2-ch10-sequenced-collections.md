# 第10章：有序集合（Sequenced Collections）

有序集合（Sequenced Collections，JEP 431，在 Java 21 中正式发布）解决了 Java 集合框架（Java Collections Framework）中一个令人意外的缺陷：缺乏统一的 API 来访问有序集合的首尾元素，以及进行反向迭代。在 Java 21 之前，不同的类型需要使用不同的方法——`list.get(0)` 与 `deque.peekFirst()` 与 `sortedSet.first()`，没有多态的方式来编写适用于所有有序集合的代码。

---

## 10.1 问题所在：不一致的首尾元素访问

```java
// 获取第一个元素——每种集合类型的方式都不同
List<String> list = List.of("a", "b", "c");
String firstFromList = list.get(0);              // 索引访问

Deque<String> deque = new ArrayDeque<>(List.of("a", "b", "c"));
String firstFromDeque = deque.peekFirst();        // 或 getFirst()

SortedSet<String> sortedSet = new TreeSet<>(List.of("a", "b", "c"));
String firstFromSet = sortedSet.first();          // SortedSet 特有方法

LinkedHashSet<String> linkedSet = new LinkedHashSet<>(List.of("a", "b", "c"));
String firstFromLinked = linkedSet.iterator().next(); // 迭代器的变通写法！

// 获取最后一个元素——同样不一致
String lastFromList = list.get(list.size() - 1); // 容易出错
String lastFromDeque = deque.peekLast();
String lastFromSet = sortedSet.last();
String lastFromLinked = /* ... 不遍历整个集合就没有简洁的方法 */;
```

这种碎片化使得编写能统一适用于所有有序集合的通用代码成为不可能。

---

## 10.2 三个新接口

Java 21 在 `java.util` 中引入了三个新接口：

```
SequencedCollection<E>   extends Collection<E>
SequencedSet<E>          extends SequencedCollection<E>, Set<E>
SequencedMap<K,V>        extends Map<K,V>
```

---

## 10.3 SequencedCollection

```java
public interface SequencedCollection<E> extends Collection<E> {
    // 添加到开头/末尾
    void addFirst(E e);
    void addLast(E e);

    // 获取首/尾元素（集合为空时抛出 NoSuchElementException）
    E getFirst();
    E getLast();

    // 移除首/尾元素（集合为空时抛出 NoSuchElementException）
    E removeFirst();
    E removeLast();

    // 反转视图（不是副本——对其中一个的修改会反映到另一个）
    SequencedCollection<E> reversed();
}
```

所有有序集合现在都统一实现了此接口：

```java
List<String>       list       = new ArrayList<>(List.of("a", "b", "c"));
Deque<String>      deque      = new ArrayDeque<>(List.of("a", "b", "c"));
LinkedHashSet<String> linked  = new LinkedHashSet<>(List.of("a", "b", "c"));

// 统一的 API——同样的代码适用于所有三种类型！
for (SequencedCollection<String> coll : List.of(list, deque, linked)) {
    System.out.println(coll.getFirst());  // "a"
    System.out.println(coll.getLast());   // "c"
}
```

### reversed() 视图

`reversed()` 返回一个**实时视图（live view）**——它不会复制集合。对原始集合的修改会反映在反转视图中，反之亦然：

```java
List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5));
List<Integer> reversed = (List<Integer>) numbers.reversed();

System.out.println(reversed.getFirst()); // 5
System.out.println(reversed.getLast());  // 1

numbers.add(6);
System.out.println(reversed.getFirst()); // 6 — 实时视图反映了变化

// 反向迭代——简洁且符合惯用写法
for (String item : list.reversed()) {
    System.out.println(item); // c, b, a
}

// 反向流操作
list.reversed().stream()
    .filter(s -> !s.isEmpty())
    .forEach(System.out::println);
```

### 实践：高效的双端队列操作

```java
// 使用 Deque 作为 SequencedCollection 的 LRU 缓存骨架
class LruCache<K, V> {
    private final int capacity;
    private final LinkedHashMap<K, V> cache;

    LruCache(int capacity) {
        this.capacity = capacity;
        // LinkedHashMap 的访问顺序模式
        this.cache = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > capacity;
            }
        };
    }

    // 使用 SequencedMap 获取最近使用的条目
    public Map.Entry<K, V> getMostRecent() {
        return cache.sequencedEntrySet().getLast();  // Java 21 SequencedMap API
    }
}
```

---

## 10.4 SequencedSet

`SequencedSet<E>` 没有添加新方法，但它表明该集合既是一个 `Set`（不含重复元素），也是一个 `SequencedCollection`（具有确定的顺序）。`reversed()` 的返回类型为 `SequencedSet<E>`。

```java
// LinkedHashSet 现在实现了 SequencedSet
LinkedHashSet<String> set = new LinkedHashSet<>(List.of("banana", "apple", "cherry"));

System.out.println(set.getFirst()); // "banana"（插入顺序）
System.out.println(set.getLast());  // "cherry"

// TreeSet（有序集合）也实现了 SequencedSet
TreeSet<String> sorted = new TreeSet<>(Set.of("banana", "apple", "cherry"));
System.out.println(sorted.getFirst()); // "apple"（排序顺序）
System.out.println(sorted.getLast());  // "cherry"

// 对有序集合进行反向迭代
for (String s : sorted.reversed()) {
    System.out.println(s); // cherry, banana, apple
}
```

---

## 10.5 SequencedMap

`SequencedMap<K,V>` 添加了首尾条目访问和反转视图：

```java
public interface SequencedMap<K, V> extends Map<K, V> {
    Map.Entry<K,V> firstEntry();   // 空安全（为空时返回 null）
    Map.Entry<K,V> lastEntry();    // 空安全

    Map.Entry<K,V> pollFirstEntry(); // 移除并返回，或返回 null
    Map.Entry<K,V> pollLastEntry();  // 移除并返回，或返回 null

    K firstKey();   // 为空时抛出 NoSuchElementException
    K lastKey();

    V putFirst(K k, V v);  // 插入到开头
    V putLast(K k, V v);   // 插入到末尾

    SequencedMap<K,V> reversed();

    // 键、值、条目的有序视图：
    SequencedSet<K>            sequencedKeySet();
    SequencedCollection<V>     sequencedValues();
    SequencedSet<Map.Entry<K,V>> sequencedEntrySet();
}
```

用法：

```java
// LinkedHashMap 保持插入顺序——现在它是一个 SequencedMap
LinkedHashMap<String, Integer> scores = new LinkedHashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Carol", 92);

System.out.println(scores.firstEntry()); // Alice=95
System.out.println(scores.lastEntry());  // Carol=92
System.out.println(scores.firstKey());   // Alice

// 反向迭代——对 LRU 和"最近优先"排序至关重要
scores.reversed().forEach((name, score) ->
    System.out.println(name + ": " + score));
// Carol: 92, Bob: 87, Alice: 95

// 有序视图的流操作
String topScorer = scores.sequencedEntrySet().reversed().stream()
    .max(Map.Entry.comparingByValue())
    .map(Map.Entry::getKey)
    .orElseThrow();
System.out.println("Top scorer: " + topScorer); // Alice
```

---

## 10.6 集合实现矩阵

| 集合 | 实现的接口 | 备注 |
|-----------|-----------|-------|
| `ArrayList` | `SequencedCollection` | `addFirst`/`addLast` 的时间复杂度为 O(n)/O(1) |
| `LinkedList` | `SequencedCollection`，作为 Deque 使用时也实现 `SequencedSet` | 所有操作均为 O(1) |
| `ArrayDeque` | `SequencedCollection` | 所有操作均为 O(1) |
| `LinkedHashSet` | `SequencedSet` | 按插入顺序排列的集合 |
| `TreeSet` | `SequencedSet` | 按排序顺序排列的集合 |
| `LinkedHashMap` | `SequencedMap` | 按插入顺序排列的映射 |
| `TreeMap` | `SequencedMap` | 按排序顺序排列的映射 |

**未实现的集合**：`HashSet`、`HashMap`、`ArrayList`（对于 `SequencedSet`）——无序集合不实现这些接口。

---

## 10.7 迁移：替换 Java 21 之前的变通方案

```java
// 之前：
String last = list.get(list.size() - 1);       // 容易出错，冗长
String first = deque.isEmpty() ? null : deque.peekFirst(); // 空安全检查
for (Iterator<String> it = /* 反向迭代器 */; it.hasNext();) { ... }

// 之后：
String last  = list.getLast();
String first = deque.isEmpty() ? null : deque.getFirst();
for (String s : list.reversed()) { ... }
```

---

## 10.8 总结

有序集合（Sequenced Collections）填补了集合框架中一个早该解决的空白：

- **统一的首尾元素访问**：通过 `getFirst()`、`getLast()` 适用于所有有序集合
- **统一的修改操作**：通过 `addFirst()`、`addLast()`、`removeFirst()`、`removeLast()`
- **`reversed()` 实时视图**：实现简洁的反向迭代和流操作
- **`SequencedMap`**：将同样的统一性带入映射，提供条目级别的首尾访问

其影响虽然微妙但影响广泛：编写的通用代码可以跨 `List`、`Deque`、`LinkedHashSet`、`TreeSet`、`LinkedHashMap` 和 `TreeMap` 工作，无需进行 instanceof 检查或调用特定类型的方法。
