/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyArray, AnyParams } from "./array";

export type Func<Params extends AnyArray, Result> = (...args: Params) => Result;
export type AnyFunc = Func<AnyParams, any>;
export type TypeGuard<Union, SubSet extends Union> = (
  obj: Union
) => obj is SubSet;
export type Mapper<In, Out> = Func<[In], Out>;
export type Predicate<T> = Mapper<T, boolean>;
export type Method<This, Params extends AnyArray, Result> = (
  this: This,
  ...args: Params
) => Result;
export type AnyMethod = Method<any, AnyParams, any>;
export type Getter<This, T> = Method<This, [], T>;
export type Setter<This, T> = Method<This, [T], void>;
export type MethodKeys<This> = {
  [K in keyof This]: This[K] extends AnyFunc ? K : never;
}[keyof This];
export type PropertyKeys<T> = {
  [K in keyof T]: T[K] extends AnyFunc ? never : K;
}[keyof T];
export type PropertyPart<T> = Pick<T, PropertyKeys<T>>;
export type MethodPart<T> = Pick<T, MethodKeys<T>>;
export type ConstructorOf<T, Params extends AnyParams> = new (
  ...args: Params
) => T;
export type AnyConstructor = ConstructorOf<unknown, AnyParams>;
export type InstanceSource<T> =
  | ConstructorOf<T, AnyParams>
  | { [Symbol.hasInstance](value: unknown): value is T };
export type AnyInstanceSource = InstanceSource<unknown>;
