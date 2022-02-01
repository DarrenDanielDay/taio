import { typeEqual } from "../../../../src/utils/typed-function";
import {
  add,
  multiply,
} from "../../../../src/libs/custom/functions/mathematical";

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
