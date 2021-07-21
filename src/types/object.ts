import type { AnyArray, ArrayItem, EmptyTuple } from "./array";
import type { LiteralToPrimitive, PrimitiveTypes } from "./common";
import type { TemplateAllowedTypes } from "./string";
export type EmptyObject = {};
export type AnyPrototype = object | null;
export type WithoutKey<T, K extends keyof T> = Omit<T, K>;
export type DeepReadonly<T> = T extends PrimitiveTypes
  ? T
  : T extends AnyArray
  ? Readonly<T>
  : { readonly [K in keyof T]: DeepReadonly<T[K]> };

export type DeepMutable<T> = T extends PrimitiveTypes
  ? LiteralToPrimitive<T>
  : T extends EmptyTuple
  ? unknown[]
  : T extends AnyArray
  ? DeepMutable<ArrayItem<T>>[]
  : { -readonly [K in keyof T]: DeepMutable<T[K]> };

export type DeepPartial<T> = T extends PrimitiveTypes | AnyArray
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> };
export type AccessPaths<T> = T extends object
  ? {
      [K in keyof T]: [K] | [K, ...AccessPaths<T[K]>];
    }[keyof T]
  : [];

export type AccessByPath<
  T,
  Path extends AccessPaths<T>
> = Path extends EmptyTuple
  ? T
  : Path extends [infer Current, ...infer Rest]
  ? Current extends keyof T
    ? Rest extends AccessPaths<T[Current]>
      ? AccessByPath<T[Current], Rest>
      : never
    : never
  : never;

export type StringAccessKeyOf<T> = T extends PrimitiveTypes
  ? never
  : `${Extract<keyof T, TemplateAllowedTypes>}`;

export type StringAccessPaths<T> = T extends object
  ? {
      [K in StringAccessKeyOf<T> & keyof T]:
        | [K]
        | [K, ...StringAccessPaths<T[K]>];
    }[StringAccessKeyOf<T> & keyof T]
  : [];
type NonExtensibleMixin = {
  readonly [key: string]: never;
  readonly [index: number]: never;
};

export type NonExtensibleObject<T> = T & NonExtensibleMixin;
export type SealedObject<T> = NonExtensibleObject<T>;
export type FrozenObject<T> = Readonly<T> & NonExtensibleMixin;
