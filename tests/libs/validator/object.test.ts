import { typeEqual } from "../../../src/functions/common";
import { isArrayOf } from "../../../src/libs/validator/array";
import { defineValidator, is } from "../../../src/libs/validator/common";
import { isInstanceOf, isObject } from "../../../src/libs/validator/object";
import { isNumber, isSymbol } from "../../../src/libs/validator/primitive";

describe("object schema validator", () => {
  it("should test object schema", () => {
    const validator = defineValidator<{ a: number; b: "bbb"; c: symbol[] }>(
      isObject({
        a: isNumber,
        b: is("bbb"),
        c: isArrayOf(isSymbol),
      })
    );
    expect(validator({})).toBe(false);
    expect(validator({ a: 1 })).toBe(false);
    expect(validator({ a: 2, b: "bbb" })).toBe(false);
    expect(validator({ a: 3, b: "bbb", c: [] })).toBe(true);
  });
  it("should test constructor", () => {
    const validator = isInstanceOf(Array);
    const arr: unknown = [];
    if (validator(arr)) {
      expect(typeEqual<unknown[], typeof arr>(true)).toBe(true);
    }
    expect(validator([])).toBe(true);
    expect(validator([0])).toBe(true);
    expect(validator([""])).toBe(true);
    expect(validator(new Uint16Array())).toBe(false);
    expect(validator("")).toBe(false);
    expect(validator(0)).toBe(false);
  });
  it("should test Symbol.hasInstance", () => {
    const validator = isInstanceOf({
      [Symbol.hasInstance](value: unknown): value is string {
        return typeof value === "string";
      },
    });
    const str: unknown = "";
    if (validator(str)) {
      expect(typeEqual<string, typeof str>(true)).toBe(true);
    }
    expect(validator("")).toBe(true);
    expect(validator(0)).toBe(false);
    expect(validator({})).toBe(false);
  });
});
