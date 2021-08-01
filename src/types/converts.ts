import type { AnyArray } from "./array";
import type { EmptyObject } from "./object";

export type StringKey<T> = Extract<keyof T, string>;
export type IndexKey<Arr extends AnyArray> = Extract<keyof Arr, number>;
export type UnionToIntersection<U> = (
  U extends unknown ? (_: U) => void : never
) extends (_: infer T) => void
  ? T
  : never;
export type IsEqual<A, B, True = true, False = false> = (<T>() => T extends A
  ? true
  : false) extends <T>() => T extends B ? true : false
  ? True
  : False;
/**
 * Be careful to use this type, **the union grows faster than exponential**!
 */
export type Combinations<U, UU = U> = [U] extends [never]
  ? []
  : U extends unknown
  ? [U, ...Combinations<Exclude<UU, U>>]
  : never;
export type Merge<A extends object, B extends object> = {
  [K in keyof A | keyof B]: K extends keyof A
    ? A[K]
    : K extends keyof B
    ? B[K]
    : never;
};
export type MergeAll<Types extends readonly object[]> = Types extends readonly [
  infer T,
  ...infer R
]
  ? T extends object
    ? R extends readonly object[]
      ? Merge<T, MergeAll<R>>
      : T
    : EmptyObject
  : EmptyObject;
