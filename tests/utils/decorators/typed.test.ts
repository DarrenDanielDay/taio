import { parameter } from "../../../src/utils/decorators/typed";

describe("typed decorators", () => {
  it("should decorate parameters", () => {
    class Foo {
      bar(
        @parameter<Foo, "bar", 0>((target, key, index) => {
          expect(target).toBe(Foo.prototype);
          expect(key).toBe("bar");
          expect(index).toBe(0);
        })
        a: number
      ) {
        return a;
      }
    }
    expect(new Foo().bar(2)).toBe(2);
  });
});
