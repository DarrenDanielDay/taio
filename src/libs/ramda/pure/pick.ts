import type { TupleUnion } from "../../../types/array";

export function pick<T extends object, Keys extends readonly (keyof T)[]>(
  obj: T,
  ...keys: Keys
): Pick<T, TupleUnion<Keys>> {
  // @ts-expect-error Array.prototype.reduce cannot infer the accumulated object type
  return keys.reduce<Partial<Pick<T, TupleUnion<Keys>>>>((accumulate, key) => {
    Reflect.set(accumulate, key, Reflect.get(obj, key));
    return accumulate;
  }, {});
}
