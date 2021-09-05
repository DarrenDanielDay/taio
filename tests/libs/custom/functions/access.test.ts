import { access } from "../../../../src/libs/custom/functions/access";

describe("access", () => {
  it("should access property", () => {
    const obj = {
      a: { b: 1, c: [2] },
    } as const;
    expect(access(obj, [])).toBe(obj);
    expect(access(obj, ["a"])).toBe(obj.a);
    expect(access(obj, ["a", "b"])).toBe(obj.a.b);
    expect(access(obj, ["a", "c", "0"])).toBe(obj.a.c[0]);
  });
});
