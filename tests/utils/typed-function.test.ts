import { noop, typed } from "../../src/utils/typed-function";

describe("function typed", () => {
  it("should do nothing", () => {
    const symbol = Symbol();
    expect(typed<symbol>(symbol)).toBe(symbol);
  });
});

describe("function noop", () => {
  it("should do nothing", () => {
    expect(noop()).toBeUndefined();
  });
});
