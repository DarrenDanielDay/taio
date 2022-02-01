import { Freeze } from "../../../../utils/decorators/limitations";
import { invalidOperation } from "../../../../utils/internal/exceptions";
import { sealedConstruct } from "../../../../utils/object-operation";
import { ImmutableIterator } from "../common/iterator";
import type { IStack } from "../interfaces/schema";
import { SimpleLinkedList } from "../linked-list/simple-linked-list";
export class LinkedStack<T> extends ImmutableIterator<T> implements IStack<T> {
  #linkedList = new SimpleLinkedList<T>();
  get size() {
    return this.#linkedList.size;
  }
  constructor() {
    super();
    sealedConstruct(LinkedStack, new.target);
  }
  protected *getIterator(): Iterator<T, void> {
    yield* this.#linkedList;
  }
  push(value: T) {
    this.#linkedList.addFirst(value);
    this.markAsChanged();
  }
  pop() {
    const currentSize = this.size;
    if (currentSize === 0) {
      return invalidOperation("Stack is empty.");
    }
    const { value } = this.#linkedList.head!;
    this.#linkedList.removeFirst();
    this.markAsChanged();
    return value;
  }
  get top() {
    if (this.size === 0) {
      return invalidOperation("Stack is empty.");
    }
    return this.#linkedList.head!.value;
  }
  clear() {
    this.#linkedList.clear();
    this.markAsChanged();
  }

  clone() {
    const newStack = new LinkedStack<T>();
    newStack.#linkedList = this.#linkedList.clone();
    return newStack;
  }
}

Freeze(LinkedStack);
