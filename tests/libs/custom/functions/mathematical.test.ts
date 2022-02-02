import { typeEqual } from "../../../../src/utils/typed-function";
import {
  opposite,
  add,
  substract,
  increase,
  multiply,
  inverse,
  bitAnd,
  bitOr,
  bitXOr,
  decrease,
  divide,
  mod,
} from "../../../../src/libs/custom/functions/mathematical";

describe("`opposite` pure function", () => {
  it("should be math logic", () => {
    const minusThree = opposite(3);
    expect(typeEqual<-3, typeof minusThree>(true)).toBe(true);
    expect(minusThree).toBe(-3);
  });
});
describe("`inverse` pure function", () => {
  it("should be math logic", () => {
    const minusFour = inverse(3);
    expect(typeEqual<-4, typeof minusFour>(true)).toBe(true);
    expect(minusFour).toBe(-4);
  });
});
describe("`add` pure function", () => {
  it("should be math logic", () => {
    expect(add(1, 2)).toBe(3);
    expect(add(1, 100)).toBe(101);
  });
  it("should have constraint", () => {
    const three = add(1, 2);
    expect(typeEqual<3, typeof three>(true)).toBe(true);
    expect(three).toBe(3);
  });
});
describe("`bitAnd` pure function", () => {
  it("should be math logic", () => {
    expect(bitAnd(1, 2)).toBe(0);
    expect(bitAnd(2, 7)).toBe(2);
  });
  it("should have constraint", () => {
    const two = bitAnd(7, 2);
    expect(typeEqual<2, typeof two>(true)).toBe(true);
    expect(two).toBe(2);
  });
});
describe("`bitOr` pure function", () => {
  it("should be math logic", () => {
    expect(bitOr(1, 2)).toBe(3);
    expect(bitOr(1, 100)).toBe(101);
  });
  it("should have constraint", () => {
    const three = bitOr(1, 2);
    expect(typeEqual<3, typeof three>(true)).toBe(true);
    expect(three).toBe(3);
  });
});
describe("`bitXOr` pure function", () => {
  it("should be math logic", () => {
    expect(bitXOr(1, 2)).toBe(3);
    expect(bitXOr(1, 100)).toBe(101);
  });
  it("should have constraint", () => {
    const three = bitXOr(1, 2);
    expect(typeEqual<3, typeof three>(true)).toBe(true);
    expect(three).toBe(3);
  });
});
describe("`substract` pure function", () => {
  it("should be math logic", () => {
    expect(add(1, 2)).toBe(3);
    expect(add(1, 100)).toBe(101);
  });
  it("should have constraint", () => {
    const minusOne = substract(1, 2);
    expect(typeEqual<-1, typeof minusOne>(true)).toBe(true);
    expect(minusOne).toBe(-1);
  });
});
describe("`increase` pure function", () => {
  it("should be math logic", () => {
    expect(increase(1)).toBe(2);
    expect(increase(-1)).toBe(0);
  });
});
describe("`decrease` pure function", () => {
  it("should be math logic", () => {
    expect(decrease(1)).toBe(0);
    expect(decrease(-1)).toBe(-2);
  });
});

describe("`multiply` pure function", () => {
  it("should be math logic", () => {
    expect(multiply(1, 100)).toBe(100);
    expect(multiply(10, 100)).toBe(1000);
    expect(multiply(11, 11)).toBe(121);
  });

  it("should have constraint", () => {
    const nine = multiply(3, 3);
    expect(typeEqual<9, typeof nine>(true)).toBe(true);
    expect(nine).toBe(9);
  });
});
describe("`divide` pure function", () => {
  it("should be math logic", () => {
    expect(divide(1, 2)).toBe(0);
    expect(divide(7, 3)).toBe(2);
  });
});
describe("`mod` pure function", () => {
  it("should be math logic", () => {
    expect(mod(1, 2)).toBe(1);
    expect(mod(7, 3)).toBe(1);
  });
});
