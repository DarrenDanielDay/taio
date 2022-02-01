import { noop } from "../../src/utils/typed-function";

describe("function noop", () => {
  it("should do nothing", () => {
    expect(noop()).toBeUndefined();
  });
});
