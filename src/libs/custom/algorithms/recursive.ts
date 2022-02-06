import type { AnyParams } from "../../../types/array";
import type { Creater, Func, Method } from "../../../types/concepts";
import type { DeepPartial } from "../../../types/object";
import { die } from "../../../utils/internal/exceptions";
import { noop } from "../../../utils/typed-function";
import { argument } from "../functions/argument";

type ProtectedRecursiveParam<T> = [param: T];
type ProtectedRecursiveCaller<T> = Func<
  ProtectedRecursiveParam<T>,
  ProtectedRecursiveRequest<T>
>;

export type RecursiveGenerator<T, R> = Generator<T, R, R>;

export type ProtectedRecursiveGenerator<T, R> = RecursiveGenerator<
  ProtectedRecursiveRequest<T>,
  R
>;

export type RawRecursiveGenerator<P extends AnyParams, R> = RecursiveGenerator<
  P,
  R
>;

export interface CacheMap<K, V> extends Map<K, V> {}

interface ProtectedRecursiveMemoConfig<T, R> {
  cacheParam: boolean;
  cacheFactory: Creater<CacheMap<T, R>>;
}

export interface RecursiveConfig<T, R> {
  maxStack: number;
  memo: ProtectedRecursiveMemoConfig<T, R>;
}

interface ProtectedRecursiveRequest<T> {
  readonly payload: T;
}

interface RawRecursiveThisContext<P extends AnyParams, R> {
  call: Func<P, P>;
  stack: RawRecursiveGenerator<P, R>[];
}
interface ProtectedRecursiveThisContext<T> {
  call: ProtectedRecursiveCaller<T>;
}

interface GeneralRecursiveThisContext<P extends AnyParams> {
  // Not type safe.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call: Func<P, any>;
}

export type RawRecursiveFactory<P extends AnyParams, R> = Method<
  RawRecursiveThisContext<P, R>,
  P,
  RawRecursiveGenerator<P, R>
>;

export type ProtectedRecursiveFactory<T, R> = Method<
  ProtectedRecursiveThisContext<T>,
  ProtectedRecursiveParam<T>,
  ProtectedRecursiveGenerator<T, R>
>;

/**
 * To make factory functions with only one parameter to work with both {@link protectedRecursive} and {@link rawRecursive}, use this type for annotation.
 * It's not completely type safe, so make sure to use `yield this.call(param)` to perform a recursive call.
 */
export type GeneralRecursiveFactory<T, R> = Method<
  GeneralRecursiveThisContext<ProtectedRecursiveParam<T>>,
  ProtectedRecursiveParam<T>,
  // Not type safe.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Generator<any, R, R>
>;

export const rawRecursive = <P extends AnyParams, R>(
  factory: RawRecursiveFactory<P, R>
): Func<P, R> => {
  return (...args) => {
    const stack: RawRecursiveGenerator<P, R>[] = [];
    const ctx: RawRecursiveThisContext<P, R> = {
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
        const nextTterator = stack.at(-1);
        if (!nextTterator) {
          break;
        }
        iterator = nextTterator;
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
    "Cannot yield `call` result more than once when the last `yield` is not done, which may lead to infinite loop."
  );

const uncheckedCall = () =>
  die(
    "Unknown stack frame. Invoke the passed `call` function to create stack frame."
  );

export const protectedRecursive = <T, R>(
  factory: ProtectedRecursiveFactory<T, R>,
  config?: DeepPartial<RecursiveConfig<T, R>>
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
    ProtectedRecursiveRequest<T>,
    StackState | { result: R }
  >();
  return rawRecursive<P, R>(function (value) {
    if (cacheParam && cache.has(value)) {
      return createResult(cache.get(value)!);
    }
    const ctx: ProtectedRecursiveThisContext<T> = {
      call: (payload) => {
        const request: ProtectedRecursiveRequest<T> = Object.freeze({
          payload,
        });
        requestState.set(request, "init");
        return request;
      },
    };
    return function* (
      this: RawRecursiveThisContext<P, R>,
      passedValue: T
    ): RawRecursiveGenerator<P, R> {
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
            return uncheckedCall();
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
