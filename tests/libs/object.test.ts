import { typeEqual } from "../../src/functions/common";
import { TypedObject } from "../../src/libs/object";

describe("typed object", () => {
  it("should be same logic with apis of Object", () => {
    const foo = {
      a: 1,
      bbb: "b",
    };
    expect(TypedObject.keys(foo)).toEqual(Object.keys(foo));
    expect(TypedObject.values(foo)).toEqual(Object.values(foo));
    expect(TypedObject.entries(foo)).toEqual(Object.entries(foo));
    expect(
      TypedObject.defineProperty(Object.assign({}, foo), "bar", {
        value: { xxx: 444 },
        enumerable: true,
      })
    ).toEqual({ a: 1, bbb: "b", bar: { xxx: 444 } });
    expect(
      TypedObject.defineProperties(Object.assign({}, foo), {
        yyy: { value: 555, enumerable: true },
      })
    ).toEqual({ a: 1, bbb: "b", yyy: 555 });
  });

  it("should have constraints", () => {
    const obj = TypedObject.fromEntries([["a", 1]] as const);
    expect(obj.a).toBe(1);
    expect(obj).toEqual({ a: 1 });
    const obj2 = TypedObject.fromEntries([
      ["a", 1],
      ["b", 2],
    ] as const);
    expect(typeEqual<2, typeof obj2["b"]>(true)).toBe(true);
    expect(typeEqual<{ a: 1; b: 2 }, typeof obj2>(true)).toBe(true);
  });
  it("should merge prototype", () => {
    let proto = { a: 1, b: "b" };
    let created = TypedObject.create(proto, { c: { value: 0n } });
    expect([created.a, created.b, created.c]).toEqual([1, "b", 0n]);
    expect(
      typeEqual<{ a: number; b: string; c: bigint }, typeof created>(true)
    ).toBe(true);
  });
});
