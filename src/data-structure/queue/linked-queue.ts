import { ReadonlyOutside, Sealed } from "../../decorators/limitations";
import { invalidOperation } from "../../internal/exceptions";
import { iteration, Modified } from "../common/iterator";
import type { IQueue } from "../interfaces/schema";
import { SimpleLinkedList } from "../linked-list/simple-linked-list";

const readonly = ReadonlyOutside<LinkedQueue<unknown>>({ enumerable: true });

@Sealed
class LinkedQueue<T> implements IQueue<T> {
  #linkedList = new SimpleLinkedList<T>();
  @iteration.modifier
  $modified!: number;
  @readonly.decorate<"size">(0)
  size!: number;
  *[Symbol.iterator](): Iterator<T, void, undefined> {
    yield* this.#linkedList;
  }
  @Modified
  enqueue(value: T): void {
    const currentSize = this.size;
    this.#linkedList.addLast(value);
    readonly.set(this, "size", currentSize + 1);
  }
  @Modified
  dequeue(): T {
    const currentSize = this.size;
    if (currentSize === 0) {
      return invalidOperation("Queue is empty.");
    }
    const { value } = this.#linkedList.head!;
    this.#linkedList.removeFirst();
    readonly.set(this, "size", currentSize - 1);
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
      return invalidOperation("Stack is empty.");
    }
    return this.#linkedList.tail!.value;
  }
}
Object.freeze(LinkedQueue);
Object.freeze(LinkedQueue.prototype);
export { LinkedQueue };
