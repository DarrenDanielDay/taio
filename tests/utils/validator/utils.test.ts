import { typeEqual } from "../../../src/utils/typed-function";
import { isObject } from "../../../src/utils/validator/object";
import {
  isNumber,
  isString,
  primitiveOf,
  typeofIs,
} from "../../../src/utils/validator/primitive";
import {
  optional,
  nullable,
  nullishOr,
  stringRecord,
  record,
  defineValidator,
  assertThat,
} from "../../../src/utils/validator/utils";
import type { AnyFunc } from "../../../src/types/concepts";
import type { Assertion } from "../../../src/utils/validator/common";

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
    it("should have all typeof", () => {
      const validator = typeofIs("function");
      const fn: unknown = () => 0;
      if (validator(fn)) {
        expect(typeEqual<AnyFunc, typeof fn>(true)).toBe(true);
      } else {
        fail();
      }
    });
    it("should have primitive only", () => {
      const validator = primitiveOf("string");
      // @ts-expect-error Directive as type check
      primitiveOf("function");
      const str: unknown = "a";
      if (validator(str)) {
        expect(typeEqual<string, typeof str>(true)).toBe(true);
      } else {
        fail();
      }
    });
    it("should have type assertion", () => {
      const assertion: Assertion<string> = assertThat(isString);
      const str: unknown = "";
      const num: unknown = 0;
      expect(() => {
        assertion(str);
        expect(typeof str.slice).toBe("function");
      }).not.toThrow();
      expect(() => {
        assertion(num);
      }).toThrow(TypeError);
      const customMessage = "Custom message";
      expect(() => {
        const customAssertion: Assertion<string> = assertThat(
          isNumber,
          customMessage
        );
        customAssertion(str);
      }).toThrow(customMessage);
    });
  });
});
