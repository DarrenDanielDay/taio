import { identity } from "../../../../src/libs/ramda/pure/identity";

describe("Identity pure function", () => {
  it("should be same input", () => {
    const obj = Symbol();
    expect(identity(obj)).toBe(obj);
  });
});
