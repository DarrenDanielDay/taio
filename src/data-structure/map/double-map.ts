import type { Func } from "../../types/concepts";

export class DoubleMap<K, V> {
  #keyToValue = new Map<K, V>();
  #valueToKey = new Map<V, K>();
  get size(): number {
    return this.#keyToValue.size;
  }
  set(key: K, value: V) {
    this.deleteKey(key);
    this.deleteValue(value);
    this.#keyToValue.set(key, value);
    this.#valueToKey.set(value, key);
  }
  getValue(key: K) {
    return this.#keyToValue.get(key);
  }
  hasKey(key: K) {
    return this.#keyToValue.has(key);
  }
  deleteKey(key: K) {
    if (this.#keyToValue.has(key)) {
      const v = this.#keyToValue.get(key)!;
      this.#keyToValue.delete(key);
      this.#valueToKey.delete(v);
      return true;
    }
    return false;
  }
  getKey(value: V) {
    return this.#valueToKey.get(value);
  }
  hasValue(value: V) {
    return this.#valueToKey.has(value);
  }
  deleteValue(value: V) {
    if (this.#valueToKey.has(value)) {
      const k = this.#valueToKey.get(value)!;
      this.#valueToKey.delete(value);
      this.#keyToValue.delete(k);
      return true;
    }
    return false;
  }
  clear() {
    this.#keyToValue.clear();
    this.#valueToKey.clear();
  }
  forEach(
    callback: Func<
      [entry: { key: K; value: V }, doubleMap: DoubleMap<K, V>],
      void
    >
  ) {
    this.#keyToValue.forEach((value, key) => callback({ key, value }, this));
  }
  *[Symbol.iterator](): Generator<[key: K, value: V], void, undefined> {
    yield* this.#keyToValue.entries();
  }
}
