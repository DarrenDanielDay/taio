import { multiply } from "../../../../src/libs/ramda/pure/multiply";

describe("Multiply pure function", () => {
  it("should be math logic", () => {
    expect(multiply(1, 100)).toBe(100);
    expect(multiply(10, 100)).toBe(1000);
    expect(multiply(11, 11)).toBe(121);
  });

  it("should have constraint", () => {
    let nine = multiply(3, 3);
    // @ts-expect-error
    !!nine && (nine = 0);
    nine = multiply(3, 3);
    expect(nine).toBe(9);
  });
});
