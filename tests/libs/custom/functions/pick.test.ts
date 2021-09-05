import { typeEqual } from "../../../../src/utils/typed-function";
import { pick } from "../../../../src/libs/custom/functions/pick";

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
