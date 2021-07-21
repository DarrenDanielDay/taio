import { Freeze, Sealed } from "../../src/decorators/limitations";

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

describe("freeze decorator", () => {
  it("should throw when add method", () => {
    @Freeze
    class Foo {}
    expect(() => {
      Foo.prototype.toString = function () {
        return "<foo object>";
      };
    }).toThrow(TypeError);
  });
});
