import { AnyArray, ArrayItem, EmptyTuple } from "./array";
import { LiteralToPrimitive, PrimitiveTypes } from "./common";
import { TemplateAllowedTypes } from "./string";
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