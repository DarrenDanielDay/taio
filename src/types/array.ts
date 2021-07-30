/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyArray = readonly unknown[];
export type AnyParams = any[];
export type EmptyTuple = readonly [];
export type ArrayItem<Arr extends AnyArray> = Arr extends readonly (infer T)[]
  ? T
  : never;
export type Reverse<Arr extends AnyArray> = Arr extends [
  ...infer Rest,
  infer Last
]
  ? [Last, ...Reverse<Rest>]
  : [];
export type CutFirst<Arr extends AnyArray> = Arr extends [
  unknown,
  ...infer Rest
]
  ? Rest
  : [];
export type CutLast<Arr extends AnyArray> = Arr extends [...infer Rest, unknown]
  ? Rest
  : [];
export type FirstOf<Arr extends AnyArray> = Arr extends EmptyTuple
  ? never
  : Arr[0];
export type LastOf<Arr extends AnyArray> = Arr extends EmptyTuple
  ? never
  : Arr extends [...AnyArray, infer R]
  ? R
  : never;
export type TupleSlices<Arr extends AnyArray> = Arr extends EmptyTuple
  ? EmptyTuple
  : Arr extends readonly [infer First, ...infer Rest]
  ? EmptyTuple | readonly [First, ...TupleSlices<Rest>]
  : never;
