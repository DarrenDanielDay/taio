import { dfs } from "../../../libs/custom/algorithms/search";
import { identity } from "../../../libs/custom/functions/identity";
import type { ExtractKey } from "../../../types/string";
import { isUnionOf } from "../../validator/array";
import type { Assertion } from "../../validator/common";
import { isObjectLike, isObjectOrNull } from "../../validator/object";
import {
  isNullish,
  isNumber,
  isPrimitive,
  isSymbol,
  primitiveOf,
} from "../../validator/primitive";
import { assertThat } from "../../validator/utils";

const assertIsObjectLike: Assertion<Record<PropertyKey, unknown>> =
  assertThat(isObjectLike);

const assertTypeofIsObject: Assertion<object | null> =
  assertThat(isObjectOrNull);

export const isJSONPrimitive = isUnionOf(
  primitiveOf("number"),
  primitiveOf("string"),
  primitiveOf("boolean"),
  isNullish
);

export const isJSONLike = (value: unknown): boolean => {
  if (isPrimitive(value)) {
    return true;
  }
  if (!isPureObject(value) && !isPureArray(value)) {
    return false;
  }
  const refs = new Set<unknown>();
  const iterator = dfs(
    value,
    (val) => {
      if (isPrimitive(val)) {
        return [];
      }
      if (Array.isArray(val)) {
        return val.filter((_, i) => i in val);
      }
      assertIsObjectLike(val);
      return Object.getOwnPropertyNames(val).map((key) =>
        Reflect.get(val, key)
      );
    },
    (val) => {
      if (isObjectLike(val)) {
        refs.add(val);
      }
      return val;
    }
  );
  let current;
  for (current = iterator.next(); !current.done; current = iterator.next()) {
    const { value: iteration } = current;
    if (isJSONPrimitive(iteration)) {
      continue;
    }
    if (isPrimitive(iteration)) {
      return false;
    }
    assertIsObjectLike(iteration);
    if (Array.isArray(iteration)) {
      if (isPureArray(iteration)) {
        continue;
      }
      return false;
    }
    if (!isPureObject(iteration) || Reflect.ownKeys(iteration).some(isSymbol)) {
      return false;
    }
  }
  return current.value.circular.size === 0;
};

const hasPrototype = (
  value: unknown,
  constructor: Function | null
): boolean => {
  const valuePrototype: unknown = Object.getPrototypeOf(value);
  assertTypeofIsObject(valuePrototype);
  return (
    (valuePrototype === null && constructor === null) ||
    valuePrototype?.constructor === constructor
  );
};

/**
 * Test whether an object has custom prototype
 * @param value The value to be tested
 * @returns whether `value` has custom prototype
 */
export const isPureObject = (value: unknown): boolean =>
  typeof value !== "object" || value === null
    ? false
    : hasPrototype(value, Object) || hasPrototype(value, null);

export const isPureArray = (value: unknown): boolean =>
  Array.isArray(value) &&
  hasPrototype(value, Array) &&
  Object.getOwnPropertyNames(value).every(
    (key) =>
      (key === identity<ExtractKey<keyof unknown[], "length">>("length") &&
        isNumber(value[key])) ||
      (key !== "" && [...key].every((char) => +char === +char))
  );
