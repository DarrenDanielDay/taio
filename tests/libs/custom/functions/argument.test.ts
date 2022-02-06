import { argument } from "../../../../src/libs/custom/functions/argument";

describe("Argument pure function", () => {
  it("should return exactly the params", () => {
    expect(argument(1, "2", 3n)).toStrictEqual([1, "2", 3n]);
  });
});
