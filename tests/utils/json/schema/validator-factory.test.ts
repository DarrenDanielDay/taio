import type { Nullish } from "../../../../src/types/common";
import type { JSONStringSchema } from "../../../../src/utils/json/interfaces/json-describer";
import { defineSchema } from "../../../../src/utils/json/schema/schema-factory";
import { createValidatorBySchema } from "../../../../src/utils/json/schema/validator-factory";
import { typeEqual } from "../../../../src/utils/typed-function";
import type { Validator } from "../../../../src/utils/validator/common";

describe("createValidatorBySchema", () => {
  it("should throw when passing non-json", () => {
    class StringSchema implements JSONStringSchema {
      readonly type = "string";
    }
    expect(() => {
      const schema = defineSchema(new StringSchema());
      createValidatorBySchema(schema);
    }).toThrow(/Invalid JSON Schema/);
  });
  it("should validate string primitive", () => {
    const schema = defineSchema({
      type: "string",
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<string>>(true)).toBe(true);
    expect(validator("")).toBe(true);
  });
  it("should validate number primitive", () => {
    const schema = defineSchema({
      type: "number",
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<number>>(true)).toBe(true);
    expect(validator(0)).toBe(true);
  });
  it("should validate boolean primitive", () => {
    const schema = defineSchema({
      type: "boolean",
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<boolean>>(true)).toBe(true);
    expect(validator(true)).toBe(true);
    expect(validator(false)).toBe(true);
  });
  it("should validate nullish primitive", () => {
    const schema = defineSchema({
      type: "null",
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<Nullish>>(true)).toBe(true);
    expect(validator(null)).toBe(true);
    expect(validator(undefined)).toBe(true);
  });
  it("should validate literal primitive", () => {
    const schema = defineSchema({
      type: "literal",
      value: "" as const,
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<"">>(true)).toBe(true);
    expect(validator("")).toBe(true);
    expect(validator("a")).toBe(false);
  });
  it("should validate enum", () => {
    enum E {
      A = 1,
      B = 2,
    }
    const schema = defineSchema({
      type: "enum",
      enumObject: E,
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<E.A | E.B>>(true)).toBe(true);
    expect(validator(E.A)).toBe(true);
    expect(validator(E.B)).toBe(true);
    expect(validator(1)).toBe(true);
    expect(validator(2)).toBe(true);
  });
  it("should validate array", () => {
    const schema = defineSchema({
      type: "array",
      item: {
        type: "string",
      },
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<string[]>>(true)).toBe(true);
    expect(validator([])).toBe(true);
    expect(validator(["a"])).toBe(true);
    expect(validator(["a", 1])).toBe(false);
  });
  it("should validate tuple", () => {
    const schema = defineSchema({
      type: "tuple",
      items: [
        {
          type: "string",
        },
      ] as const,
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<[string]>>(true)).toBe(true);
    expect(validator([])).toBe(false);
    expect(validator(["a"])).toBe(true);
    expect(validator(["a", 1])).toBe(false);
  });
  it("should validate object", () => {
    const schema = defineSchema({
      type: "object",
      fields: {
        a: {
          type: "number",
        },
        b: {
          type: "literal",
          value: 0 as const,
        },
      },
    });
    const validator = createValidatorBySchema(schema);
    expect(
      typeEqual<typeof validator, Validator<{ a: number; b: 0 }>>(true)
    ).toBe(true);
    expect(validator([])).toBe(false);
    expect(validator({ a: 1 })).toBe(false);
    expect(validator({ b: 0 })).toBe(false);
    expect(validator({ a: 1, b: 0 })).toBe(true);
    const customArray = [2];
    Reflect.set(customArray, "a", 1);
    Reflect.set(customArray, "b", 0);
    expect(validator(customArray)).toBe(true);
  });
  it("should validate union", () => {
    const schema = defineSchema({
      type: "union",
      unions: [{ type: "string" }, { type: "number" }],
    });
    const validator = createValidatorBySchema(schema);
    expect(typeEqual<typeof validator, Validator<number | string>>(true)).toBe(
      true
    );
    expect(validator(1)).toBe(true);
    expect(validator("1")).toBe(true);
    expect(validator(new String(1))).toBe(false);
  });
});
