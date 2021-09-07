import {
  capitalize,
  isNumberString,
  uncapitalize,
} from "../../src/utils/string";
import { typeEqual } from "../../src/utils/typed-function";

describe("string utils", () => {
  it("should capitalize string", () => {
    const textAbc = capitalize("abc");
    expect(textAbc).toBe("Abc");
    expect(capitalize("")).toBe("");
    expect(typeEqual<typeof textAbc, "Abc">(true)).toBe(true);
  });
  it("should uncapitalize string", () => {
    const textbc = uncapitalize("Abc");
    expect(textbc).toBe("abc");
    expect(textbc).toBe("abc");
    expect(typeEqual<typeof textbc, "abc">(true)).toBe(true);
  });
  it("should test number strings", () => {
    expect(isNumberString("")).toBe(false);
    expect(isNumberString("1a")).toBe(false);
    expect(isNumberString("189a")).toBe(false);
    expect(isNumberString("10382918974x")).toBe(false);
    expect(isNumberString("asjkld123")).toBe(false);
    expect(isNumberString("1.3789r698")).toBe(false);
    expect(isNumberString("1.3789698")).toBe(true);
    expect(isNumberString("13789897")).toBe(true);
    expect(isNumberString("13789897e12")).toBe(true);
    expect(isNumberString("13789897e")).toBe(false);
  });
});
