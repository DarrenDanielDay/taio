import { currying } from "../../../src/libs/ramda/currying";
import { _$_ } from "../../../src/libs/ramda/placeholder";

describe("Currying", () => {
  it("should be the logic", () => {
    const fn = jest.fn();
    const curried = currying<[number, string, bigint], unknown>(fn, 3);
    const result1 = curried(1, _$_);
    expect(typeof result1).toBe("function");
    const result2 = result1(_$_, 1n);
    result2("");
    expect(fn).toBeCalledWith(1, "", 1n);
  });
  it("should be the logic when passing called many time", () => {
    const fn = jest.fn();
    const curried = currying<[], unknown>(fn, 0);
    curried();
    curried();
    curried();
    curried();
    curried();
    expect(fn).toBeCalledTimes(5);
  });
  it("should use length", () => {
    const fn = (a: number, b: string, c: boolean, d: symbol) =>
      +a + +b + +c + +d.toString();
    expect(
      currying(fn)(_$_)(_$_, _$_, true)(
        _$_,
        _$_,
        Symbol.iterator
      )(1, "2").toString()
    ).toBe(NaN.toString());
  });
  it("should break when have redundant parameters", () => {
    const fn = (a: number, b: string) => `${a}${b}`;
    // @ts-expect-error Error by design for testing behavior of passing arguments more than required
    const params: Parameters<typeof fn> = [1, "2", 3];
    expect(currying(fn, 2)(...params)).toBe("12");
  });
});
