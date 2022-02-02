// To ensure all of mapping is immutable.
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type {
  Binary,
  EmptyString,
  Evens,
  PadStart,
  TakeFirst,
  TakeLast,
  TakeRest,
} from "./string";
export type MaxBinaryLength = 24;
export type ToBinary<Literal extends string> = Literal extends EmptyString
  ? EmptyString
  : Literal extends Binary
  ? Literal
  : `${ToBinary<DivideByTwo<Literal>>}${ModTwo<Literal>}`;
export type MaxBinaryOperationLength = 15;
export type BNot<
  N extends number,
  Length extends number = MaxBinaryOperationLength
> = LengthedBinaryNot<PadStart<`${N}`, Length, "0">>;
export type BAnd<
  A extends number,
  B extends number,
  Length extends number = MaxBinaryOperationLength
> = LengthedBinaryAnd<
  AddLeadingZeroes<ToBinary<`${A}`>, Length>,
  AddLeadingZeroes<ToBinary<`${B}`>, Length>
>;
export type BOr<
  A extends number,
  B extends number,
  Length extends number = MaxBinaryOperationLength
> = LengthedBinaryOr<
  AddLeadingZeroes<ToBinary<`${A}`>, Length>,
  AddLeadingZeroes<ToBinary<`${B}`>, Length>
>;
export type BXOr<
  A extends number,
  B extends number,
  Length extends number = MaxBinaryOperationLength
> = LengthedBinaryXOr<
  AddLeadingZeroes<ToBinary<`${A}`>, Length>,
  AddLeadingZeroes<ToBinary<`${B}`>, Length>
>;
export type BinaryAnd<
  LA extends string,
  LB extends string,
  Length extends number = MaxBinaryOperationLength
> = LengthedBinaryAnd<
  AddLeadingZeroes<LA, Length>,
  AddLeadingZeroes<LB, Length>
>;
export type BinaryOr<
  LA extends string,
  LB extends string,
  Length extends number = MaxBinaryOperationLength
> = LengthedBinaryOr<
  AddLeadingZeroes<LA, Length>,
  AddLeadingZeroes<LB, Length>
>;
export type BinaryXOr<
  LA extends string,
  LB extends string,
  Length extends number = MaxBinaryOperationLength
> = LengthedBinaryXOr<
  AddLeadingZeroes<LA, Length>,
  AddLeadingZeroes<LB, Length>
>;
type DivideByTwoMap = {
  "0": "0";
  "1": "0";
  "2": "1";
  "3": "1";
  "4": "2";
  "5": "2";
  "6": "3";
  "7": "3";
  "8": "4";
  "9": "4";
  "00": "0";
  "01": "0";
  "02": "1";
  "03": "1";
  "04": "2";
  "05": "2";
  "06": "3";
  "07": "3";
  "08": "4";
  "09": "4";
  "10": "5";
  "11": "5";
  "12": "6";
  "13": "6";
  "14": "7";
  "15": "7";
  "16": "8";
  "17": "8";
  "18": "9";
  "19": "9";
};
type BinaryNotMap = {
  "0": "1";
  "1": "0";
};
type BinaryOrMap = {
  "00": "0";
  "01": "1";
  "10": "1";
  "11": "1";
};
type BinaryAndMap = {
  "00": "0";
  "01": "0";
  "10": "0";
  "11": "1";
};
type BinaryXOrMap = {
  "00": "0";
  "01": "1";
  "10": "1";
  "11": "0";
};
export type ModTwo<Literal extends string> = TakeLast<Literal> extends Evens
  ? "0"
  : "1";

export type DivideByTwo<Literal extends string> =
  Literal extends keyof DivideByTwoMap
    ? DivideByTwoMap[Literal]
    : Literal extends `${infer D}${infer R}`
    ? D extends Binary
      ? `${DivideByTwoMap[keyof DivideByTwoMap &
          `${D}${TakeFirst<R>}`]}${DivideByTwo<`${ModTwo<`${D}${TakeFirst<R>}`>}${TakeRest<R>}`>}`
      : `${DivideByTwoMap[D &
          keyof DivideByTwoMap]}${DivideByTwo<`${ModTwo<D>}${R}`>}`
    : EmptyString;
export type LengthedBinaryNot<Literal extends string> =
  Literal extends `${infer F}${infer R}`
    ? `${BinaryNotMap[F & keyof BinaryNotMap]}${LengthedBinaryNot<R>}`
    : EmptyString;
export type LengthedBinaryAnd<
  LA extends string,
  LB extends string
> = LA extends `${infer FA}${infer RA}`
  ? LB extends `${infer FB}${infer RB}`
    ? `${BinaryAndMap[keyof BinaryAndMap & `${FA}${FB}`]}${LengthedBinaryAnd<
        RA,
        RB
      >}`
    : EmptyString
  : EmptyString;
export type LengthedBinaryOr<
  LA extends string,
  LB extends string
> = LA extends `${infer FA}${infer RA}`
  ? LB extends `${infer FB}${infer RB}`
    ? `${BinaryOrMap[keyof BinaryOrMap & `${FA}${FB}`]}${LengthedBinaryOr<
        RA,
        RB
      >}`
    : EmptyString
  : EmptyString;
export type LengthedBinaryXOr<
  LA extends string,
  LB extends string
> = LA extends `${infer FA}${infer RA}`
  ? LB extends `${infer FB}${infer RB}`
    ? `${BinaryXOrMap[keyof BinaryXOrMap & `${FA}${FB}`]}${LengthedBinaryXOr<
        RA,
        RB
      >}`
    : EmptyString
  : EmptyString;
export type AddLeadingZeroes<
  Literal extends string,
  Length extends number
> = PadStart<Literal, Length, "0">;
