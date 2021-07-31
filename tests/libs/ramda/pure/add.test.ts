import { typeEqual } from "../../../../src/functions/common";
import { add } from "../../../../src/libs/ramda/pure/add";

describe("Add pure function", () => {
  it("should be math logic", () => {
    expect(add(1, 2)).toBe(3);
    expect(add(1, 100)).toBe(101);
  });
  it("should have constraint", () => {
    let three = add(1, 2);
    expect(typeEqual<3, typeof three>(true)).toBe(true);
    expect(three).toBe(3);
  });
});
