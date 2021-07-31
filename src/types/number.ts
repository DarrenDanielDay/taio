import type { AnyArray, EmptyTuple } from "./array";
import type { Digit, EmptyString, ListChar } from "./string";

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
  "1": [0];
  "2": [0, 0];
  "3": [0, 0, 0];
  "4": [0, 0, 0, 0];
  "5": [0, 0, 0, 0, 0];
  "6": [0, 0, 0, 0, 0, 0];
  "7": [0, 0, 0, 0, 0, 0, 0];
  "8": [0, 0, 0, 0, 0, 0, 0, 0];
  "9": [0, 0, 0, 0, 0, 0, 0, 0, 0];
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
    ? [...MultiplyTen<ListDigitToCount<H>>, ...MapDigitToCount<Digit & L>]
    : AnyArray
  : [];

export type ListDigitMultiply<
  Digits extends Digit[],
  Multiplicand extends Digit[]
> = Digits extends [...infer H, infer L]
  ? H extends Digit[]
    ? [
        ...MultiplyTen<ListDigitMultiply<H, Multiplicand>>,
        ...MultiplyByDigit<Digit & L, ListDigitToCount<Multiplicand>>
      ]
    : AnyArray
  : [];
