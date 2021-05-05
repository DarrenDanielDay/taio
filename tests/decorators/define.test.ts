import {
  Accesser,
  WrappedMethod,
  DefineProperty,
} from "../../src/decorators/define";
test("property decorator", () => {
  class Foo {
    @DefineProperty({
      enumerable: true,
      get() {
        return 100;
      },
    })
    prop!: number;
  }
  expect(
    Object.prototype.hasOwnProperty.call(Foo.prototype, "prop")
  ).toBeTruthy();
  expect(
    Object.prototype.propertyIsEnumerable.call(Foo.prototype, "prop")
  ).toBeTruthy();
  const foo = new Foo();
  expect(Foo.prototype.prop).toBe(100);
  expect(foo.prop).toBe(100);
});

test("method decorator", () => {
  const fn1 = jest.fn((a) => a);
  const fn2 = jest.fn();
  class Foo {
    @WrappedMethod<Foo, "fn">(function ({ func, name: methodName, target }, a) {
      fn1.call(undefined, a);
      expect(methodName).toBe("fn");
      expect(target).toBe(Foo.prototype);
      return func.apply(this, [a]);
    })
    fn(a: number) {
      fn2.call(this, a * 2);
    }
  }
  const foo = new Foo();
  foo.fn(1000);
  expect(fn1.mock.calls[0]?.[0]).toBe(1000);
  expect(fn2.mock.calls[0]?.[0]).toBe(2000);
});

test("accesser decorator", () => {
  class Foo {
    @Accesser<Foo, "bar", "get">("get", function ({ func, name, target }) {
      const originalVal = func.apply(this);
      expect(originalVal).toBe(1);
      expect(name).toBe("bar");
      expect(target).toBe(Foo.prototype);
      return this.prop * 2;
    })
    get bar() {
      return 1;
    }
    prop = 3;
  }

  const foo = new Foo();
  expect(foo.bar).toBe(6);
});
