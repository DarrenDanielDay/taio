import { Sealed } from "../../src/decorators/limitations";

describe("sealed decorator", () => {
  it("should throw when trying to instantiate subclass", () => {
    @Sealed
    class Foo {}

    class Bar extends Foo {
      constructor() {
        super();
      }
    }

    expect(() => new Bar()).toThrow(/sealed/);
    expect(() => new Foo()).not.toThrow(/sealed/);
  });
});
