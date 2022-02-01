import {
  constructAbstractClass,
  invalidOperation,
} from "../../../../utils/internal/exceptions";

/**
 * @internal
 */
export abstract class ImmutableIterator<T> implements Iterable<T> {
  #changes = 0;
  constructor() {
    if (new.target === ImmutableIterator) {
      return constructAbstractClass("ImmutableIterator");
    }
    Object.freeze(this);
  }
  *[Symbol.iterator](): Iterator<T> {
    const initChanges = this.#changes;
    const iterator = this.getIterator();
    for (
      let iteration = iterator.next();
      !iteration.done;
      iteration = iterator.next()
    ) {
      yield iteration.value;
      if (this.#changes !== initChanges) {
        return invalidOperation("Container modified in iteration.");
      }
    }
  }

  /**
   * @internal
   */
  protected abstract getIterator(): Iterator<T, void>;
  /**
   * @internal
   */
  protected markAsChanged(): void {
    this.#changes++;
  }
}
