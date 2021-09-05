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
  type NumberEnumUnion = NumberEnum.A | NumberEnum.B | NumberEnum.C;
  enum StringEnum {
    A = "a",
    B = "b",
    C = "c",
  }
  type StringEnumUnion = StringEnum.A | StringEnum.B | StringEnum.C;
  enum MixedEnum {
    A = "a",
    B = 0,
    C,
  }
  type MixedEnumUnion = MixedEnum.A | MixedEnum.B | MixedEnum.C;
  it("should get enum values from number enum object", () => {
    const values = enumValues(NumberEnum);
    expect(typeEqual<NumberEnumUnion[], typeof values>(true)).toBe(true);
    expect(values).toEqual([1, 2, 3]);
  });
  it("should get enum values from string enum object", () => {
    const values = enumValues(StringEnum);
    expect(typeEqual<StringEnumUnion[], typeof values>(true)).toBe(true);
    expect(values).toEqual(["a", "b", "c"]);
  });
  it("should get enum values from string enum object", () => {
    const values = enumValues<MixedEnum>(MixedEnum);
    // @ts-expect-error TypeScript issue
    expect(typeEqual<MixedEnumUnion[], typeof values>(true)).toBe(true);
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
    expect(typeEqual<StringEnumUnion[], typeof stringEnum>(true)).toBe(true);
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
