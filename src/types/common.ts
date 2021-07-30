import type { AnyFunc } from "./concepts";
import type { WithoutKey } from "./object";

export type PrimitiveTypes =
  | bigint
  | boolean
  | number
  | string
  | symbol
  | null
  | undefined;
export type Nullish = null | undefined;
export interface PrimitiveTypeMapping {
  string: string;
  number: number;
  boolean: boolean;
  undefined: undefined;
  null: null;
  symbol: symbol;
  bigint: bigint;
}
export interface TypeofMapping
  extends WithoutKey<PrimitiveTypeMapping, "null"> {
  function: AnyFunc;
  object: object;
}
export type TypeOfLiterals = keyof TypeofMapping;
export type TypeOfLiteralToBuiltInType<T extends PrimitiveTypes | object> = {
  [K in TypeOfLiterals]: T extends TypeofMapping[K] ? K : never;
}[TypeOfLiterals];

export type LiteralToPrimitive<T extends PrimitiveTypes> = T extends null
  ? null
  : T extends undefined
  ? undefined
  : T extends number
  ? number
  : T extends string
  ? string
  : T extends boolean
  ? boolean
  : T extends symbol
  ? symbol
  : T extends bigint
  ? bigint
  : T;
