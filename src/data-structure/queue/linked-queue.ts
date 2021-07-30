import { Freeze, Sealed } from "../../decorators/limitations";
import { invalidOperation } from "../../internal/exceptions";
import { iteration, Modified } from "../common/iterator";
import type { IQueue } from "../interfaces/schema";
import { SimpleLinkedList } from "../linked-list/simple-linked-list";
@Freeze
@Sealed
class LinkedQueue<T> implements IQueue<T> {
  #linkedList = new SimpleLinkedList<T>();
  @iteration.modifier
  readonly $modified!: number;
  get size() {
    return this.#linkedList.size;
  }
  *[Symbol.iterator](): Iterator<T, void> {
    yield* this.#linkedList;
  }
  @Modified
  enqueue(value: T): void {
    this.#linkedList.addLast(value);
  }
  @Modified
  dequeue(): T {
    const currentSize = this.size;
    if (currentSize === 0) {
      return invalidOperation("Queue is empty.");
    }
    const { value } = this.#linkedList.head!;
    this.#linkedList.removeFirst();
    return value;
  }
  get front(): T {
    if (this.size === 0) {
      return invalidOperation("Queue is empty.");
    }
    return this.#linkedList.head!.value;
  }
  get back(): T {
    if (this.size === 0) {
      return invalidOperation("Queue is empty.");
    }
    return this.#linkedList.tail!.value;
  }
  @Modified
  clear() {
    this.#linkedList.clear();
  }

  clone() {
    const newQueue = new LinkedQueue<T>();
    newQueue.#linkedList = this.#linkedList.clone();
    return newQueue;
  }
}

export { LinkedQueue };
