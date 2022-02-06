import type { AnyParams } from "../../../types/array";
import type { Creater, Func, Method } from "../../../types/concepts";
import type { DeepPartial } from "../../../types/object";
import { die } from "../../../utils/internal/exceptions";
import { argument } from "../functions/argument";

type ProtectedRecursiveParam<T> = [param: T];
type ProtectedRecursiveCaller<T> = Func<
  ProtectedRecursiveParam<T>,
  ProtectedRecursiveRequest<T>
>;
export type ProtectedRecursiveGenerator<T, R> = Generator<
  ProtectedRecursiveRequest<T>,
  R,
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

export interface RawRecursiveThisContext<P extends AnyParams> {
  call: Func<P, P>;
}

export type RawRecursiveFactory<P extends AnyParams, R> = Method<
  RawRecursiveThisContext<P>,
  P,
  Generator<P, R, R>
>;

export const rawRecursive = <P extends AnyParams, R>(
  factory: RawRecursiveFactory<P, R>
): Func<P, R> => {
  const ctx: RawRecursiveThisContext<P> = {
    call: argument,
  };
  const invoke = (args: P) => factory.apply(ctx, args);
  return (...args) => {
    // @ts-expect-error Unknown return value
    let returnValue: R = undefined;
    const stack = new Array<Generator<P, R, R>>(invoke(args));
    for (let iterator = stack.at(-1); iterator; iterator = stack.at(-1)) {
      const iteration = iterator.next(returnValue);
      if (iteration.done) {
        stack.pop();
        returnValue = iteration.value;
      } else {
        stack.push(invoke(iteration.value));
      }
    }
    return returnValue;
  };
};

export interface ProtectedRecursiveThisContext<T> {
  call: ProtectedRecursiveCaller<T>;
}
export type ProtectedRecursiveFactory<T, R> = Method<
  ProtectedRecursiveThisContext<T>,
  ProtectedRecursiveParam<T>,
  ProtectedRecursiveGenerator<T, R>
>;

export const protectedRecursive = <T, R>(
  factory: ProtectedRecursiveFactory<T, R>,
  config?: DeepPartial<RecursiveConfig<T, R>>
) => {
  type StackState = "done" | "init" | "pending" | "started";

  interface PreparedStackFrame {
    iterator?: ProtectedRecursiveGenerator<T, R>;
    request: ProtectedRecursiveRequest<T>;
    state: StackState;
    result?: R;
  }
  interface ActiveStackFrame extends PreparedStackFrame {
    iterator: ProtectedRecursiveGenerator<T, R>;
    state: Exclude<StackState, "init">;
  }
  const maxStack = config?.maxStack ?? Infinity;
  const cacheParam = config?.memo?.cacheParam ?? false;
  const cache = cacheParam
    ? (config?.memo?.cacheFactory ?? (() => new Map<T, R>()))()
    : (null as never);

  return (init: T) => {
    const mapRequestToFrame = new Map<
      ProtectedRecursiveRequest<T>,
      PreparedStackFrame
    >();
    const call = (param: T): ProtectedRecursiveRequest<T> => {
      if (stack.length >= maxStack) {
        return die("Stack overflow.");
      }
      const request: ProtectedRecursiveRequest<T> = Object.freeze({
        payload: param,
      });
      const newStackFrame: PreparedStackFrame = {
        request,
        state: "init",
      };
      if (cacheParam) {
        if (cache.has(param)) {
          const cached = cache.get(param)!;
          newStackFrame.iterator = (function* () {
            return cached;
          })();
        }
      }
      mapRequestToFrame.set(request, newStackFrame);
      return request;
    };
    const ctx: ProtectedRecursiveThisContext<T> = {
      call,
    };
    const stack = new Array<ActiveStackFrame>();
    const activateFrame: (
      frame: PreparedStackFrame,
      input: T
    ) => asserts frame is ActiveStackFrame = (frame, input) => {
      frame.iterator = frame.iterator ?? factory.call(ctx, input);
      if (frame.state === "init") {
        frame.state = "pending";
      }
    };
    const invokeFrameWithRequest = (
      request: ProtectedRecursiveRequest<T>
    ): void => {
      const frame = mapRequestToFrame.get(request);
      if (!frame) {
        return die(
          "Unknown stack frame. Invoke the passed `call` function to create stack frame."
        );
      }
      if (frame.state !== "init" && frame.state !== "done") {
        return die(
          "Cannot yield `call` result more than once when the last `yield` is not done, which may lead to infinite loop."
        );
      }
      activateFrame(frame, request.payload);
      stack.push(frame);
    };
    invokeFrameWithRequest(call(init));
    // @ts-expect-error Unknown initial value.
    let returnValue: R = undefined;
    while (!!stack.length) {
      const currentFrame = stack.at(-1)!;
      const { iterator, state } = currentFrame;
      const iteration = ((): IteratorResult<
        ProtectedRecursiveRequest<T>,
        R
      > => {
        switch (state) {
          case "pending":
            const iteration = iterator.next();
            currentFrame.state = "started";
            return iteration;
          case "started":
            return iterator.next(returnValue);
          case "done":
            return {
              done: true,
              value: currentFrame.result!,
            };
        }
      })();
      if (iteration.done) {
        stack.pop();
        currentFrame.state = "done";
        const userResult = iteration.value;
        currentFrame.result = userResult;
        returnValue = userResult;
        if (cacheParam) {
          const param = currentFrame.request.payload;
          if (!cache.has(param)) {
            cache.set(param, userResult);
          }
        }
      } else {
        invokeFrameWithRequest(iteration.value);
      }
    }
    return returnValue;
  };
};

export const recursive = protectedRecursive;
