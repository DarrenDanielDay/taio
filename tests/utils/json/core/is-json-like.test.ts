import {
  isJSONLike,
  isPureArray,
  isPureObject,
} from "../../../../src/utils/json/core/is-json-like";

class Foo {
  a = 1;
}
describe("isPureObject", () => {
  it("should test primitive", () => {
    expect(isPureObject(1)).toBe(false);
    expect(isPureObject("a")).toBe(false);
    expect(isPureObject(true)).toBe(false);
    expect(isPureObject(undefined)).toBe(false);
    expect(isPureObject(null)).toBe(false);
    expect(isPureObject(Symbol.iterator)).toBe(false);
    expect(isPureObject(1n)).toBe(false);
  });
  it("should test object literals", () => {
    expect(isPureObject({})).toBe(true);
    expect(isPureObject({ A: 1 })).toBe(true);
    expect(isPureObject({ b: Number })).toBe(true);
  });
  it("should test object with custom prototype", () => {
    expect(isPureObject(new Foo())).toBe(false);
  });
});

describe("isPureArray", () => {
  it("should test common array", () => {
    expect(isPureArray([])).toBe(true);
    expect(isPureArray([1])).toBe(true);
    expect(isPureArray([""])).toBe(true);
    expect(isPureArray([1, 1n])).toBe(true);
  });
  it("should test array with empty values", () => {
    const arr = [1, 1n];
    delete arr[0];
    expect(isPureArray(arr)).toBe(true);
  });
  it("should test array with extra property", () => {
    const arr = [1, 1n];
    Reflect.set(arr, "x", 1);
    expect(isPureArray(arr)).toBe(false);
  });
  it("should test array with non-array prototype", () => {
    const arr = [1];
    Object.setPrototypeOf(arr, null);
    expect(isPureArray(arr)).toBe(false);
  });
});

describe("isJSONLike", () => {
  it("should test primitive", () => {
    expect(isJSONLike(1)).toBe(true);
    expect(isJSONLike("")).toBe(true);
    expect(isJSONLike(123n)).toBe(true);
    expect(isJSONLike(true)).toBe(true);
    expect(isJSONLike(false)).toBe(true);
    expect(isJSONLike(null)).toBe(true);
    expect(isJSONLike(undefined)).toBe(true);
  });

  it("should test array", () => {
    expect(isJSONLike([])).toBe(true);
    expect(isJSONLike([1])).toBe(true);
    expect(isJSONLike(["", 1])).toBe(true);
    expect(isJSONLike(["", 1, 1n])).toBe(false);
    const arr = ["", 1, 1n];
    delete arr[0];
    expect(isJSONLike(arr)).toBe(false);
    delete arr[2];
    expect(isJSONLike(arr)).toBe(true);
  });
  it("should test nested objects", () => {
    expect(isJSONLike({ a: { b: { c: 1, d: ["asd"], e: 1 } } })).toBe(true);
    expect(isJSONLike({ a: { b: { c: 1, d: ["asd"], e: 1n } } })).toBe(false);
    expect(
      isJSONLike({ a: { b: { c: 1, d: ["asdasd"], e: new Foo() } } })
    ).toBe(false);
  });
  it("should not error with circular reference", () => {
    expect(() => {
      const a = {};
      Reflect.set(a, "a", a);
      expect(isJSONLike(a)).toBe(false);
    }).not.toThrow();
  });
  it("should test object with custom prototype", () => {
    expect(isJSONLike(new Foo())).toBe(false);
  });
  it("should test array with custom property", () => {
    expect(isJSONLike(/a/.exec("a"))).toBe(false);
    expect(isJSONLike({ x: /a/.exec("a") })).toBe(false);
  });
});
