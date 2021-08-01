import {
  Freeze,
  ReadonlyOutside,
  Sealed,
} from "../../../../utils/decorators/limitations";
import { invalidOperation } from "../../../../utils/internal/exceptions";
import { ImmutableIteration, iteration, Modified } from "../common/iterator";
import type { ILinkedNode, ILinkedList } from "../interfaces/schema";

const readonly = ReadonlyOutside<SimpleLinkedList<unknown>>({
  enumerable: true,
});

@Freeze
@Sealed
class SimpleLinkedList<T> implements ILinkedList<T> {
  @iteration.modifier
  readonly $modified!: number;
  @readonly.decorate<"head">(undefined)
  readonly head: ILinkedNode<T> | undefined;
  @readonly.decorate<"tail">(undefined)
  readonly tail: ILinkedNode<T> | undefined;
  @readonly.decorate<"size">(0)
  readonly size!: number;
  @ImmutableIteration
  *[Symbol.iterator](this: SimpleLinkedList<T>): Iterator<T, void> {
    let node = this.head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }
  @Modified
  addBefore(node: ILinkedNode<T>, value: T) {
    const { previous } = node;
    const newNode: ILinkedNode<T> = {
      previous,
      value,
      next: node,
    };
    if (node === this.head) {
      readonly.set(this, "head", newNode);
    }
    node.previous = newNode;
    if (previous) {
      previous.next = newNode;
    }
    readonly.set(this, "size", this.size + 1);
  }
  @Modified
  addAfter(node: ILinkedNode<T>, value: T) {
    const { next } = node;
    const newNode: ILinkedNode<T> = {
      previous: node,
      value,
      next,
    };
    if (node === this.tail) {
      readonly.set(this, "tail", newNode);
    }
    node.next = newNode;
    if (next) {
      next.previous = newNode;
    }
    readonly.set(this, "size", this.size + 1);
  }
  @Modified
  addLast(value: T): void {
    if (!this.head) {
      const node = {
        previous: undefined,
        value,
        next: undefined,
      };
      readonly.set(this, "head", node);
      readonly.set(this, "tail", node);
    } else {
      const newNode = {
        previous: this.tail,
        value,
        next: undefined,
      };
      this.tail!.next = newNode;
      readonly.set(this, "tail", newNode);
    }
    readonly.set(this, "size", this.size + 1);
  }
  @Modified
  addFirst(value: T): void {
    if (!this.tail) {
      const node = {
        previous: undefined,
        value,
        next: undefined,
      };
      readonly.set(this, "head", node);
      readonly.set(this, "tail", node);
    } else {
      const newNode = {
        previous: undefined,
        value,
        next: this.head,
      };
      this.head!.previous = newNode;
      readonly.set(this, "head", newNode);
    }
    readonly.set(this, "size", this.size + 1);
  }
  @Modified
  remove(node: ILinkedNode<T>): void {
    const currentSize = this.size;
    if (currentSize === 0) {
      return invalidOperation("LinkedList is empty.");
    }
    if (node === this.head) {
      readonly.set(this, "head", node.next);
    }
    if (node === this.tail) {
      readonly.set(this, "tail", node.previous);
    }
    if (node.next) {
      node.next.previous = undefined;
    }
    if (node.previous) {
      node.previous.next = undefined;
    }
    readonly.set(this, "size", currentSize - 1);
  }
  @Modified
  removeFirst() {
    if (this.size === 0) {
      return invalidOperation("LinkedList is empty");
    }
    return this.remove(this.head!);
  }
  @Modified
  removeLast() {
    if (this.size === 0) {
      return invalidOperation("LinkedList is empty");
    }
    return this.remove(this.tail!);
  }
  find(value: T, start?: ILinkedNode<T>) {
    for (let node = start ?? this.head; !!node; node = node.next) {
      if (node.value === value) {
        return node;
      }
    }
    return undefined;
  }
  findLast(value: T, reverseStart?: ILinkedNode<T>) {
    for (let node = reverseStart ?? this.tail; !!node; node = node.previous) {
      if (node.value === value) {
        return node;
      }
    }
    return undefined;
  }
  @Modified
  clear() {
    readonly.set(this, "head", undefined);
    readonly.set(this, "tail", undefined);
    readonly.set(this, "size", 0);
  }
  clone() {
    const newList = new SimpleLinkedList<T>();
    for (const value of this) {
      newList.addLast(value);
    }
    return newList;
  }
}

export { SimpleLinkedList };
