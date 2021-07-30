import { Freeze, Sealed } from "../../decorators/limitations";
import { invalidOperation } from "../../internal/exceptions";
import { ImmutableIteration, iteration, Modified } from "../common/iterator";
import type { IStack } from "../interfaces/schema";
import { SimpleLinkedList } from "../linked-list/simple-linked-list";
@Freeze
@Sealed
class LinkedStack<T> implements IStack<T> {
  #linkedList = new SimpleLinkedList<T>();
  @iteration.modifier
  readonly $modified!: number;
  get size() {
    return this.#linkedList.size;
  }
  @ImmutableIteration
  *[Symbol.iterator](): Iterator<T, void> {
    yield* this.#linkedList;
  }
  @Modified
  push(value: T) {
    this.#linkedList.addFirst(value);
  }
  @Modified
  pop() {
    const currentSize = this.size;
    if (currentSize === 0) {
      return invalidOperation("Stack is empty.");
    }
    const { value } = this.#linkedList.head!;
    this.#linkedList.removeFirst();
    return value;
  }
  get top() {
    if (this.size === 0) {
      return invalidOperation("Stack is empty.");
    }
    return this.#linkedList.head!.value;
  }
  @Modified
  clear() {
    this.#linkedList.clear();
  }

  clone() {
    const newStack = new LinkedStack<T>();
    newStack.#linkedList = this.#linkedList.clone();
    return newStack;
  }
}

export { LinkedStack };
