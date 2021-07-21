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
    // @ts-expect-error
    if (obj2.b === 3) {
      fail("impossible");
    }
  });
});
