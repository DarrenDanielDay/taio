import type { AnyParams } from "../../../types/array";
import type { Creater, Func, Method } from "../../../types/concepts";
import type { DeepPartial } from "../../../types/object";
import { die } from "../../../utils/internal/exceptions";
import { noop } from "../../../utils/typed-function";
import type { CacheMap } from "../data-structure/interfaces/schema";
import { argument } from "../functions/argument";

type ProtectedRecursiveParam<T> = [param: T];
type ProtectedRecursiveCaller<T> = Func<
  ProtectedRecursiveParam<T>,
  ProtectedRecursiveCallRequest<T>
>;

export type RecursiveCallGenerator<T, R> = Generator<T, R, R>;

export type ProtectedRecursiveCallGenerator<T, R> = RecursiveCallGenerator<
  ProtectedRecursiveCallRequest<T>,
  R
>;

export type RawRecursiveCallGenerator<
  P extends AnyParams,
  R
> = RecursiveCallGenerator<P, R>;

interface ProtectedRecursiveCallMemoConfig<T, R> {
  /**
   * Whether to use cache by parameter.
   * default `false`
   */
  cacheParam: boolean;
  /**
   * The cache factory function.
   * default `() => new Map<T, R>()`
   */
  cacheFactory: Creater<CacheMap<T, R>>;
}

interface RecursiveConfig {
  /**
   * Max recursive stack size. `Infinity` by default.
   */
  maxStack: number;
}

export interface RecursiveCallConfig<T, R> extends RecursiveConfig {
  memo: ProtectedRecursiveCallMemoConfig<T, R>;
}

interface ProtectedRecursiveCallRequest<T> {
  readonly payload: T;
}

interface RawRecursiveCallThisContext<P extends AnyParams, R> {
  call: Func<P, P>;
  /**
   * The internal iterator stack.
   * Don't try to invoke `generator.next()` or modify it, or the stack might be corrupted.
   */
  stack: RawRecursiveCallGenerator<P, R>[];
}
interface ProtectedRecursiveCallThisContext<T> {
  call: ProtectedRecursiveCaller<T>;
}

interface GeneralRecursiveCallThisContext<P extends AnyParams> {
  // Not type safe.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call: Func<P, any>;
}

export type RawRecursiveCallFactory<P extends AnyParams, R> = Method<
  RawRecursiveCallThisContext<P, R>,
  P,
  RawRecursiveCallGenerator<P, R>
>;

export type ProtectedRecursiveCallFactory<T, R> = Method<
  ProtectedRecursiveCallThisContext<T>,
  ProtectedRecursiveParam<T>,
  ProtectedRecursiveCallGenerator<T, R>
>;

/**
 * To make factory functions with only one parameter to work with both {@link protectedRecursive} and {@link rawRecursive}, use this type for annotation.
 * It's not completely type safe, so make sure to use `yield this.call(param)` to perform a recursive call.
 */
export type GeneralRecursiveFactory<T, R> = Method<
  GeneralRecursiveCallThisContext<ProtectedRecursiveParam<T>>,
  ProtectedRecursiveParam<T>,
  // Not type safe.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Generator<any, R, R>
>;

/**
 * Perform a recursive computation without increasing call stack frames as the recursion grow.
 * A Fibonacci sequence example with this API:
 * ```ts
 * // 1. Define a recursive function by call this API like this:
 * const fibo = rawRecursive<[n: number], number>(
 * // 2. Pass a generator function as the parameter
 * function* (n) {
 *   if (n === 0 || n === 1) {
 *     return 1;
 *   }
 *   // 3. Use `yield this.call(...params)` to perform a recursive call
 *   const fn2 = yield this.call(n - 2);
 *   const fn1 = yield this.call(n - 1);
 *   return fn2 + fn1;
 * });
 * // 4. Use the defined recursive function to compute:
 * console.log(fibo(1)) // 1
 * console.log(fibo(2)) // 2
 * console.log(fibo(8)) // 34
 * ```
 * @param factory the factory function which returns a generator
 * @returns sync recursive result
 */
