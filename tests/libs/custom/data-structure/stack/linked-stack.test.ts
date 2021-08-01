import { LinkedStack } from "../../../../../src/libs/custom/data-structure/stack/linked-stack";

describe("linked stack", () => {
  it("example: brace matcher", () => {
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
  it("should return top element", () => {
    const stack = new LinkedStack<string>();
    stack.push("asodyi");
    stack.push("xaso");
    expect(stack.top).toBe("xaso");
  });
  it("should always return top element", () => {
    const stack = new LinkedStack<number>();
    stack.push(Math.random());
    stack.push(Math.random());
    stack.push(Math.random());
    expect(stack.top).toBe(stack.pop());
    expect(stack.top).toBe(stack.pop());
    expect(stack.top).toBe(stack.pop());
  });

  it("throws when modify while iteration", () => {
    const stack = new LinkedStack<number>();
    stack.push(1);
    expect(() => {
      for (const number of stack) {
        stack.push(number);
      }
    }).toThrow(/iteration/);
  });
  it("should be cleared when call clear()", () => {
    const stack = new LinkedStack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    expect(stack.size).toBe(4);
    stack.clear();
    expect(stack.size).toBe(0);
  });
  it("should clone the stack when call clone()", () => {
    const stack = new LinkedStack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    const cloned = stack.clone();
    expect(cloned).not.toBe(stack);
    expect(cloned.pop()).toBe(stack.pop());
    expect(cloned.pop()).toBe(stack.pop());
    expect(cloned.pop()).toBe(stack.pop());
    expect(cloned.pop()).toBe(stack.pop());
  });
  describe("empty stack", () => {
    it("throws when call pop", () => {
      expect(() => {
        new LinkedStack<number>().pop();
      }).toThrow(/Stack.*empty/);
    });
    it("throws when read top", () => {
      expect(() => new LinkedStack<number>().top).toThrow(/Stack.*empty/);
    });
  });
});
