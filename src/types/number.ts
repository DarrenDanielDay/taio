import { AnyArray, EmptyTuple } from "./array";
import { Digit, EmptyString, ListChar } from "./string";

export type Add<A extends number, B extends number> = [
  ...ToCount<`${A}`>,
  ...ToCount<`${B}`>
]["length"];
export type Multiply<
  A extends number,
  B extends number
> = ListChar<`${A}`> extends Digit[]
  ? ListChar<`${B}`> extends Digit[]
    ? ListDigitMultiply<ListChar<`${A}`>, ListChar<`${B}`>>["length"]
    : number
  : number;
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
type MultiplyByDigit<N extends Digit, Count extends AnyArray> = {
  "0": [];
  "1": [...Count];
  "2": [...Count, ...Count];
  "3": [...Count, ...Count, ...Count];
  "4": [...Count, ...Count, ...Count, ...Count];
  "5": [...Count, ...Count, ...Count, ...Count, ...Count];
  "6": [...Count, ...Count, ...Count, ...Count, ...Count, ...Count];
  "7": [...Count, ...Count, ...Count, ...Count, ...Count, ...Count, ...Count];
  "8": [
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count
  ];
  "9": [
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count,
    ...Count
  ];
}[N];
type MultiplyTen<Arr extends AnyArray> = [
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
  ? EmptyTuple
  : ListChar<N> extends Digit[]
  ? ListDigitToCount<ListChar<N>>
  : AnyArray;

export type ListDigitToCount<Digits extends Digit[]> = Digits extends [
  ...infer H,
  infer L
]
  ? H extends Digit[]
    ? [...MultiplyTen<ListDigitToCount<H>>, ...MapDigitToCount<L & Digit>]
    : AnyArray
  : [];

export type ListDigitMultiply<
  Digits extends Digit[],
  Multiplicand extends Digit[]
> = Digits extends [...infer H, infer L]
  ? H extends Digit[]
    ? [
        ...MultiplyTen<ListDigitMultiply<H, Multiplicand>>,
        ...MultiplyByDigit<L & Digit, ListDigitToCount<Multiplicand>>
      ]
    : AnyArray
  : [];
