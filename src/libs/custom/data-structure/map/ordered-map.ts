import { RBTree } from "../tree/red-black-tree";
import type { CacheMap, Comparator } from "../interfaces/schema";
import { match } from "../common/option";
import { always, F, T } from "../../functions/wrapper";

interface Entry<K, V> {
  key: K;
  value?: V;
}

export class OrderedMap<K, V> implements CacheMap<K, V> {
  #tree: RBTree<Entry<K, V>>;
  constructor(comparator: Comparator<K>) {
    this.#tree = new RBTree((a, b) => comparator(a.key, b.key));
  }
  get(key: K): V | undefined {
    return match(
      this.#tree.search({ key }),
      (entry) => entry.value!,
      always(undefined)
    );
  }
  has(key: K): boolean {
    return match(this.#tree.search({ key }), T, F);
  }
  set(key: K, value: V): this {
    const [entry, exist] = this.#tree.insert({ key, value });
    if (exist) {
      entry.value = value;
    }
    return this;
  }
  delete(key: K): boolean {
    return this.#tree.erase({ key });
  }
}
