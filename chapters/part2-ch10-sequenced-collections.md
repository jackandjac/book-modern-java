# Chapter 10: Sequenced Collections

Sequenced collections (JEP 431, finalized in Java 21) solve a surprising gap in the Java Collections Framework: the lack of a uniform API for accessing the first and last elements of ordered collections, and for iterating in reverse. Before Java 21, you needed different methods for different types — `list.get(0)` vs `deque.peekFirst()` vs `sortedSet.first()`, with no polymorphic way to write code that works across all ordered collections.

---

## 10.1 The Problem: Inconsistent First/Last Access

```java
// Getting the first element — every collection type is different
List<String> list = List.of("a", "b", "c");
String firstFromList = list.get(0);              // indexed access

Deque<String> deque = new ArrayDeque<>(List.of("a", "b", "c"));
String firstFromDeque = deque.peekFirst();        // or getFirst()

SortedSet<String> sortedSet = new TreeSet<>(List.of("a", "b", "c"));
String firstFromSet = sortedSet.first();          // SortedSet-specific

LinkedHashSet<String> linkedSet = new LinkedHashSet<>(List.of("a", "b", "c"));
String firstFromLinked = linkedSet.iterator().next(); // iterator hack!

// Getting the last element — equally inconsistent
String lastFromList = list.get(list.size() - 1); // error-prone
String lastFromDeque = deque.peekLast();
String lastFromSet = sortedSet.last();
String lastFromLinked = /* ... there's no clean way without iterating */;
```

This fragmentation makes it impossible to write generic code that works uniformly across ordered collections.

---

## 10.2 The Three New Interfaces

Java 21 introduced three new interfaces in `java.util`:

```
SequencedCollection<E>   extends Collection<E>
SequencedSet<E>          extends SequencedCollection<E>, Set<E>
SequencedMap<K,V>        extends Map<K,V>
```

---

## 10.3 SequencedCollection

```java
public interface SequencedCollection<E> extends Collection<E> {
    // Add to beginning/end
    void addFirst(E e);
    void addLast(E e);

    // Get first/last (throws NoSuchElementException if empty)
    E getFirst();
    E getLast();

    // Remove first/last (throws NoSuchElementException if empty)
    E removeFirst();
    E removeLast();

    // Reversed view (not a copy — changes to one are reflected in the other)
    SequencedCollection<E> reversed();
}
```

All ordered collections now implement this interface uniformly:

```java
List<String>       list       = new ArrayList<>(List.of("a", "b", "c"));
Deque<String>      deque      = new ArrayDeque<>(List.of("a", "b", "c"));
LinkedHashSet<String> linked  = new LinkedHashSet<>(List.of("a", "b", "c"));

// Uniform API — same code works for all three!
for (SequencedCollection<String> coll : List.of(list, deque, linked)) {
    System.out.println(coll.getFirst());  // "a"
    System.out.println(coll.getLast());   // "c"
}
```

### The reversed() View

`reversed()` returns a **live view** — it does not copy the collection. Mutations to the original are reflected in the reversed view, and vice versa:

```java
List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5));
List<Integer> reversed = numbers.reversed(); // List.reversed() returns List<E> — no cast needed

System.out.println(reversed.getFirst()); // 5
System.out.println(reversed.getLast());  // 1

numbers.add(6);
System.out.println(reversed.getFirst()); // 6 — live view reflects the change

// Iterating in reverse — clean and idiomatic
for (String item : list.reversed()) {
    System.out.println(item); // c, b, a
}

// Stream in reverse
list.reversed().stream()
    .filter(s -> !s.isEmpty())
    .forEach(System.out::println);
```

### Practical: Efficient Deque Operations

```java
// LRU cache skeleton using Deque as a SequencedCollection
class LruCache<K, V> {
    private final int capacity;
    private final LinkedHashMap<K, V> cache;

    LruCache(int capacity) {
        this.capacity = capacity;
        // LinkedHashMap in access-order mode
        this.cache = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > capacity;
            }
        };
    }

    // Using SequencedMap to get the most-recently-used entry
    public Map.Entry<K, V> getMostRecent() {
        return cache.sequencedEntrySet().getLast();  // Java 21 SequencedMap API
    }
}
```

---

## 10.4 SequencedSet

`SequencedSet<E>` adds no new methods but signals that the collection is both a `Set` (no duplicates) and a `SequencedCollection` (defined order). The `reversed()` return type is `SequencedSet<E>`.

