import type { Add, BinaryToCount, Multiply } from "../../src/types/number";
import { typeEqual } from "../../src/utils/typed-function";

describe("Number types", () => {
  it("should be constraint", () => {
    const three: Add<1, 2> = 3;
    const thirteen: Add<11, 2> = 13;
    const maxIs9999: Add<1999, 8000> = 9999;
    const minusTwo: Add<1, -3> = -2;
    const minusFour: Add<-1, -3> = -4;
    const two: Add<-1, 3> = 2;
    const six: Multiply<2, 3> = 6;
    type Twelve = BinaryToCount<"1100">["length"];
    expect(typeEqual<Twelve, 12>(true)).toBe(true);
    expect(three).toBe(3);
    expect(thirteen).toBe(13);
    expect(maxIs9999).toBe(9999);
    expect(minusTwo).toBe(-2);
    expect(minusFour).toBe(-4);
    expect(two).toBe(2);
    expect(six).toBe(6);
  });
});
