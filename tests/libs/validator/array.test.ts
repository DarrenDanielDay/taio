import {
  isArrayOf,
  isIntersectionOf,
  isIntersectionThat,
  isTupleOf,
  isTupleThat,
  isUnionOf,
  isUnionThat,
} from "../../../src/libs/validator/array";
import { isNumber, isString } from "../../../src/libs/validator/primitive";
import { is } from "../../../src/libs/validator/common";
import { isObject } from "../../../src/libs/validator/object";
import { typeEqual } from "../../../src/functions/common";

describe("Array type guard factory", () => {
  it("should test Arrays", () => {
    const validator = isArrayOf(isNumber);
    expect(validator([1, 2, 3])).toBe(true);
    expect(validator([])).toBe(true);
    expect(validator([""])).toBe(false);
  });

  it("should test simple tuples", () => {
    const validator = isTupleOf<[number, number, number]>(
      isNumber,
      isNumber,
      (value): value is number => typeof value === "number"
    );
    expect(validator([])).toBe(false);
    expect(validator(["aa"])).toBe(false);
    expect(validator([1])).toBe(false);
    expect(validator([2])).toBe(false);
    expect(validator([2, 3])).toBe(false);
    expect(validator([2, 3, 3])).toBe(true);
    expect(validator([+[], Infinity, NaN])).toBe(true);
    expect(validator(["", 3, 2])).toBe(false);
    expect(validator(["", 3, ""])).toBe(false);
  });
  it("should test complex tuples", () => {
    const validator = isTupleOf<[number, string, 10n]>(
      isNumber,
      isString,
      is(10n)
    );
    expect(validator([])).toBe(false);
    expect(validator([1])).toBe(false);
    expect(validator([1, ""])).toBe(false);
    expect(validator([1, "a", 1n])).toBe(false);
    expect(validator([1, "b", 10n])).toBe(true);
    expect(validator([2, "c", 10n])).toBe(true);
    expect(validator([1, "b", 10n, 1])).toBe(false);
    const tuple = [1, "a", 10n];
    if (validator(tuple)) {
      const [num, str, bigint10] = tuple;
      expect([num, str, bigint10]).toEqual(tuple);
    }
  });

  it("should test union types", () => {
    const validator = isUnionOf<[string, number]>(isString, isNumber);
    expect(validator(1)).toBe(true);
    expect(validator("aa")).toBe(true);
    expect(validator(true)).toBe(false);
  });
  it("should test intersection types", () => {
    const validator = isIntersectionOf<[{ a: string }, { b: number }]>(
      isObject({ a: isString }),
      isObject({ b: isNumber })
    );
    expect(validator(1)).toBe(false);
    expect(validator("aa")).toBe(false);
    expect(validator({ a: "aaa" })).toBe(false);
    expect(validator({ b: 1 })).toBe(false);
    expect(validator({ a: "aaa", b: 1 })).toBe(true);
    expect(validator({ a: "aaa", b: "xx" })).toBe(false);
    expect(validator({ a: "aaa", b: 2, c: null })).toBe(true);
  });

  it("should have better type inference with `That` API", () => {
    const tupleValidator = isTupleThat(isString, isNumber, is(10 as const));
    const unionValidator = isUnionThat(isString, isNumber);
    const intersectionValidator = isIntersectionThat(
      isObject({ a: isNumber }),
      isObject({ b: isString })
    );
    const tuple: unknown = ["a", 2, 10];
    const u: unknown = 1;
    const i: unknown = { a: 1, b: "str" };
    if (
      tupleValidator(tuple) &&
      unionValidator(u) &&
      intersectionValidator(i)
    ) {
      const [str, num, ten] = tuple;
      expect(typeEqual<string, typeof str>(true)).toBe(true);
      expect(typeEqual<number, typeof num>(true)).toBe(true);
      expect(typeEqual<10, typeof ten>(true)).toBe(true);
      expect(typeEqual<number | string, typeof u>(true)).toBe(true);
      expect(typeEqual<{ a: number } & { b: string }, typeof i>(true)).toBe(
        true
      );
    } else {
      fail();
    }
  });
});
