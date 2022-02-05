import { die } from "../../../utils/internal/exceptions";

export const recursive = <T, R>(
  factory: (call: (param: T) => T) => (args: T) => Generator<T, R, R>,
  maxStack = Infinity
) => {
  return (init: T) => {
    const call = (param: T): T => {
      if (stack.length >= maxStack) {
        die("Stack overflow.");
      }
      return param;
    };
    type Next = [] | [R];
    interface StackFrame {
      iterator: Generator<T, R, R>;
      param: T;
      started: boolean;
    }
    const stack = new Array<StackFrame>();
    const createStackFrame = (param: T) => {
      stack.push({
        iterator: factory(call)(param),
        param,
        started: false,
      });
    };
    createStackFrame(init);
    let returnValue: Next = [];
    while (!!stack.length) {
      const currentFrame = stack.at(-1)!;
      const { iterator, started } = currentFrame;
      const iteration = iterator.next(...(started ? returnValue : []));
      if (!started) {
        currentFrame.started = true;
      }
      if (iteration.done) {
        stack.pop();
        returnValue = [iteration.value];
      } else {
        createStackFrame(iteration.value);
      }
    }
    return returnValue[0]!;
  };
};
