export type StringKey<T> = Extract<keyof T, string>;
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
