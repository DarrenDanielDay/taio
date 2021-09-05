import type {
  Nullish,
  PrimitiveTypes,
  TypeofMapping,
} from "../../types/common";
import type { WithoutKey } from "../../types/object";
import type { Validator } from "./common";

export const isPrimitive: Validator<PrimitiveTypes> = (
  value
): value is PrimitiveTypes =>
  (typeof value !== "object" && typeof value !== "function") || value === null;
export const isString: Validator<string> = (value): value is string =>
  typeof value === "string";
export const isNumber: Validator<number> = (value): value is number =>
  typeof value === "number";
export const isBoolean: Validator<boolean> = (value): value is boolean =>
  typeof value === "boolean";
export const isSymbol: Validator<symbol> = (value): value is symbol =>
  typeof value === "symbol";
export const isBigint: Validator<bigint> = (value): value is bigint =>
  typeof value === "bigint";
export const isUndefined: Validator<undefined> = (value): value is undefined =>
  value === undefined;
export const isNull: Validator<null> = (value): value is null => value === null;
export const isNullish: Validator<Nullish> = (value): value is Nullish =>
  value == null;
type PrimitiveOnlyTypeofMapping = WithoutKey<
  TypeofMapping,
  "function" | "object"
>;

export const typeofIs =
  <K extends keyof TypeofMapping>(typeName: K): Validator<TypeofMapping[K]> =>
  (value): value is TypeofMapping[K] =>
    typeof value === typeName;
export const isPrimitiveOf: <K extends keyof PrimitiveOnlyTypeofMapping>(
  typename: K
) => Validator<PrimitiveOnlyTypeofMapping[K]> = typeofIs;
export const primitiveOf = isPrimitiveOf;
