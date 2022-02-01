import type { StringKey } from "../types/converts";
import type { EnumUnderlayingType, StandardEnum } from "../types/enum";

export const stringEnumValues = <E extends EnumUnderlayingType>(
  enumObject: StandardEnum<E>
) =>
  Object.values(enumObject).filter(
    (value): value is Extract<E, string> =>
      typeof value === "string" &&
      // Number enum value has double mapping: both name to value and value to name.
      // So when the value can be mapped to a number, it should be the name of a number enum value.
      typeof Reflect.get(enumObject, value) !== "number"
  );

export const numberEnumValues = <E extends EnumUnderlayingType>(
  enumObject: StandardEnum<E>
) =>
  Object.values(enumObject).filter(
    (value): value is Extract<E, number> => typeof value === "number"
  );

export const enumValues = <E extends EnumUnderlayingType>(
  enumObject: StandardEnum<E>
) =>
  Object.values(enumObject).filter(
    (value): value is E => typeof Reflect.get(enumObject, value) !== "number"
  );

export const enumKeys = <T extends StandardEnum<EnumUnderlayingType>>(
  standardEnum: T
) =>
  Object.keys(standardEnum).filter((key): key is StringKey<T> => isNaN(+key));

export const enumKeyOfValue = <Enum extends StandardEnum<EnumUnderlayingType>>(
  enumObject: Enum,
  value: Enum extends StandardEnum<infer E> ? E : never
): keyof Enum =>
  Object.entries(enumObject).find(([, val]) => val === value)![0];
