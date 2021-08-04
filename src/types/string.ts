import type { CutFirst, EmptyTuple } from "./array";
import type { SubstractCount, ToCount } from "./number";

export type EmptyString = "";
export type Underline = "_";
export type Hyphen = "-";
export type LowerCases =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
export type UpperCases =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
export type Chars = LowerCases | UpperCases;
export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type Odds = "1" | "3" | "5" | "7" | "9";
export type Evens = "0" | "2" | "4" | "6" | "8";
export type Binary = "0" | "1";
export type SelectKey<Union extends string, K extends Union> = K;

export type TakeFirst<Str extends string> =
  Str extends `${infer First}${string}` ? First : EmptyString;
export type TakeRest<Str extends string> = Str extends `${string}${infer Rest}`
  ? Rest
  : EmptyString;
export type TakeLast<Str extends string> = ListChar<Str> extends readonly [
  ...string[],
  infer Last
]
  ? Last
  : EmptyString;
export type ListChar<Str extends string> = Str extends EmptyString
  ? []
  : [TakeFirst<Str>, ...ListChar<TakeRest<Str>>];
export type Join<
  Arr extends readonly string[],
  Delimiter extends string = EmptyString
> = Arr extends EmptyTuple
  ? EmptyString
  : Arr extends readonly [infer T]
  ? T extends string
    ? T
    : never
  : `${Arr[0]}${Delimiter}${Join<CutFirst<Arr>, Delimiter>}`;
export type Split<
  Str extends string,
  Splitter extends string
> = Str extends `${infer Head}${Splitter}${infer Tail}`
  ? [Head, ...Split<Tail, Splitter>]
  : [Str];

type TitleMapFn<
  Result extends readonly string[],
  Arr extends readonly string[]
> = Arr extends readonly [string, ...infer Rest]
  ? Rest extends readonly string[]
    ? TitleMapFn<[...Result, Capitalize<Arr[0]>], Rest>
    : never
  : [Result, []];
type TitleMap<Arr extends readonly string[]> = TitleMapFn<[], Arr>[0];

export type PascalCase<Str extends string> = Join<
  TitleMap<SplitFn<[], [], Str>>
>;

type _Expecting<Buffer extends readonly string[]> = Buffer extends EmptyTuple
  ? Chars | Digit
  : Buffer[0] extends Chars
  ? LowerCases
  : Buffer[0] extends Digit
  ? Digit
  : never;

type SplitFn<
  Result extends readonly string[],
  Buffer extends readonly string[],
  Source extends string
> = Source extends EmptyString
  ? Chars | Digit extends _Expecting<Buffer> // Buffer is Empty
    ? Result
    : [...Result, Join<Buffer>]
  : TakeFirst<Source> extends Chars | Digit
  ? TakeFirst<Source> extends _Expecting<Buffer>
    ? SplitFn<Result, [...Buffer, TakeFirst<Source>], TakeRest<Source>>
    : SplitFn<[...Result, Join<Buffer>], [], Source>
  : Chars | Digit extends _Expecting<Buffer> // Buffer is Empty
  ? SplitFn<Result, Buffer, TakeRest<Source>>
  : SplitFn<[...Result, Join<Buffer>], [], TakeRest<Source>>;

export type WordSplit<Str extends string> = SplitFn<[], [], Str>;

export type SnakeCase<Str extends string> = Lowercase<
  Join<WordSplit<Str>, Underline>
>;

export type SmallCamelCase<Str extends string> = `${Lowercase<
  TakeFirst<Str>
>}${TakeRest<PascalCase<Str>>}
>`;

export type CamelCase<Str extends string> = SmallCamelCase<Str>;

export type KebabCase<Str extends string> = Lowercase<
  Join<WordSplit<Str>, Hyphen>
>;

export type TemplateAllowedTypes =
  | bigint
  | boolean
  | number
  | string
  | null
  | undefined;

export type StringLength<Str extends string> = ListChar<Str>["length"];

export type Repeat<Str extends string, N extends number> = Join<
  Extract<MapTupleToStrings<ToCount<`${N}`>, Str>, readonly string[]>,
  ""
>;
export type MapTupleToStrings<
  T extends readonly unknown[],
  Str extends string
> = {
  [K in keyof T]: Str;
};

export type PadStart<
  Src extends string,
  Length extends number,
  Fill extends string = " "
> = StringLength<Fill> extends 1
  ? `${Repeat<
      Fill,
      SubstractCount<ToCount<`${Length}`>, ToCount<`${StringLength<Src>}`>>
    >}${Src}`
  : string;
export type PadEnd<
  Src extends string,
  Length extends number,
  Fill extends string = " "
> = StringLength<Fill> extends 1
  ? `${Src}${Repeat<
      Fill,
      SubstractCount<ToCount<`${Length}`>, ToCount<`${StringLength<Src>}`>>
    >}`
  : string;
