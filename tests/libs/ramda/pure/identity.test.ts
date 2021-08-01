import { identity } from "../../../../src/libs/custom/functions/identity";

describe("Identity pure function", () => {
  it("should be same input", () => {
    const obj = Symbol();
    expect(identity(obj)).toBe(obj);
  });
});
