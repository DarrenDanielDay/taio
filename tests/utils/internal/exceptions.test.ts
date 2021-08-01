import {
  die,
  illegalState,
  invalidOperation,
} from "../../../src/utils/internal/exceptions";

describe("exception wrappers", () => {
  it("should throw when invoked", () => {
    const str = "puiyixculvyao";
    const message = str[~~(Math.random() * str.length)];
    expect(() => die(message)).toThrow(message);
    expect(invalidOperation).toThrow(/Invalid Operation:/);
    expect(illegalState).toThrow(/Illegal State:/);
  });
});
