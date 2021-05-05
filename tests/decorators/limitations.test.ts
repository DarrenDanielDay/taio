import { Sealed } from "../../src/decorators/limitations";

test("inherit sealed class", () => {
  @Sealed
  class Foo {}

  class Bar extends Foo {
    constructor() {
      super();
    }
  }

  expect(() => new Bar()).toThrow(/Invalid operation/);
  expect(() => new Foo()).not.toThrow(/Invalid operation/);
});
