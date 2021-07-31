import { defineValidator } from "../../../src/libs/validator/common";
import { isObject } from "../../../src/libs/validator/object";
import { isNumber, isString } from "../../../src/libs/validator/primitive";
import {
  optional,
  nullable,
  nullishOr,
  stringRecord,
  record,
} from "../../../src/libs/validator/utils";

describe("validator utils", () => {
  describe("nullish group", () => {
    it("should allow optional", () => {
      const validator = defineValidator(
        isObject({
          x: isString,
          y: optional(isString),
        })
      );
      expect(validator({ x: "" })).toBe(true);
      expect(validator({ x: "", y: undefined })).toBe(true);
      expect(validator({ x: "", y: null })).toBe(false);
      expect(validator({ x: "", y: "" })).toBe(true);
      expect(validator({ x: 0, y: "" })).toBe(false);
    });

    it("should allow null", () => {
      const validator = defineValidator(
        isObject({
          x: isString,
          y: nullable(isString),
        })
      );
      expect(validator({ x: "" })).toBe(false);
      expect(validator({ x: "", y: undefined })).toBe(false);
      expect(validator({ x: "", y: null })).toBe(true);
      expect(validator({ x: "", y: "" })).toBe(true);
      expect(validator({ x: 0, y: "" })).toBe(false);
    });
    it("should allow nullish", () => {
      const validator = defineValidator(
        isObject({
          x: isString,
          y: nullishOr(isString),
        })
      );
      expect(validator({ x: "" })).toBe(true);
      expect(validator({ x: "", y: undefined })).toBe(true);
      expect(validator({ x: "", y: null })).toBe(true);
      expect(validator({ x: "", y: "" })).toBe(true);
      expect(validator({ x: 0, y: "" })).toBe(false);
    });
  });

  describe("record group", () => {
    const obj: unknown = {
      a: 1,
      get b() {
        return 2;
      },
      [Symbol.iterator]: 4,
    };
    Object.defineProperty(obj, "c", { value: 3, enumerable: false });
    it("should validate enumerable string properties only", () => {
      const fn = jest.fn((v: unknown) => isNumber(v));
      const validator = stringRecord((v): v is number => fn(v));
      expect(validator(obj)).toBe(true);
      expect(fn).toBeCalledTimes(2);
    });
    it("should validate all string properties", () => {
      const fn = jest.fn((v: unknown) => isNumber(v));
      const validator = stringRecord((v): v is number => fn(v), true);
      expect(validator(obj)).toBe(true);
      expect(fn).toBeCalledTimes(3);
    });
    it("should validate all properties", () => {
      const fn = jest.fn((v: unknown) => isNumber(v));
      const validator = record((v): v is number => fn(v));
      expect(validator(obj)).toBe(true);
      expect(fn).toBeCalledTimes(4);
    });
  });
});
