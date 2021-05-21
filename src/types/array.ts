export type AnyArray = readonly unknown[];
export type EmptyTuple = readonly [];
export type ArrayItem<Arr extends AnyArray> = Arr extends readonly (infer T)[]
  ? T
  : never;
export type CutFirst<Arr extends AnyArray> = Arr extends [
  unknown,
  ...infer Rest
]
  ? Rest
  : [];
export type TupleSlices<Arr extends AnyArray> = Arr extends EmptyTuple
  ? []
  : Arr extends readonly [infer First, ...infer Rest]
  ? [] | [First, ...TupleSlices<Rest>]
  : never;
