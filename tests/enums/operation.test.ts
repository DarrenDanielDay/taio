import {
  enumKeys,
  enumValues,
  numberEnumValues,
  stringEnumValues,
} from "../../src/utils/enum";
import { typeEqual } from "../../src/utils/typed-function";

describe("enum", () => {
  enum NumberEnum {
    A = 1,
    B = 2,
    C = 3,
  }
  enum StringEnum {
    A = "a",
    B = "b",
    C = "c",
  }
  enum MixedEnum {
    A = "a",
    B = 0,
    C,
  }
  it("should get enum values from number enum object", () => {
    const values = enumValues(NumberEnum);
    expect(typeEqual<NumberEnum[], typeof values>(true)).toBe(true);
    expect(values).toEqual([1, 2, 3]);
  });
  it("should get enum values from string enum object", () => {
    const values = enumValues(StringEnum);
    expect(typeEqual<StringEnum[], typeof values>(true)).toBe(true);
    expect(values).toEqual(["a", "b", "c"]);
  });
  it("should get enum values from string enum object", () => {
    const values = enumValues<MixedEnum>(MixedEnum);
    expect(typeEqual<MixedEnum[], typeof values>(true)).toBe(true);
    expect(values).toEqual(["a", 0, 1]);
  });
  it("should get number enum values", () => {
    const values = numberEnumValues(MixedEnum);
    expect(
      typeEqual<(MixedEnum.B | MixedEnum.C)[], typeof values>(true)
    ).toEqual(true);
    expect(values).toEqual([0, 1]);
  });
  it("should get string enum values", () => {
    const stringEnum = stringEnumValues(StringEnum);
    expect(typeEqual<StringEnum[], typeof stringEnum>(true)).toBe(true);
    // In a mixed enum, we have to use generic params to infer.
    const values = stringEnumValues<MixedEnum>(MixedEnum);
    expect(typeEqual<MixedEnum.A[], typeof values>(true)).toEqual(true);
    expect(values).toEqual(["a"]);
  });
  it("should get enum names", () => {
    const names = enumKeys(MixedEnum);
    expect(typeEqual<(keyof typeof MixedEnum)[], typeof names>(true)).toEqual(
      true
    );
    expect(names).toEqual(["A", "B", "C"]);
  });
});
