import {
  isBigint,
  isBoolean,
  isNull,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
} from "../../../src/libs/validator/primitive";

describe("Primitive type guards", () => {
  it("should guard primitive", () => {
    const str: unknown = "";
    const num: unknown = 0;
    const bool: unknown = false;
    const undef: unknown = void 0;
    const nil: unknown = null;
    const sym: unknown = Symbol.for("");
    const bigInt: unknown = 0n;
    // Should provide type context
    if (isString(str)) {
      expect(str.split("")).toEqual([]);
    }
    if (isNumber(num)) {
      expect(num.toFixed(2)).toBe("0.00");
    }
    if (isBoolean(bool)) {
      expect(bool.valueOf()).toBe(false);
    }
    if (isUndefined(undef)) {
      expect(undef).toBeUndefined();
    }
    if (isNull(nil)) {
      expect(nil).toBeNull();
    }
    if (isSymbol(sym)) {
      expect(Symbol.keyFor(sym)).toBe("");
    }
    if (isBigint(bigInt)) {
      expect(bigInt.valueOf()).toBe(0n);
    }
  });
});
