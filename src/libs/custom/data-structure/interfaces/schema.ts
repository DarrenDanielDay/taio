import type { Func } from "../../../../types/concepts";

export interface IContainer<T> extends Iterable<T> {
  /**
   * The number of elements in the container.
   */
  readonly size: number;
  [Symbol.iterator](): Iterator<T, void>;
}

export interface ILinearContainer<T> extends IContainer<T> {
  get(index: number): T | undefined;
  set(index: number, value: T): void;
}

export interface ICollection<T> extends IContainer<T> {
  /**
   * Add a value to the collection.
   * @param value The value to add to the container
   * @returns `true` if added, `false` otherwise.
   */
  add(value: T): boolean;
  /**
   * Remove a value from the collection.
   * @param value The value to add to the container
   * @returns `true` if removed, `false` otherwise.
   */
  remove(value: T): boolean;
  /**
   * Test if a value exists in the collection.
   * @param value The value to add to the container
   * @returns `true` if exists, `false` otherwise
   */
  has(value: T): boolean;
}

export interface ILinkedNode<T> {
  readonly value: T;
  readonly next: ILinkedNode<T> | undefined;
  readonly previous: ILinkedNode<T> | undefined;
}

export interface ILinkedList<T> extends IContainer<T> {
  readonly head: ILinkedNode<T> | undefined;
  readonly tail: ILinkedNode<T> | undefined;
}

export interface IStack<T> extends IContainer<T> {
  push(value: T): void;
  pop(): T;
  readonly top: T;
}

export interface IQueue<T> extends IContainer<T> {
  enqueue(value: T): void;
  dequeue(): T;
  readonly front: T;
  readonly back: T;
}

export interface CacheMap<K, V> extends Pick<Map<K, V>, "get" | "has"> {
  set: (key: K, value: V) => this;
}

export type Comparator<T> = Func<[a: T, b: T], number>;
