import { SimpleLinkedList } from "../../../src/data-structure/linked-list/simple-linked-list";

test("simple linked list immutable outside", () => {
  const list = new SimpleLinkedList<number>();
  // @ts-expect-error
  expect(() => (list.size = 1)).toThrow(/readonly/);
  // @ts-expect-error
  expect(() => (list.head = 1)).toThrow(/readonly/);
  // @ts-expect-error
  expect(() => (list.tail = 1)).toThrow(/readonly/);
  // @ts-expect-error
  expect(() => (list.$modified = 1)).toThrow(/readonly/);
});

describe("simple linked list", () => {
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
  });
  it("find last logic", () => {
    const list = new SimpleLinkedList<number>();
    list.addLast(1);
    list.addLast(2);
    list.addLast(3);
    list.addLast(4);
    const node = list.findLast(3);
    expect(node).toBe(list.tail?.previous);
  });
  it("should error when modify in iteration", () => {
    const list = new SimpleLinkedList<number>();
    list.addLast(1);
    expect(() => {
      for (const number of list) {
        list.addLast(number);
      }
    }).toThrow(/iteration/);
    describe("error just occur in iteration", () => {
      expect(list.size).toBe(2);
    });
  });
});
