import { Freeze } from "../../../../utils/decorators/limitations";
import { invalidOperation } from "../../../../utils/internal/exceptions";
import { sealedConstruct } from "../../../../utils/object-operation";
import { ImmutableIterator } from "../common/iterator";
import type { IQueue } from "../interfaces/schema";
import { SimpleLinkedList } from "../linked-list/simple-linked-list";
export class LinkedQueue<T> extends ImmutableIterator<T> implements IQueue<T> {
  #linkedList = new SimpleLinkedList<T>();
  get size() {
    return this.#linkedList.size;
  }
  constructor() {
    super();
    sealedConstruct(LinkedQueue, new.target);
  }
  protected *getIterator(): Iterator<T, void> {
    yield* this.#linkedList;
  }
  enqueue(value: T): void {
    this.#linkedList.addLast(value);
    this.markAsChanged();
  }
  dequeue(): T {
    const currentSize = this.size;
    if (currentSize === 0) {
      return invalidOperation("Queue is empty.");
    }
    const { value } = this.#linkedList.head!;
    this.#linkedList.removeFirst();
    this.markAsChanged();
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
  clear() {
    this.#linkedList.clear();
    this.markAsChanged();
  }

  clone() {
    const newQueue = new LinkedQueue<T>();
    newQueue.#linkedList = this.#linkedList.clone();
    return newQueue;
  }
}
Freeze(LinkedQueue);
