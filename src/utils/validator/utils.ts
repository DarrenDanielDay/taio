import type { Nullish } from "../../types/common";
import { isUnionThat } from "./array";
import type { Assertion, Validator } from "./common";
import { isObjectLike } from "./object";
import { isNull, isNullish, isUndefined } from "./primitive";

export const optional = <T>(
  validator: Validator<T>
): Validator<T | undefined> => isUnionThat(validator, isUndefined);
export const nullable = <T>(validator: Validator<T>): Validator<T | null> =>
  isUnionThat(validator, isNull);
export const nullishOr = <T>(validator: Validator<T>): Validator<Nullish | T> =>
  isUnionThat(validator, isNullish);
export const stringRecord =
  <T>(
    validator: Validator<T>,
    includeNotEnumerable = false
  ): Validator<Record<string, T>> =>
  (value): value is Record<string, T> =>
    isObjectLike(value) &&
    (includeNotEnumerable
      ? Object.getOwnPropertyNames(value)
      : Object.keys(value)
    ).every((key) => validator(Reflect.get(value, key)));
export const record =
  <T>(validator: Validator<T>): Validator<Record<PropertyKey, T>> =>
  (value): value is Record<PropertyKey, T> =>
    isObjectLike(value) &&
    Reflect.ownKeys(value).every((key) => validator(Reflect.get(value, key)));
export const is =
  <T>(reference: T): Validator<T> =>
  (value: unknown): value is T =>
    Object.is(value, reference);
export const givenValue = is;
export const defineValidator = <T>(validator: Validator<T>): Validator<T> =>
  validator;
export const assertThat =
  <T>(validator: Validator<T>, message?: string): Assertion<T> =>
  (value) => {
    if (!validator(value)) throw new TypeError(message ?? "Assertion Failed");
  };
