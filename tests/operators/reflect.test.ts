import { trackExpression } from "../../src/operators/reflect";

describe("operators reflect invoker", () => {
  it("should proxy all access", () => {
    const expr = (foo: {
      a: { b: { c(arg: string): { d: number } } };
    }): number => foo.a.b.c("").d;
    const tracks = trackExpression(expr);
    expect(tracks.map((track) => track.type)).toEqual([
      "get",
      "get",
      "get",
      "apply",
      "get",
    ]);
  });

  it("should proxy construct", () => {
    const expr = (foo: { bar: { baz: typeof Array } }) =>
      new foo.bar.baz()
        .map((v) => +v)
        .map((v) => v.toFixed())
        .join("").length;
    const tracks = trackExpression(expr);
    expect(tracks.map((track) => track.type)).toEqual([
      "get",
      "get",
      "get",
      "construct",
      "get",
      "apply",
      "get",
      "apply",
      "get",
      "apply",
      "get",
    ]);
  });
});
