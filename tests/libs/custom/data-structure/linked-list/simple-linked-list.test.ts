import { SimpleLinkedList } from "../../../../../src/libs/custom/data-structure/linked-list/simple-linked-list";

describe("simple linked list", () => {
  it("should be immutable outside", () => {
    const list = new SimpleLinkedList<number>();
    // @ts-expect-error Directive as type check
    expect(() => (list.size = 1)).toThrow(/readonly/);
    // @ts-expect-error Directive as type check
    expect(() => (list.head = 1)).toThrow(/readonly/);
    // @ts-expect-error Directive as type check
    expect(() => (list.tail = 1)).toThrow(/readonly/);
    // @ts-expect-error Directive as type check
    expect(() => (list.$modified = 1)).toThrow(/readonly/);
  });
  it("add before logic", () => {
    const list = new SimpleLinkedList<number>();
    list.addFirst(1);
    expect([...list]).toEqual([1]);
    list.addBefore(list.head!, 2);
    expect([...list]).toEqual([2, 1]);
    const node = list.head!;
    list.addBefore(list.head!, 3);
    expect([...list]).toEqual([3, 2, 1]);
    list.addBefore(node.next!, 4);
    expect([...list]).toEqual([3, 2, 4, 1]);
    expect(list.size).toBe(4);
  });
  it("add after logic", () => {
    const list = new SimpleLinkedList<number>();
    list.addLast(1);
    expect([...list]).toEqual([1]);
    list.addAfter(list.head!, 2);
    expect([...list]).toEqual([1, 2]);
    const node = list.head!;
    list.addAfter(list.head!, 3);
    expect([...list]).toEqual([1, 3, 2]);
    list.addAfter(node.next!, 4);
    expect([...list]).toEqual([1, 3, 4, 2]);
    expect(list.size).toBe(4);
  });
  it("add first logic", () => {
    const list = new SimpleLinkedList<number>();
    expect(list).toBeInstanceOf(SimpleLinkedList);
    expect(list.size).toBe(0);
    list.addFirst(1);
    expect(list.size).toBe(1);
    list.addFirst(54);
    expect(list.size).toBe(2);
    list.addFirst(112);
    expect(list.size).toBe(3);
    list.addFirst(1);
    expect(list.size).toBe(4);
    expect([...list]).toEqual([1, 112, 54, 1]);
    expect(list.size).toBe(4);
  });
  it("add last logic", () => {
    const list = new SimpleLinkedList<number>();
    expect(list).toBeInstanceOf(SimpleLinkedList);
    expect(list.size).toBe(0);
    list.addLast(1);
    expect(list.size).toBe(1);
    list.addLast(54);
    expect(list.size).toBe(2);
    list.addLast(112);
    expect(list.size).toBe(3);
    list.addLast(1);
    expect(list.size).toBe(4);
    expect([...list]).toEqual([1, 54, 112, 1]);
    expect(list.size).toBe(4);
  });
  it("remove first logic", () => {
    const list = new SimpleLinkedList<number>();
    expect(() => list.removeFirst()).toThrow(/empty/);
    expect(list.size).toBe(0);
    list.addFirst(666);
    list.addFirst(2);
    list.removeFirst();
    expect(list.head?.value).toBe(666);
    expect(list.size).toBe(1);
    list.removeFirst();
    expect(list.size).toBe(0);
  });
  it("remove last logic", () => {
    const list = new SimpleLinkedList<number>();
    expect(() => list.removeFirst()).toThrow(/empty/);
    expect(list.size).toBe(0);
    list.addFirst(666);
    list.addFirst(2);
    list.removeLast();
    expect(list.head?.value).toBe(2);
    expect(list.size).toBe(1);
    list.removeLast();
    expect(list.size).toBe(0);
  });
  it("find logic", () => {
    const list = new SimpleLinkedList<number>();
    list.addLast(1);
    list.addLast(2);
    list.addLast(3);
    list.addLast(4);
    const node = list.find(3);
    expect(node).toBe(list.tail?.previous);
    expect(list.find(5)).toBeUndefined();
  });
  it("find last logic", () => {
    const list = new SimpleLinkedList<number>();
    list.addLast(1);
    list.addLast(2);
    list.addLast(3);
    list.addLast(4);
    const node = list.findLast(3);
    expect(node).toBe(list.tail?.previous);
    expect(list.findLast(5)).toBeUndefined();
  });
  it("should error when modify in iteration", () => {
    const list = new SimpleLinkedList<number>();
    list.addLast(1);
    expect(() => {
      for (const number of list) {
        list.addLast(number);
      }
    }).toThrow(/iteration/);
  });
  it("should just error in iteration", () => {
    const list = new SimpleLinkedList<number>();
    list.addLast(1);
    expect(() => {
      for (const number of list) {
        list.addLast(number);
      }
    }).toThrow(/iteration/);
    expect(list.size).toBe(2);
  });
  it("should be empty when call clear()", () => {
    const list = new SimpleLinkedList<number>();
    list.addFirst(1);
    list.addFirst(2);
    list.addFirst(3);
    list.addFirst(4);
    list.addFirst(5);
    expect(list.size).toBe(5);
    list.clear();
    expect(list.size).toBe(0);
  });
  it("should clone correctly when call clone()", () => {
    const list = new SimpleLinkedList<object>();
    list.addFirst({});
    list.addFirst({});
    list.addFirst({});
    const copy = list.clone();
    expect([...copy]).toEqual([...list]);
    expect(copy.head?.value).toBe(list.head?.value);
    expect(copy.head?.next?.value).toBe(list.head?.next?.value);
    expect(copy.head?.next?.next?.value).toBe(list.head?.next?.next?.value);
  });
  describe("empty linked list", () => {
    let list: SimpleLinkedList<number>;
    beforeEach(() => {
      list = new SimpleLinkedList();
    });
    it("should throw when call remove", () => {
      expect(() => list.remove(list.head!)).toThrow(/LinkedList.*empty/);
    });
    it("should throw when call remove", () => {
      expect(() => list.removeFirst()).toThrow(/LinkedList.*empty/);
    });
    it("should throw when call remove", () => {
      expect(() => list.removeLast()).toThrow(/LinkedList.*empty/);
    });
  });
});
