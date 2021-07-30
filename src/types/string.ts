import type { CutFirst } from "./array";

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

export type SelectKey<Union extends string, K extends Union> = K;

export type TakeFirst<Str extends string> =
  Str extends `${infer First}${string}` ? First : EmptyString;
export type TakeRest<Str extends string> = Str extends `${string}${infer Rest}`
  ? Rest
  : EmptyString;
export type ListChar<Str extends string> = Str extends EmptyString
  ? []
  : [TakeFirst<Str>, ...ListChar<TakeRest<Str>>];
export type Join<
  Arr extends string[],
  Delimiter extends string = EmptyString
> = Arr extends []
  ? EmptyString
  : Arr extends [infer T]
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

type TitleMapFn<Result extends string[], Arr extends string[]> = Arr extends [
  string,
  ...infer Rest
]
  ? Rest extends string[]
    ? TitleMapFn<[...Result, Capitalize<Arr[0]>], Rest>
    : never
  : [Result, []];
type TitleMap<Arr extends string[]> = TitleMapFn<[], Arr>[0];

export type PascalCase<Str extends string> = Join<
  TitleMap<SplitFn<[], [], Str>>
>;

type _Expecting<Buffer extends string[]> = Buffer extends []
  ? Chars | Digit
  : Buffer[0] extends Chars
  ? LowerCases
  : Buffer[0] extends Digit
  ? Digit
  : never;

type SplitFn<
  Result extends string[],
  Buffer extends string[],
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
