import {
  isAnyOf,
  isArrayOf,
  isIntersectionOf,
  isIntersectionThat,
  isMergedObjectThat,
  isTupleOf,
  isTupleThat,
  isUnionOf,
  isUnionThat,
} from "../../../src/libs/validator/array";
import {
  isNumber,
  isString,
  primitiveOf,
} from "../../../src/libs/validator/primitive";
import { isObject } from "../../../src/libs/validator/object";
import { keyOf, typeEqual } from "../../../src/functions/common";
import type { Combinations } from "../../../src/types/converts";
import { is } from "../../../src/libs/validator/utils";

describe("Array type guard factory", () => {
  it("should test Arrays", () => {
    const validator = isArrayOf(primitiveOf("number"));
    expect(validator([1, 2, 3])).toBe(true);
    expect(validator([])).toBe(true);
    expect(validator([""])).toBe(false);
  });

  it("should test simple tuples", () => {
    const validator = isTupleOf<[number, number, number]>(
      primitiveOf("number"),
      primitiveOf("number"),
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
      primitiveOf("number"),
      primitiveOf("string"),
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
    const validator = isUnionOf<[string, number]>(
      primitiveOf("string"),
      primitiveOf("number")
    );
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
    const tupleValidator = isTupleThat(
      primitiveOf("string"),
      primitiveOf("number"),
      is(10 as const)
    );
    const unionValidator = isUnionThat(
      primitiveOf("string"),
      primitiveOf("number")
    );
    const intersectionValidator = isIntersectionThat(
      isObject({ a: isNumber }),
      isObject({ b: isString })
    );
    const mergedValidator = isMergedObjectThat(
      isObject({ a: isNumber }),
      isObject({ b: isString })
    );
    const tuple: unknown = ["a", 2, 10];
    const union: unknown = 1;
    const intersection: unknown = { a: 1, b: "str" };
    const merged: unknown = { a: 1, b: "str" };
    if (
      tupleValidator(tuple) &&
      unionValidator(union) &&
      intersectionValidator(intersection) &&
      mergedValidator(merged)
    ) {
      const [str, num, ten] = tuple;
      expect(typeEqual<string, typeof str>(true)).toBe(true);
      expect(typeEqual<number, typeof num>(true)).toBe(true);
      expect(typeEqual<10, typeof ten>(true)).toBe(true);
      expect(typeEqual<number | string, typeof union>(true)).toBe(true);
      expect(
        typeEqual<{ a: number } & { b: string }, typeof intersection>(true)
      ).toBe(true);
      expect(typeEqual<{ a: number; b: string }, typeof merged>(true)).toBe(
        true
      );
    } else {
      fail();
    }
  });

  it("should infer union", () => {
    interface Foo {
      a: 1;
      b: 2;
    }
    const validator = isAnyOf("1" as const, "2" as const, 3 as const);
    const value: unknown = 3;
    if (validator(value)) {
      expect(typeEqual<"1" | "2" | 3, typeof value>(true));
    } else {
      fail();
    }
    const keysCombination1 = isAnyOf<Combinations<keyof Foo>>("a", "b");
    const keysCombination2 = isAnyOf<Combinations<keyof Foo>>("b", "a");
    isAnyOf<Combinations<keyof Foo>>(
      // @ts-expect-error Directive as type check
      "a"
    );
    isAnyOf<Combinations<keyof Foo>>(
      // @ts-expect-error Directive as type check
      "b"
    );
    isAnyOf<Combinations<keyof Foo>>(
      // @ts-expect-error Directive as type check
      "a",
      "b",
      "c"
    );
    expect(
      keysCombination1(keyOf<Foo>("a")) && keysCombination2(keyOf<Foo>("b"))
    ).toBe(true);
  });
});