export const rawRecursive = <P extends AnyParams, R>(
  factory: RawRecursiveCallFactory<P, R>
): Func<P, R> => {
  return (...args) => {
    const stack: RawRecursiveCallGenerator<P, R>[] = [];
    const ctx: RawRecursiveCallThisContext<P, R> = {
      call: argument,
      stack,
    };
    const invoke = (args: P) => {
      const iterator = factory.apply(ctx, args);
      const initIteration = iterator.next();
      stack.push(iterator);
      return [iterator, initIteration] as const;
    };
    let [iterator, iteration] = invoke(args);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      if (iteration.done) {
        stack.pop();
        const nextIterator = stack.at(-1);
        if (!nextIterator) {
          break;
        }
        iterator = nextIterator;
        iteration = iterator.next(iteration.value);
      } else {
        [iterator, iteration] = invoke(iteration.value);
      }
    }
    return iteration.value;
  };
};
const stackOverflow = () => die("Stack overflow.");
const circlularFrame = () =>
  die(
    "Cannot yield `this.call` result more than once when the last `yield` is not done, which may lead to infinite loop."
  );

const uncheckedCall = (...codes: string[]) =>
  die(
    `Unknown stack frame. Invoke the passed ${codes
      .map((code) => `\`${code}\``)
      .join(" ")} function to create stack frame.`
  );

/**
 * Same core logic with {@link rawRecursive} but safer than {@link rawRecursive} with extra config.
 * This API calls {@link rawRecursive} internally.
 * The parameter generator function should have **exactly one parameter**.
 * A Fibonacci sequence example with this API:
 * ```ts
 * // 1. Define a recursive function by call this API like this:
 * const fibo = protectedRecursive<number, number>(
 * // 2. Pass a generator function as the parameter.
 * function* (n) {
 *   if (n === 0 || n === 1) {
 *     return 1;
 *   }
 *   // 3. Use `yield this.call(params)` to perform a recursive call
 *   const fn2 = yield this.call(n - 2);
 *   const fn1 = yield this.call(n - 1);
 *   return fn2 + fn1;
 * });
 * // 4. Use the defined recursive function to compute:
 * console.log(fibo(1)) // 1
 * console.log(fibo(2)) // 2
 * console.log(fibo(8)) // 34
 * ```
 * @param factory the factory function which returns a generator
 * @param config the config
 * @returns sync recursive result
 */
export const protectedRecursive = <T, R>(
  factory: ProtectedRecursiveCallFactory<T, R>,
  config?: DeepPartial<RecursiveCallConfig<T, R>>
) => {
  type StackState = "init" | "started";
  const maxStack = config?.maxStack ?? Infinity;
  const cacheParam = config?.memo?.cacheParam ?? false;
  const cache = cacheParam
    ? (config?.memo?.cacheFactory ?? (() => new Map<T, R>()))()
    : (null as never);
  const memorizeIfNeedCache = cacheParam
    ? (param: T, result: R) => {
        if (!cache.has(param)) {
          cache.set(param, result);
        }
      }
    : noop;
  type P = ProtectedRecursiveParam<T>;
  const createResult = (value: R) =>
    (function* () {
      return value;
    })();
  const requestState = new WeakMap<
    ProtectedRecursiveCallRequest<T>,
    StackState | { result: R }
  >();
  return rawRecursive<P, R>(function (value) {
    if (cacheParam && cache.has(value)) {
      return createResult(cache.get(value)!);
    }
    const ctx: ProtectedRecursiveCallThisContext<T> = {
      call: (payload) => {
        const request: ProtectedRecursiveCallRequest<T> = Object.freeze({
          payload,
        });
        requestState.set(request, "init");
        return request;
      },
    };
    return function* (
      this: RawRecursiveCallThisContext<P, R>,
      passedValue: T
    ): RawRecursiveCallGenerator<P, R> {
      if (this.stack.length >= maxStack) {
        return stackOverflow();
      }
      const generator = factory.call(ctx, passedValue);
      let iteration = generator.next();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (true) {
        if (!iteration.done) {
          const request = iteration.value;
          const state = requestState.get(request);
          if (state === undefined) {
            return uncheckedCall("this.call");
          } else if (state === "init") {
            requestState.set(request, "started");
            const param = request.payload;
            const result = yield this.call(param);
            requestState.set(request, { result });
            iteration = generator.next(result);
          } else if (state === "started") {
            return circlularFrame();
          } else {
            iteration = generator.next(state.result);
          }
        } else {
          const result = iteration.value;
          memorizeIfNeedCache(passedValue, result);
          return result;
        }
      }
    }.call(this, value);
  });
};
export const recursive = protectedRecursive;

interface RecursiveGeneratorValueRequest<T> {
  readonly type: "value";
  readonly payload: T;
}

interface RecursiveGeneratorSequenceRequest<P extends AnyParams> {
  readonly type: "seq";
  readonly payload: P;
}

type RecursiveGeneratorRequest<P extends AnyParams, T> =
  | RecursiveGeneratorSequenceRequest<P>
  | RecursiveGeneratorValueRequest<T>;

interface RecursiveGeneratorValueResponse<N> {
  type: "next";
  payload: N;
}

interface RecursiveGeneratorSequenceResponse<R> {
  type: "return";
  payload: R;
}

type RecursiveGeneratorResponse<R, N> =
  | RecursiveGeneratorSequenceResponse<R>
  | RecursiveGeneratorValueResponse<N>;

interface RawRecursiveGeneratorThisContext<
  P extends AnyParams,
  T,
  R = void,
  N = void
> extends ProtectedRecursiveGeneratorThisContext<P, T> {
  stack: RecursiveGenerator<P, T, R, N>[];
}

interface ProtectedRecursiveGeneratorThisContext<P extends AnyParams, T> {
  value: Func<[value: T], RecursiveGeneratorValueRequest<T>>;
  sequence: Func<P, RecursiveGeneratorSequenceRequest<P>>;
}

type RecursiveGenerator<P extends AnyParams, T, R = void, N = void> = Generator<
  RecursiveGeneratorRequest<P, T>,
  R,
  RecursiveGeneratorResponse<R, N>
>;

export type RawRecursiveGeneratorFactory<
  P extends AnyParams,
  T,
  R = void,
  N = void
> = Method<
  RawRecursiveGeneratorThisContext<P, T, R, N>,
  P,
  RecursiveGenerator<P, T, R, N>
>;

export type ProtectedRecursiveGeneratorFactory<
  P extends AnyParams,
  T,
  R = void,
  N = void
> = Method<
  ProtectedRecursiveGeneratorThisContext<P, T>,
  P,
  RecursiveGenerator<P, T, R, N>
>;

export const rawRecursiveGenerator = <
  P extends AnyParams,
  T,
  R = void,
  N = void
>(
  factory: RawRecursiveGeneratorFactory<P, T, R, N>
) => {
  type G = RecursiveGenerator<P, T, R, N>;
  return function* (...args: P): Generator<T, R, N> {
    const stack: G[] = [];
    const ctx: RawRecursiveGeneratorThisContext<P, T, R, N> = {
      value: (value) => ({
        type: "value",
        payload: value,
      }),
      sequence: (...args) => ({
        type: "seq",
        payload: args,
      }),
      stack,
    };
    const invoke = (args: P) => {
      const iterator = factory.apply(ctx, args);
      const initIteration = iterator.next();
      stack.push(iterator);
      return [iterator, initIteration] as const;
    };
    let [iterator, iteration] = invoke(args);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      if (iteration.done) {
        stack.pop();
        const nextIterator = stack.at(-1);
        if (!nextIterator) {
          break;
        }
        iterator = nextIterator;
        iteration = iterator.next({ type: "return", payload: iteration.value });
      } else {
        const request = iteration.value;
        if (request.type === "seq") {
          [iterator, iteration] = invoke(request.payload);
        } else {
          const next = yield request.payload;
          iteration = iterator.next({ type: "next", payload: next });
        }
      }
    }
    return iteration.value;
  };
};

export const protectedRecursiveGenerator = <
  P extends AnyParams,
  T,
  R = void,
  N = void
>(
  factory: ProtectedRecursiveGeneratorFactory<P, T, R, N>,
  config?: Partial<RecursiveConfig>
) => {
  const maxStack = config?.maxStack ?? Infinity;

  return rawRecursiveGenerator<P, T, R, N>(function (...args: P) {
    const trackedRequests = new WeakSet<RecursiveGeneratorRequest<P, T>>();
    const ctx: ProtectedRecursiveGeneratorThisContext<P, T> = {
      value: (value) => {
        const result = this.value(value);
        trackedRequests.add(result);
        Object.freeze(result);
        return result;
      },
      sequence: (...args: P) => {
        const result = this.sequence(...args);
        trackedRequests.add(result);
        Object.freeze(result);
        return result;
      },
    };
    return function* (
      this: RawRecursiveGeneratorThisContext<P, T, R, N>,
      ...passedArgs: P
    ): RecursiveGenerator<P, T, R, N> {
      if (this.stack.length >= maxStack) {
        return stackOverflow();
      }
      const generator = factory.apply(ctx, passedArgs);
      let iteration = generator.next();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (true) {
        if (!iteration.done) {
          const request = iteration.value;
          if (!trackedRequests.has(request)) {
            return uncheckedCall("this.value", "this.sequence");
          }
          iteration = generator.next(yield request);
        } else {
          return iteration.value;
        }
      }
    }.apply(this, args);
  });
};

export const recursiveGenerator = protectedRecursiveGenerator;
