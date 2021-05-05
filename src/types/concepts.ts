import { AnyArray } from "./common";

export type Func<Params extends AnyArray, Result> = (...args: Params) => Result;
export type AnyFunc = Func<any[], any>;
export type Method<This, Params extends AnyArray, Result> = (
  this: This,
  ...args: Params
) => Result;
export type AnyMethod = Method<any, any[], any>;
export type MethodKeys<This> = {
  [K in keyof This]: This[K] extends Function ? K : never;
}[keyof This];
