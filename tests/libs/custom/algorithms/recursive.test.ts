import { recursive } from "../../../../src/libs/custom/algorithms/recursive";

describe("recursive", () => {
  it("should be recursive logic", () => {
    const fibo = recursive<number, number>(
      (call) =>
        function* (n) {
          if (n === 0 || n === 1) {
            return 1;
          }
          const fn2 = yield call(n - 2);
          const fn1 = yield call(n - 1);
          return fn2 + fn1;
        }
    );
    expect(fibo(0)).toBe(1);
    expect(fibo(1)).toBe(1);
    expect(fibo(2)).toBe(2);
    expect(fibo(3)).toBe(3);
    expect(fibo(4)).toBe(5);
    expect(fibo(5)).toBe(8);
    expect(fibo(6)).toBe(13);
    expect(fibo(7)).toBe(21);
    expect(fibo(8)).toBe(34);
  });
  const sumNFactory = (
    call: (param: number) => number
  ): ((n: number) => Generator<number, number, number>) =>
    function* (n) {
      if (n === 1) {
        return 1;
      }
      return n + (yield call(n - 1));
    };
  const testSumLogic = (sumFn: (n: number) => number, input: number) => {
    const gaussSum = (input * (input + 1)) / 2;
    expect(sumFn(input)).toBe(gaussSum);
  };
  it("should not stack overflow without limit", () => {
    const testN = 2000;
    const sumN = recursive<number, number>(sumNFactory);
    testSumLogic(sumN, testN);
  });
  it("should throw stack overflow with limit", () => {
    const testN = 2000;
    const sumNGreaterThanMax = recursive<number, number>(
      sumNFactory,
      testN - 1
    );
    const sumNExactMax = recursive(sumNFactory, testN);
    const sumNLessThanMax = recursive(sumNFactory, testN + 1);
    const noRecursive = recursive(sumNFactory, 1);
    expect(() => {
      testSumLogic(sumNLessThanMax, testN);
    }).not.toThrow();
    expect(() => {
      testSumLogic(sumNExactMax, testN);
    }).not.toThrow();
    const stackOverflow = /stack overflow/i;
    expect(() => {
      testSumLogic(sumNGreaterThanMax, testN);
    }).toThrow(stackOverflow);
    expect(() => {
      testSumLogic(noRecursive, 1);
    }).not.toThrow();
    expect(() => {
      testSumLogic(noRecursive, 2);
    }).toThrow(stackOverflow);
  });
});
