import { AnyArray } from "./array";
import { Digit, EmptyString, ListChar } from "./string";

export type Add<A extends number, B extends number> = [
  ...ToCount<`${A}`>,
  ...ToCount<`${B}`>
]["length"];
type MapDigitToCount<N extends Digit> = {
  "0": [];
  "1": [1];
  "2": [2, 2];
  "3": [3, 3, 3];
  "4": [4, 4, 4, 4];
  "5": [5, 5, 5, 5, 5];
  "6": [6, 6, 6, 6, 6, 6];
  "7": [7, 7, 7, 7, 7, 7, 7];
  "8": [8, 8, 8, 8, 8, 8, 8, 8];
  "9": [9, 9, 9, 9, 9, 9, 9, 9, 9];
}[N];
type MutiplyTen<Arr extends AnyArray> = [
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr
];

export type ToCount<N extends string> = N extends EmptyString
  ? never
  : ListChar<N> extends Digit[]
  ? ListDigitToCount<ListChar<N>>
  : never;

export type ListDigitToCount<Digits extends Digit[]> = Digits extends [
  ...infer H,
  infer L
]
  ? H extends Digit[]
    ? [...MutiplyTen<ListDigitToCount<H>>, ...MapDigitToCount<L & Digit>]
    : never
  : [];