```java
// LinkedHashSet now implements SequencedSet
LinkedHashSet<String> set = new LinkedHashSet<>(List.of("banana", "apple", "cherry"));

System.out.println(set.getFirst()); // "banana" (insertion order)
System.out.println(set.getLast());  // "cherry"

// TreeSet (sorted set) also implements SequencedSet
TreeSet<String> sorted = new TreeSet<>(Set.of("banana", "apple", "cherry"));
System.out.println(sorted.getFirst()); // "apple" (sorted order)
System.out.println(sorted.getLast());  // "cherry"

// Reverse iteration over a sorted set
for (String s : sorted.reversed()) {
    System.out.println(s); // cherry, banana, apple
}
```

---

## 10.5 SequencedMap

`SequencedMap<K,V>` adds first/last entry access and reversed views:

```java
public interface SequencedMap<K, V> extends Map<K, V> {
    Map.Entry<K,V> firstEntry();   // null-safe (returns null if empty)
    Map.Entry<K,V> lastEntry();    // null-safe

    Map.Entry<K,V> pollFirstEntry(); // removes and returns, or null
    Map.Entry<K,V> pollLastEntry();  // removes and returns, or null

    K firstKey();   // throws NoSuchElementException if empty
    K lastKey();

    V putFirst(K k, V v);  // insert at beginning
    V putLast(K k, V v);   // insert at end

    SequencedMap<K,V> reversed();

    // Sequenced views of keys, values, entries:
    SequencedSet<K>            sequencedKeySet();
    SequencedCollection<V>     sequencedValues();
    SequencedSet<Map.Entry<K,V>> sequencedEntrySet();
}
```

Usage:

```java
// LinkedHashMap maintains insertion order — now it's a SequencedMap
LinkedHashMap<String, Integer> scores = new LinkedHashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Carol", 92);

System.out.println(scores.firstEntry()); // Alice=95
System.out.println(scores.lastEntry());  // Carol=92
System.out.println(scores.firstKey());   // Alice

// Reverse iteration — crucial for LRU and recent-first ordering
scores.reversed().forEach((name, score) ->
    System.out.println(name + ": " + score));
// Carol: 92, Bob: 87, Alice: 95

// Sequenced views for stream operations
String topScorer = scores.sequencedEntrySet().reversed().stream()
    .max(Map.Entry.comparingByValue())
    .map(Map.Entry::getKey)
    .orElseThrow();
System.out.println("Top scorer: " + topScorer); // Alice
```

---

## 10.6 Collection Implementation Matrix

| Collection | Implements | Notes |
|-----------|-----------|-------|
| `ArrayList` | `SequencedCollection` | `addFirst`/`addLast` are O(n)/O(1) |
| `LinkedList` | `SequencedCollection` (also `Deque`) | All ops O(1) |
| `ArrayDeque` | `SequencedCollection` | All ops O(1) |
| `LinkedHashSet` | `SequencedSet` | Insertion-order set |
| `TreeSet` | `SequencedSet` | Sorted-order set |
| `LinkedHashMap` | `SequencedMap` | Insertion-order map |
| `TreeMap` | `SequencedMap` | Sorted-order map |

**Not implementing `SequencedSet`**: `LinkedList` (allows duplicates, not a `Set`), `ArrayList`, `ArrayDeque`, `HashSet`, `HashMap` — only true ordered sets implement `SequencedSet`.

---

## 10.7 Migration: Replacing Pre-Java-21 Workarounds

```java
// BEFORE:
String last = list.get(list.size() - 1);       // error-prone, verbose
String first = deque.isEmpty() ? null : deque.peekFirst(); // null-safe check
for (Iterator<String> it = /* reverse iterator */; it.hasNext();) { ... }

// AFTER:
String last  = list.getLast();
String first = deque.isEmpty() ? null : deque.getFirst();
for (String s : list.reversed()) { ... }
```

---

## 10.8 Summary

Sequenced collections complete a long-overdue gap in the Collections Framework:

- **Uniform first/last access** across all ordered collections via `getFirst()`, `getLast()`
- **Uniform mutation** via `addFirst()`, `addLast()`, `removeFirst()`, `removeLast()`
- **`reversed()` live view** for clean reverse iteration and streaming
- **`SequencedMap`** brings the same uniformity to maps with entry-level first/last access

The impact is subtle but wide: generic code that works across `List`, `Deque`, `LinkedHashSet`, `TreeSet`, `LinkedHashMap`, and `TreeMap` without instanceof checks or type-specific method calls.
