import { ReadonlyOutside, Sealed } from "../../decorators/limitations";
import { invalidOperation } from "../../internal/exceptions";
import { ImmutableIteration, iteration, Modified } from "../common/iterator";
import { IContainer } from "../interfaces";
import { SimpleLinkedList } from "../linked-list/simple-linked-list";
const readonly = ReadonlyOutside<LinkedStack<unknown>>({ enumerable: true });
@Sealed
class LinkedStack<T> implements IContainer<T> {
  #linkedList = new SimpleLinkedList<T>();
  @iteration.modifier
  readonly $modified!: number;
  @readonly.decorate<"size">(0)
  readonly size!: number;
  @ImmutableIteration
  *[Symbol.iterator](): Iterator<T, any, undefined> {
    yield* this.#linkedList;
  }
  @Modified
  push(value: T) {
    const currentSize = this.size;
    const result = this.#linkedList.addFirst(value);
    readonly.set(this, "size", currentSize + 1);
    return result;
  }
  @Modified
  pop() {
    const currentSize = this.size;
    if (currentSize === 0) {
      return invalidOperation("Stack is empty.");
    }
    const { value } = this.#linkedList.head!;
    this.#linkedList.removeFirst();
    readonly.set(this, "size", currentSize - 1);
    return value;
  }
  get top() {
    if (this.size === 0) {
      return invalidOperation("Stack is empty.");
    }
    return this.#linkedList.head!.value;
  }
}
Object.freeze(LinkedStack.prototype);

export { LinkedStack };
