import { enumKeys, enumValues } from "../../enums/operation";
import type { EnumUnderlayingType, StandardEnum } from "../../types/enum";
import type { Validator } from "./common";

export const isEnumOf =
  <T extends EnumUnderlayingType>(
    standardEnum: StandardEnum<T>
  ): Validator<T> =>
  (value): value is T =>
    new Set<unknown>(enumValues(standardEnum)).has(value);

export const isEnumNameOf =
  <T extends StandardEnum<EnumUnderlayingType>>(
    standardEnum: T
  ): Validator<keyof T> =>
  (value): value is keyof T =>
    new Set<unknown>(enumKeys(standardEnum)).has(value);
