import type { AnyArray, ArrayItem, EmptyTuple } from "../types/array";
import type { StringKey, UnionToIntersection } from "../types/converts";
import type {
  AnyPrototype,
  EmptyObject,
  FrozenObject,
  NonExtensibleObject,
  SealedObject,
} from "../types/object";

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

type ConstructFromEntries<
  Entries extends readonly (readonly [PropertyKey, unknown])[]
> = Entries extends EmptyTuple
  ? EmptyObject
  : Entries extends readonly [infer F, ...infer R]
  ? F extends readonly [infer K, infer V]
    ? R extends readonly (readonly [PropertyKey, unknown])[]
      ? K extends PropertyKey
        ? ConstructFromEntries<R> & DefinedProperty<K, V>
        : never
      : never
    : never
  : Record<ArrayItem<Entries>[0], ArrayItem<Entries>[1]>;

/** @internal */
export interface ITypedObject {
  getPrototypeOf<T>(target: T): Partial<T> | null;
  getOwnPropertyDescriptor<T extends object, K extends keyof T>(
    obj: T,
    key: K
  ): TypedPropertyDescriptor<T[K]> | undefined;
  getOwnPropertyNames<T>(target: T): StringKey<T>[];
  create<T extends object | null>(
    prototype: T
  ): T extends null ? EmptyObject : T;
  create<T extends object | null, Descriptors extends PropertyDescriptors>(
    prototype: T,
    descriptors: Descriptors
  ): DefinedProperties<Descriptors> & (T extends null ? EmptyObject : T);
  defineProperty<T extends object, K extends PropertyKey, P>(
    obj: T,
    key: K,
    descriptor: TypedPropertyDescriptor<P>
  ): asserts obj is DefinedProperty<K, P> & T;
  defineProperties<T extends object, Descriptors extends PropertyDescriptors>(
    obj: T,
    descriptors: Descriptors
  ): asserts obj is DefinedProperties<Descriptors> & T;
  seal<T>(target: T): asserts target is SealedObject<T>;
  freeze<T>(target: T): asserts target is FrozenObject<T>;
  preventExtensions<T>(target: T): asserts target is NonExtensibleObject<T>;
  isSealed<T>(obj: T): obj is SealedObject<T>;
  isFrozen<T>(obj: T): obj is FrozenObject<T>;
  isExtensible<T>(obj: T): boolean;
  keys<T>(obj: T): StringKey<T>[];
  entries<T>(obj: T): { [K in StringKey<T>]: [K, T[K]] }[StringKey<T>][];
  values<T>(obj: T): { [K in StringKey<T>]: T[K] }[StringKey<T>][];
  getOwnPropertyDescriptors<T extends object>(
    obj: T
  ): { [K in keyof T]?: TypedPropertyDescriptor<T[K]> };
  assign<T, Patches extends AnyArray>(
    source: T,
    ...patch: Patches
  ): asserts source is T & UnionToIntersection<ArrayItem<Patches>>;
  fromEntries<Entries extends readonly (readonly [PropertyKey, unknown])[]>(
    entries: Entries
  ): ConstructFromEntries<Entries>;
  setPrototypeOf<T, Prototype extends AnyPrototype>(
    obj: T,
    prototype: Prototype
  ): asserts obj is T & (Prototype extends null ? unknown : Prototype);
}

// @ts-expect-error Type overwrite
const TypedObject: ITypedObject = Object;
export { TypedObject };
