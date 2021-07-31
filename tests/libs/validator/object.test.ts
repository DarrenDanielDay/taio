import { isArrayOf } from "../../../src/libs/validator/array";
import { defineValidator, is } from "../../../src/libs/validator/common";
import { isObject } from "../../../src/libs/validator/object";
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
});
