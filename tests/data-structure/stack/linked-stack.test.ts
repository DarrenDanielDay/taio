import { LinkedStack } from "../../../src/data-structure/stack/linked-stack";

describe("linked stack", () => {
  it("brace matcher", () => {
    const mapping = {
      "{": "}",
      "(": ")",
      "<": ">",
      "[": "]",
    };
    function isLeft(str: string): str is keyof typeof mapping {
      return str in mapping;
    }
    function isRight(str: string): str is typeof mapping[keyof typeof mapping] {
      return Object.values(mapping).includes(str);
    }
    function isPair(left: string, right: string) {
      return isLeft(left) && right === mapping[left];
    }
    function match(str: string) {
      const stack = new LinkedStack<string>();
      for (const char of str) {
        if (isLeft(char)) {
          stack.push(char);
        }
        if (isRight(char)) {
          if (stack.size === 0) {
            return false;
          }
          if (!isPair(stack.pop(), char)) {
            return false;
          }
        }
      }
      return stack.size === 0;
    }

    expect(match("")).toBeTruthy();
    expect(match("{}")).toBeTruthy();
    expect(match("{}{}<<>>[]")).toBeTruthy();
    expect(match("{[<>]}<>")).toBeTruthy();
    expect(match("{[<>}]<>")).toBeFalsy();
  });
  it("throws when modify while iteration", () => {
    const stack = new LinkedStack<number>();
    stack.push(1);
    expect(() => {
      for (const number of stack) {
        stack.push(number);
      }
    }).not.toThrow(/iteration/);
    console.log([...stack]);
  });
});
