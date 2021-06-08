import { noop } from "../src/functions/common";

test("First test of Jest with TypeScript", () => {
  noop();
  expect(1 + 1).toBe(2);
});
