import type { TupleUnion } from "../../../types/array";

export const omit = <T extends object, Keys extends readonly (keyof T)[]>(
  obj: T,
  ...keys: Keys
): Omit<T, TupleUnion<Keys>> => {
  const keySet = new Set<PropertyKey>(keys);
  // @ts-expect-error Array.prototype.reduce cannot infer the accumulated object type
  return Reflect.ownKeys(obj).reduce<Partial<Omit<T, TupleUnion<Keys>>>>(
    (accumulate, key) => {
      !keySet.has(key) && Reflect.set(accumulate, key, Reflect.get(obj, key));
      return accumulate;
    },
    {}
  );
};
