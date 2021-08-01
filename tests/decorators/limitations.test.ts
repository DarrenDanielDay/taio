import { Freeze, Sealed } from "../../src/utils/decorators/limitations";

describe("sealed decorator", () => {
  it("should throw when trying to instantiate subclass", () => {
    @Sealed
    class Foo {
      bar = 1;
    }

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
    class Foo {
      bar = 1;
    }
    expect(() => {
      Foo.prototype.toString = function () {
        return "<foo object>";
      };
    }).toThrow(TypeError);
  });
});
