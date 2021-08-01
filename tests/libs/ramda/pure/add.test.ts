import { typeEqual } from "../../../../src/utils/typed-function";
import { add } from "../../../../src/libs/custom/functions/add";

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
