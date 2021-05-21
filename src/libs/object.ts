import { AnyArray } from "../types/common";
import { ArrayItem, StringKey, UnionToIntersection } from "../types/converts";

type DefinedProperties<
  Descriptors extends Record<PropertyKey, TypedPropertyDescriptor<unknown>>
> = {
  [K in keyof Descriptors]: Descriptors[K] extends TypedPropertyDescriptor<
    infer P
  >
    ? P
    : never;
};

type PropertyDescriptors = Record<
  PropertyKey,
  TypedPropertyDescriptor<unknown>
>;

type DefinedProperty<K extends PropertyKey, P> = {
  [Key in K]: P;
};

interface ITypedObject extends ObjectConstructor {
  keys<T>(obj: T): StringKey<T>[];

  entries<T>(obj: T): { [K in StringKey<T>]: [K, T[K]] }[StringKey<T>][];

  values<T>(obj: T): { [K in StringKey<T>]: T[K] }[StringKey<T>][];

  defineProperty<T, K extends PropertyKey, P>(
    obj: T,
    key: K,
    descriptor: TypedPropertyDescriptor<P>
  ): asserts obj is T & DefinedProperty<K, P>;

  defineProperties<T, Descriptors extends PropertyDescriptors>(
    obj: T,
    descriptors: Descriptors
  ): asserts obj is T & DefinedProperties<Descriptors>;

  getOwnPropertyDescriptor<T, K extends keyof T>(
    obj: T,
    key: K
  ): TypedPropertyDescriptor<T[K]>;

  getOwnPropertyDescriptors<T>(
    obj: T
  ): { [K in keyof T]: TypedPropertyDescriptor<T[K]> };

  create<T extends object | null>(prototype: T): T extends null ? {} : T;

  assign<T, Patchs extends AnyArray>(
    source: T,
    ...patch: Patchs
  ): asserts source is T & UnionToIntersection<ArrayItem<Patchs>>;
}
// @ts-expect-error
const TypedObject: ITypedObject = Object;
export { TypedObject };
