import type { AnyArray, ArrayItem } from "../types/array";
import type { StringKey, UnionToIntersection } from "../types/converts";

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

/** @internal */
export interface ITypedObject {
  keys<T>(obj: T): StringKey<T>[];

  entries<T>(obj: T): { [K in StringKey<T>]: [K, T[K]] }[StringKey<T>][];

  values<T>(obj: T): { [K in StringKey<T>]: T[K] }[StringKey<T>][];

  defineProperty<T extends object, K extends PropertyKey, P>(
    obj: T,
    key: K,
    descriptor: TypedPropertyDescriptor<P>
  ): asserts obj is T & DefinedProperty<K, P>;

  defineProperties<T extends object, Descriptors extends PropertyDescriptors>(
    obj: T,
    descriptors: Descriptors
  ): asserts obj is T & DefinedProperties<Descriptors>;

  getOwnPropertyDescriptor<T extends object, K extends keyof T>(
    obj: T,
    key: K
  ): TypedPropertyDescriptor<T[K]> | undefined;

  getOwnPropertyDescriptors<T extends object>(
    obj: T
  ): { [K in keyof T]?: TypedPropertyDescriptor<T[K]> };

  getPrototypeOf<T>(target: T): T | null;

  create<T extends object | null>(prototype: T): T extends null ? {} : T;

  assign<T, Patches extends AnyArray>(
    source: T,
    ...patch: Patches
  ): asserts source is T & UnionToIntersection<ArrayItem<Patches>>;
}

const TypedObject: ITypedObject = Object;
export { TypedObject };
