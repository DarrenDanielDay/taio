import { AnyArray } from "./common";

export type WithoutKey<T, K extends keyof T> = Omit<T, K>;
export type StringKey<T> = Extract<keyof T, string>;
export type UnionToIntersection<U> = (
  U extends unknown ? (_: U) => void : never
) extends (_: infer T) => void
  ? T
  : never;
export type ArrayItem<Arr extends AnyArray> = Arr extends readonly (infer T)[]
  ? T
  : never;
