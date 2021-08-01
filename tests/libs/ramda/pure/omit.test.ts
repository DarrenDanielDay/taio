import { typeEqual } from "../../../../src/functions/common";
import { omit } from "../../../../src/libs/ramda/pure/omit";

describe("pick object property by key", () => {
  it("should pick correctly", () => {
    const obj = { a: 1, b: "bbb", [Symbol.iterator]: "ccc" };
    const omitted = omit(obj, "a", Symbol.iterator);
    expect(typeEqual<{ b: string }, typeof omitted>(true)).toBe(true);
    expect(omitted.b).toEqual("bbb");
    expect(omitted).toEqual({ b: "bbb" });
  });
});
