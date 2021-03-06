import { fail } from "assert";
import { typeEqual } from "../../../src/utils/typed-function";
import {
  isEnumNameOf,
  isEnumObject,
  isEnumOf,
} from "../../../src/utils/validator/enum";

describe("enum validator", () => {
  enum Enum {
    A = 1,
    B = 2,
  }
  it("should validate enum value", () => {
    const validator = isEnumOf(Enum);
    const test1: unknown = Enum.A;
    if (validator(test1)) {
      expect(typeEqual<Enum.A | Enum.B, typeof test1>(true)).toBe(true);
    } else {
      fail();
    }
  });
  it("should validate enum names", () => {
    const validator = isEnumNameOf(Enum);
    expect(validator("A")).toBe(true);
    expect(validator("B")).toBe(true);
    expect(validator("C")).toBe(false);
    expect(validator(1)).toBe(false);
    expect(validator(2)).toBe(false);
  });
  it("should validate enum objects", () => {
    enum A {}
    enum B {
      X = 1,
    }
    enum C {
      Y = "yyy",
      Z = "Zasd",
    }
    enum Mixed {
      A = 1,
      B = "bbb",
    }
    const fake = { A: 1, B: 2 };
    expect(isEnumObject(A)).toBe(true);
    expect(isEnumObject(B)).toBe(true);
    expect(isEnumObject(C)).toBe(true);
    expect(isEnumObject(Mixed)).toBe(true);
    expect(isEnumObject(fake)).toBe(false);
  });
});
