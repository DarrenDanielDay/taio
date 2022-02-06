/* eslint-disable @typescript-eslint/unbound-method */
import {
  CacheMap,
  recursive,
  rawRecursive,
  GeneralRecursiveFactory,
  ProtectedRecursiveFactory,
} from "../../../../src/libs/custom/algorithms/recursive";
import { TypedObject } from "../../../../src/libs/typescript/object";
import type { Mapper } from "../../../../src/types/concepts";

describe("recursive factory", () => {
  type NumRecursiveMappingFactory = GeneralRecursiveFactory<number, number>;
  const fiboFactory: NumRecursiveMappingFactory = function* (n) {
    if (n === 0 || n === 1) {
      return 1;
    }
    const fn2 = yield this.call(n - 2);
    const fn1 = yield this.call(n - 1);
    return fn2 + fn1;
  };
  type FiboTestCase = [number, number];

  const basicFiboCases: FiboTestCase[] = [
    [0, 1],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 5],
    [5, 8],
    [6, 13],
    [7, 21],
    [8, 34],
    [9, 55],
  ];
  const greateCases: FiboTestCase[] = [
    [30, 1346269],
    [50, 20365011074],
  ];
  const testFiboLogic = (
    fiboFn: Mapper<number, number>,
    cases: FiboTestCase[]
  ) => {
    for (const fiboCase of cases) {
      const [n, fiboN] = fiboCase;
      expect(fiboFn(n)).toBe<number>(fiboN);
    }
  };
  const sumNFactory: NumRecursiveMappingFactory = function* (n) {
    if (n === 1) {
      return 1;
    }
    return n + (yield this.call(n - 1));
  };
  const testSumLogic = (sumFn: (n: number) => number, input: number) => {
    const gaussSum = (input * (input + 1)) / 2;
    expect(sumFn(input)).toBe(gaussSum);
  };
  it("should be recursive logic", () => {
    const fibo = recursive(fiboFactory);
    const rawFibo = rawRecursive(fiboFactory);
    testFiboLogic(fibo, basicFiboCases);
    testFiboLogic(rawFibo, basicFiboCases);
  });

  it("should not stack overflow without limit", () => {
    const testN = 2000;
    const sumN = recursive(sumNFactory);
    testSumLogic(sumN, testN);
  });
  it("should throw stack overflow with limit", () => {
    const testN = 2000;
    const sumNGreaterThanMax = recursive(sumNFactory, {
      maxStack: testN - 1,
    });
    const sumNExactMax = recursive(sumNFactory, {
      maxStack: testN,
    });
    const sumNLessThanMax = recursive(sumNFactory, {
      maxStack: testN + 1,
    });
    const noRecursive = recursive(sumNFactory, {
      maxStack: 1,
    });
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
  it("should throw with unchecked frame", () => {
    const fn = recursive<number, number>(function* (n) {
      if (n !== 0) {
        yield {
          payload: 0,
        };
      }
      return 0;
    });
    expect(() => {
      fn(1);
    }).toThrow(/unknown/i);
  });
  it("should throw with invalid operation on call/yield context", () => {
    const muteCtx = recursive<number, number>(function* (n) {
      const ctx = this.call(n - 1);
      Object.assign(ctx, { payload: n + 1 });
      return n;
    });
    expect(() => {
      muteCtx(0);
    }).toThrow();
  });
  it("should use Map to cache", () => {
    const fibo = recursive(fiboFactory, {
      memo: {
        cacheParam: true,
      },
    });
    testFiboLogic(fibo, [[4, 5]]);
    testFiboLogic(fibo, greateCases);
  }, 100);
  it("should use custom map to cache", (done) => {
    const underlayingCache = new Map<number, number>();
    const exclude = ["constructor", "size"] as const;
    const methodKeys = TypedObject.keys(
      TypedObject.getOwnPropertyDescriptors(Map.prototype)
    ).filter((k): k is Exclude<typeof k, typeof exclude[number]> => {
      const key: string = k;
      const keys: readonly string[] = exclude;
      return !keys.includes(key);
    });
    // @ts-expect-error Object.fromentries needs to be better typed
    const cache: CacheMap<number, number> = TypedObject.fromEntries(
      methodKeys.map(
        (key) =>
          // @ts-expect-error Union distribution
          [key, jest.fn(underlayingCache[key].bind(underlayingCache))] as const
      )
    );
    const factory = jest.fn(() => cache);
    const fibo = recursive(fiboFactory, {
      memo: {
        cacheParam: true,
        cacheFactory: factory,
      },
    });
    expect(factory).toBeCalledTimes(1);
    testFiboLogic(fibo, basicFiboCases);
    testFiboLogic(fibo, greateCases);
    testFiboLogic(fibo, greateCases);
    testFiboLogic(fibo, basicFiboCases);
    expect(factory).toBeCalledTimes(1);
    const { set } = cache;
    expect(set).toBeCalledTimes(51);
    done();
  }, 100);
  it("should not infinite loop with tricky cache", () => {
    let ctx: ReturnType<
      ThisParameterType<ProtectedRecursiveFactory<number, number>>["call"]
    > | null = null;
    const fn = recursive<number, number>(function* (n) {
      if (!ctx) {
        ctx = this.call(n - 1);
      }
      yield ctx;
      return n;
    });
    expect(() => {
      fn(1);
    }).toThrow(/infinite loop/i);
  });
  it("should not throw when yield context that are done", () => {
    const fn = recursive<number, number>(function* (n) {
      if (n === 0) {
        return 1;
      }
      const ctx = this.call(n - 1);
      const n1 = yield ctx;
      const n2 = yield ctx;
      return n1 + n2;
    });
    expect(() => {
      fn(1);
    }).not.toThrow();
    expect(fn(1)).toBe(2);
  });
});
