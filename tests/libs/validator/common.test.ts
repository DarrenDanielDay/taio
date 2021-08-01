import { is } from "../../../src/libs/validator/utils";

describe("identity validator", () => {
  it("should only true when same object", () => {
    const o = {};
    expect(is(o)(o)).toBe(true);
    expect(is(o)({})).toBe(false);
  });
});
