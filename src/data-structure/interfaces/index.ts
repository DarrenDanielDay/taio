export interface IContainer<T> extends Iterable<T> {
  /**
   * The times that the container has been modified.
   */
  readonly $modified: number;
  /**
   * The number of elements in the container.
   */
  readonly size: number;
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
  value: T;
  next: ILinkedNode<T> | undefined;
  previous: ILinkedNode<T> | undefined;
}

export interface ILinkedList<T> extends IContainer<T> {
  readonly head: ILinkedNode<T> | undefined;
  readonly tail: ILinkedNode<T> | undefined;
}
