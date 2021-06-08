import type { Add } from "../../src/types/number";

describe("Number types", () => {
  it("should be constraint", () => {
    const three: Add<1, 2> = 3;
    const thirteen: Add<11, 2> = 13;
    const maxIs9999: Add<1999, 8000> = 9999;
    // @ts-expect-error
    const overflow: Add<9999, 1> = 10000;
    expect(three).toBe(3);
    expect(thirteen).toBe(13);
    expect(maxIs9999).toBe(9999);
    expect(overflow).toBe(10000);
  });
});
