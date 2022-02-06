import type { AnyParams } from "../../../types/array";
import type { Creater, Func, Mapper } from "../../../types/concepts";
import type { DeepPartial } from "../../../types/object";
import { die } from "../../../utils/internal/exceptions";
import { argument } from "../functions/argument";

export type ProtectedRecursiveCaller<T> = Func<
  [param: T],
  ProtectedRecursiveContext<T>
>;
export type ProtectedRecursiveGenerator<T, R> = Generator<
  ProtectedRecursiveContext<T>,
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

interface ProtectedRecursiveContext<T> {
  readonly payload: T;
}

export interface RawRecursiveContext<P extends AnyParams> {
  call: Func<P, P>;
}

export const rawRecursive = <P extends AnyParams, R>(
  factory: (this: RawRecursiveContext<P>, ...args: P) => Generator<P, R, R>
): Func<P, R> => {
  const ctx: RawRecursiveContext<P> = {
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

export type ProtectedRecursiveFactory<T, R> = Func<
  [call: ProtectedRecursiveCaller<T>],
  Func<[args: T], ProtectedRecursiveGenerator<T, R>>
>;

export const protectedRecursive = <T, R>(
  factory: ProtectedRecursiveFactory<T, R>,
  config?: DeepPartial<RecursiveConfig<T, R>>
) => {
  type StackState = "done" | "init" | "pending" | "started";

  interface PreparedStackFrame {
    iterator?: ProtectedRecursiveGenerator<T, R>;
    context: ProtectedRecursiveContext<T>;
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
    const mapContextToFrame = new Map<
      ProtectedRecursiveContext<T>,
      PreparedStackFrame
    >();
    const call = (param: T): ProtectedRecursiveContext<T> => {
      if (stack.length >= maxStack) {
        return die("Stack overflow.");
      }
      const context: ProtectedRecursiveContext<T> = Object.freeze({
        payload: param,
      });
      const newStackFrame: PreparedStackFrame = {
        context,
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
      mapContextToFrame.set(context, newStackFrame);
      return context;
    };

    const stack = new Array<ActiveStackFrame>();
    const activateFrame: (
      frame: PreparedStackFrame,
      input: T
    ) => asserts frame is ActiveStackFrame = (frame, input) => {
      frame.iterator = frame.iterator ?? factory(call)(input);
      if (frame.state === "init") {
        frame.state = "pending";
      }
    };
    const invokeFrameWithContext = (
      context: ProtectedRecursiveContext<T>
    ): void => {
      const frame = mapContextToFrame.get(context);
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
      activateFrame(frame, context.payload);

      stack.push(frame);
    };
    invokeFrameWithContext(call(init));
    // @ts-expect-error Unknown initial value.
    let returnValue: R = undefined;
    while (!!stack.length) {
      const currentFrame = stack.at(-1)!;
      const { iterator, state } = currentFrame;
      const iteration = ((): IteratorResult<
        ProtectedRecursiveContext<T>,
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
          const param = currentFrame.context.payload;
          if (!cache.has(param)) {
            cache.set(param, userResult);
          }
        }
      } else {
        const yieldContext = iteration.value;
        invokeFrameWithContext(yieldContext);
      }
    }
    return returnValue;
  };
};

export const recursive = protectedRecursive;

export const composeProtectedFactory = <T, R>(
  factory: ProtectedRecursiveFactory<T, R>
): Mapper<T, R> => {
  return rawRecursive<[source: T], R>(function* (source) {
    const iterator = factory((payload) => {
      return {
        payload,
      };
    })(source);
    let iteration = iterator.next();
    while (!iteration.done) {
      const returnValue = yield this.call(iteration.value.payload);
      iteration = iterator.next(returnValue);
    }
    return iteration.value;
  });
};
