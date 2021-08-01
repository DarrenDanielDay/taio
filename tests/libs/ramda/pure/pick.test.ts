import { typeEqual } from "../../../../src/functions/common";
import { pick } from "../../../../src/libs/ramda/pure/pick";

describe("pick object property by key", () => {
  it("should pick correctly", () => {
    const obj = { a: 1, b: "bbb", [Symbol.iterator]: "ccc" };
    const picked = pick(obj, "a", Symbol.iterator);
    expect(
      typeEqual<{ a: number; [Symbol.iterator]: string }, typeof picked>(true)
    ).toBe(true);
    expect(picked.a).toEqual(1);
    expect(picked[Symbol.iterator]).toEqual("ccc");
  });
});
