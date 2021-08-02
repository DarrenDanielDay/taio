import type { Digit, EmptyString, ListChar } from "./string";

export type Add<A extends number, B extends number> = [
  ...ToCount<`${A}`>,
  ...ToCount<`${B}`>
]["length"];
export type Multiply<
  A extends number,
  B extends number
> = ListChar<`${A}`> extends readonly Digit[]
  ? ListChar<`${B}`> extends readonly Digit[]
    ? ListDigitMultiply<ListChar<`${A}`>, ListChar<`${B}`>>["length"]
    : number
  : number;
export type CountItem = 0;
export type MapDigitToCount<N extends Digit> = {
  "0": [];
  "1": [CountItem];
  "2": [CountItem, CountItem];
  "3": [CountItem, CountItem, CountItem];
  "4": [CountItem, CountItem, CountItem, CountItem];
  "5": [CountItem, CountItem, CountItem, CountItem, CountItem];
  "6": [CountItem, CountItem, CountItem, CountItem, CountItem, CountItem];
  "7": [
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem
  ];
  "8": [
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem
  ];
  "9": [
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem,
    CountItem
  ];
}[N];
export type MultiplyByDigit<N extends Digit, Count extends CountItem[]> = {
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
export type MultiplyTen<Arr extends CountItem[]> = [
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
  ? []
  : ListChar<N> extends readonly Digit[]
  ? ListDigitToCount<ListChar<N>>
  : CountItem[];

export type ListDigitToCount<Digits extends readonly Digit[]> =
  Digits extends readonly [...infer H, infer L]
    ? H extends readonly Digit[]
      ? [...MultiplyTen<ListDigitToCount<H>>, ...MapDigitToCount<Digit & L>]
      : CountItem[]
    : [];

export type ListDigitMultiply<
  Digits extends readonly Digit[],
  Multiplicand extends readonly Digit[]
> = Digits extends readonly [...infer H, infer L]
  ? H extends readonly Digit[]
    ? [
        ...MultiplyTen<ListDigitMultiply<H, Multiplicand>>,
        ...MultiplyByDigit<Digit & L, ListDigitToCount<Multiplicand>>
      ]
    : CountItem[]
  : [];
