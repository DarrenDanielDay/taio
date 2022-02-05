import type { Creater, Func } from "../../../types/concepts";
import type { DeepPartial } from "../../../types/object";
import { die } from "../../../utils/internal/exceptions";

export type RecursiveCaller<T> = Func<[param: T], RecursiveContext<T>>;
export type RecursiveGenerator<T, R> = Generator<RecursiveContext<T>, R, R>;

export interface CacheMap<K, V> extends Map<K, V> {}

interface RecursiveMemoConfig<T, R> {
  cacheParam: boolean;
  cacheFactory: Creater<CacheMap<T, R>>;
}

export interface RecursiveConfig<T, R> {
  maxStack: number;
  memo: RecursiveMemoConfig<T, R>;
}

interface RecursiveContext<T> {
  readonly payload: T;
}

export const recursive = <T, R>(
  factory: Func<
    [call: RecursiveCaller<T>],
    Func<[args: T], RecursiveGenerator<T, R>>
  >,
  config?: DeepPartial<RecursiveConfig<T, R>>
) => {
  type StackState = "done" | "init" | "pending" | "started";

  interface PreparedStackFrame {
    iterator?: RecursiveGenerator<T, R>;
    context: RecursiveContext<T>;
    state: StackState;
    result?: R;
  }
  interface ActiveStackFrame extends PreparedStackFrame {
    iterator: RecursiveGenerator<T, R>;
    state: Exclude<StackState, "init">;
  }
  const maxStack = config?.maxStack ?? Infinity;
  const cacheParam = config?.memo?.cacheParam ?? false;
  const cache = cacheParam
    ? (config?.memo?.cacheFactory ?? (() => new Map<T, R>()))()
    : (null as never);

  return (init: T) => {
    const mapContextToFrame = new Map<
      RecursiveContext<T>,
      PreparedStackFrame
    >();
    const call = (param: T): RecursiveContext<T> => {
      if (stack.length >= maxStack) {
        return die("Stack overflow.");
      }
      const context: RecursiveContext<T> = Object.freeze({
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
    const invokeFrameWithContext = (context: RecursiveContext<T>): void => {
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
      const iteration = ((): IteratorResult<RecursiveContext<T>, R> => {
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
