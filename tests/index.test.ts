import { noop } from "../src/utils/typed-function";

describe("First test of Jest with TypeScript", () => {
  it("should be 2", () => {
    noop();
    expect(1 + 1).toBe(2);
  });
});
