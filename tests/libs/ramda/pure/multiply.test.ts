import { typeEqual } from "../../../../src/utils/typed-function";
import { multiply } from "../../../../src/libs/custom/functions/multiply";

describe("Multiply pure function", () => {
  it("should be math logic", () => {
    expect(multiply(1, 100)).toBe(100);
    expect(multiply(10, 100)).toBe(1000);
    expect(multiply(11, 11)).toBe(121);
  });

  it("should have constraint", () => {
    let nine = multiply(3, 3);
    expect(typeEqual<9, typeof nine>(true)).toBe(true);
    expect(nine).toBe(9);
  });
});
