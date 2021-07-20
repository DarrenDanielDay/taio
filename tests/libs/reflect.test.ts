import { TypedReflect } from "../../src/libs/reflect";

describe("TypedReflect", () => {
  it("should with apply constraints", () => {
    function f() {}
    function g(this: number) {}
    const h = (p: { b: string }) => +p.b;
    TypedReflect.apply(f, "", []);
    TypedReflect.apply(f, 1, []);
    // @ts-expect-error
    TypedReflect.apply(f, 1, [1]);
    TypedReflect.apply(g, 1, []);
    TypedReflect.apply(g, 2, []);
    // @ts-expect-error
    TypedReflect.apply(g, "", []);
    const result = TypedReflect.apply(h, undefined, [{ b: "1234" }]);
    expect(result).toBe(1234);
  });
});
