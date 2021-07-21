import type { Func } from "../../types/concepts";

export class DefaultMap<Key, Value> extends Map<Key, Value> {
  #getDefault: Func<[Key], Value>;
  constructor(
    getDefault: Func<[Key], Value>,
    entries?: readonly (readonly [Key, Value])[] | null
  ) {
    super(entries);
    this.#getDefault = getDefault;
  }
  override get(key: Key): Value {
    if (!this.has(key)) {
      this.set(key, this.#getDefault(key));
    }
    return super.get(key)!;
  }
}
