import { Freeze } from "../../../../utils/decorators/limitations";
import { invalidOperation } from "../../../../utils/internal/exceptions";
import { sealedConstruct } from "../../../../utils/object-operation";
import { TypedReflect } from "../../../typescript/reflect";
import { ImmutableIterator } from "../common/iterator";
import type { ILinkedNode, ILinkedList } from "../interfaces/schema";
export class SimpleLinkedList<T>
  extends ImmutableIterator<T>
  implements ILinkedList<T>
{
  #head: ILinkedNode<T> | undefined;
  get head() {
    return this.#head;
  }
  #tail: ILinkedNode<T> | undefined;
  get tail() {
    return this.#tail;
  }
  #size = 0;
  get size() {
    return this.#size;
  }
  constructor() {
    super();
    sealedConstruct(SimpleLinkedList, new.target);
  }
  protected *getIterator(): Iterator<T, void> {
    let node = this.head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }
  addBefore(node: ILinkedNode<T>, value: T) {
    const { previous } = node;
    const newNode: ILinkedNode<T> = this.#createNode({
      previous,
      value,
      next: node,
    });
    if (node === this.head) {
      this.#head = newNode;
    }
    TypedReflect.set(node, "previous", newNode);
    if (previous) {
      TypedReflect.set(previous, "next", newNode);
    }
    this.#size++;
    this.markAsChanged();
  }
  addAfter(node: ILinkedNode<T>, value: T) {
    const { next } = node;
    const newNode: ILinkedNode<T> = this.#createNode({
      previous: node,
      value,
      next,
    });
    if (node === this.tail) {
      this.#tail = newNode;
    }
    TypedReflect.set(node, "next", newNode);
    if (next) {
      TypedReflect.set(next, "previous", newNode);
    }
    this.#size++;
    this.markAsChanged();
  }
  addLast(value: T): void {
    if (!this.head || !this.tail) {
      const newNode = this.#createNode({
        previous: undefined,
        value,
        next: undefined,
      });
      this.#head = this.#tail = newNode;
    } else {
      const newNode = this.#createNode({
        previous: this.tail,
        value,
        next: undefined,
      });
      TypedReflect.set(this.tail, "next", newNode);
      this.#tail = newNode;
    }
    this.#size++;
    this.markAsChanged();
  }

  addFirst(value: T): void {
    if (!this.tail || !this.head) {
      const newNode = this.#createNode({
        previous: undefined,
        value,
        next: undefined,
      });
      this.#head = this.#tail = newNode;
    } else {
      const newNode = this.#createNode({
        previous: undefined,
        value,
        next: this.head,
      });
      TypedReflect.set(this.head, "previous", newNode);
      this.#head = newNode;
    }
    this.#size++;
    this.markAsChanged();
  }
  remove(node: ILinkedNode<T>): void {
    const currentSize = this.size;
    if (currentSize === 0) {
      return invalidOperation("LinkedList is empty.");
    }
    if (node === this.head) {
      this.#head = node.next;
    }
    if (node === this.tail) {
      this.#tail = node.previous;
    }
    if (node.next) {
      TypedReflect.set(node.next, "previous", undefined);
    }
    if (node.previous) {
      TypedReflect.set(node.previous, "next", undefined);
    }
    this.#size--;
    this.markAsChanged();
  }
  removeFirst() {
    if (this.size === 0) {
      return invalidOperation("LinkedList is empty");
    }
    return this.remove(this.head!);
  }
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
  clear() {
    this.#head = this.#tail = undefined;
    this.#size = 0;
    this.markAsChanged();
  }
  clone() {
    const newList = new SimpleLinkedList<T>();
    for (const value of this) {
      newList.addLast(value);
    }
    return newList;
  }
  #createNode(node: ILinkedNode<T>) {
    return Object.preventExtensions(node);
  }
}
Freeze(SimpleLinkedList);
