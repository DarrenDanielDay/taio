import { ImmutableIterator } from "../../../../../src/libs/custom/data-structure/common/iterator";

describe("immutable iterator", () => {
  it("should throw when directly constructed", () => {
    // @ts-expect-error Directive as type check
    expect(() => new ImmutableIterator()).toThrow(/abstract/);
  });
});
