import { LinkedQueue } from "../../../../../src/libs/custom/data-structure/queue/linked-queue";

describe("linked queue", () => {
  it("example: numbers", () => {
    const queue = new LinkedQueue<number>();
    const arr = new Array(100).fill(0).map((_, i) => i);
    const outs: number[] = [];
    for (const element of arr) {
      queue.enqueue(element);
      if (Math.random() < 0.5) {
        if (queue.size > 0) {
          const out = queue.dequeue();
          outs.push(out);
        }
      }
    }
    outs.push(...queue);
    expect(outs).toEqual(arr);
  });
  describe("empty queue", () => {
    it("should throw when call dequeue", () => {
      expect(() => new LinkedQueue<number>().dequeue()).toThrow();
    });
    it("should throw when get front or back", () => {
      expect(() => new LinkedQueue<number>().front).toThrow(/Queue.*empty/);
      expect(() => new LinkedQueue<number>().back).toThrow(/Queue.*empty/);
    });
  });
  it("should always be same with front", () => {
    const queue = new LinkedQueue<number>();
    queue.enqueue(Math.random());
    queue.enqueue(Math.random());
    queue.enqueue(Math.random());
    queue.enqueue(Math.random());
    expect(queue.front).toBe(queue.dequeue());
    expect(queue.front).toBe(queue.dequeue());
    expect(queue.front).toBe(queue.dequeue());
    expect(queue.front).toBe(queue.dequeue());
  });
  it("should be the last element when ", () => {
    const queue = new LinkedQueue<number>();
    queue.enqueue(Math.random());
    queue.enqueue(Math.random());
    queue.enqueue(Math.random());
    queue.enqueue(666);
    expect(queue.back).toBe(666);
  });
  it("should be empty when call clear()", () => {
    const list = new LinkedQueue<number>();
    list.enqueue(1);
    list.enqueue(2);
    list.enqueue(3);
    list.enqueue(4);
    list.enqueue(5);
    expect(list.size).toBe(5);
    list.clear();
    expect(list.size).toBe(0);
  });
  it("should clone correctly when call clone()", () => {
    const queue = new LinkedQueue<object>();
    queue.enqueue({});
    queue.enqueue({});
    queue.enqueue({});
    const copy = queue.clone();
    expect([...copy]).toEqual([...queue]);
    for (let i = 0; i < 3; i++) {
      expect(copy.front).toBe(queue.front);
      copy.dequeue();
      queue.dequeue();
    }
  });
});
