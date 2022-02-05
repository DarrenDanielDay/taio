import {
  CloneDeepBuilder,
  SearchCloneDeepPlugin,
  SearchCloneRequest,
  SearchCloneResponse,
  CustomClassCloneDeepPlugin,
  DateCloneDeepPlugin,
  JSONCloneDeepPlugin,
} from "../../../../src/libs/custom/algorithms/search-clone-deep";
import type { CloneDeepFn } from "../../../../src/libs/custom/algorithms/schema";
import type { TypeGuard, Terminator } from "../../../../src/types/concepts";
import { capitalize } from "../../../../src/utils/string";
import { isInstanceOf } from "../../../../src/utils/validator/object";
import { noCheck } from "../../../../src/utils/validator/utils";

interface DeepObject {
  [key: string]: DeepObject;
}
const expectNotSameAndStrictEqual = (cloned: unknown, input: unknown) => {
  expect(cloned).not.toBe(input);
  expect(cloned).toStrictEqual(input);
};
const testCloneDeepLogic = (cloneDeep: CloneDeepFn, input: unknown) => {
  const cloned = cloneDeep(input);
  expectNotSameAndStrictEqual(cloned, input);
};
const testWithCloneDeepFns = (
  fns: CloneDeepFn[],
  callback: (cloneDeep: CloneDeepFn) => void
) => fns.forEach((fn) => callback(fn));
describe("clone deep builder & custom plugin", () => {
  it("should throw with duplicated plugin name", () => {
    expect(() => {
      new CloneDeepBuilder()
        .withPlugin(new JSONCloneDeepPlugin())
        .withPlugin(new JSONCloneDeepPlugin());
    }).toThrow(/duplicate/i);
  });
  it("should throw with invalid plugin created object", () => {
    expect(() => {
      new CloneDeepBuilder()
        .withPlugin({
          name: "invalid create plugin",
          filter: noCheck,
          connectClonedData() {},
          createObject(): object {
            // @ts-expect-error Invalid plugin return type for test
            return 1;
          },
          enumerateDataToClone() {
            return [];
          },
        })
        .build()({});
    }).toThrow(/primitive/);
  });
  it("should throw with plugin exception", () => {
    expect(() => {
      new CloneDeepBuilder()
        .withPlugin({
          name: "plugin with unknown exception",
          filter: noCheck,
          connectClonedData() {},
          createObject() {
            throw 1;
          },
          enumerateDataToClone() {
            return [];
          },
        })
        .build()({});
    }).toThrow(/1/);
  });
  it("should skip by filter", () => {
    class Foo {
      #bar: unknown = 0;
      get bar() {
        return this.#bar;
      }
      setBar(value: unknown) {
        this.#bar = value;
        return this;
      }
      #baz: unknown = 0;
      get baz() {
        return this.#baz;
      }
      setBaz(value: unknown) {
        this.#baz = value;
        return this;
      }
    }
    type Props = "bar" | "baz";
    class FooCloneDeepPlugin implements SearchCloneDeepPlugin<Foo, Props> {
      name = "MyClass clone deep plugin";
      filter: TypeGuard<object, Foo> = isInstanceOf(Foo);
      createObject(_original: Foo, _skip: Terminator): Foo {
        return new Foo();
      }
      enumerateDataToClone(
        original: Foo
      ): SearchCloneRequest<unknown, "bar" | "baz">[] {
        return [
          {
            payload: "bar",
            target: original.bar,
          },
          {
            payload: "baz",
            target: original.baz,
          },
        ];
      }
      connectClonedData(
        newObject: Foo,
        response: SearchCloneResponse<unknown, "bar" | "baz">
      ): void {
        newObject[`set${capitalize(response.payload)}`](response.cloned);
      }
    }
    const bar = { aaa: 111 };
    const baz = { bbb: { ccc: [] } };
    const input = {
      foo: new Foo().setBar(bar).setBaz(baz),
    };
    const cloneDeep = new CloneDeepBuilder()
      .withPlugin(new JSONCloneDeepPlugin())
      .withPlugin(new FooCloneDeepPlugin())
      .build();
    const cloned = cloneDeep(input);
    expectNotSameAndStrictEqual(cloned, input);
    expectNotSameAndStrictEqual(cloned.foo.bar, bar);
    expectNotSameAndStrictEqual(cloned.foo.baz, baz);
  });
});
describe("clone deep with json plugin", () => {
  const cloneDeepWithJSONBFS = new CloneDeepBuilder()
    .withSearch("bfs")
    .withPlugin(new JSONCloneDeepPlugin())
    .build();
  const cloneDeepWithJSONDFS = new CloneDeepBuilder()
    .withSearch("dfs")
    .withPlugin(new JSONCloneDeepPlugin())
    .build();
  const testWithFn = (testCase: (cloneDeep: CloneDeepFn) => void) =>
    testWithCloneDeepFns(
      [cloneDeepWithJSONBFS, cloneDeepWithJSONDFS],
      testCase
    );
  it("should clone json", () => {
    const json = {
      a: {
        b: {
          c: 123,
          d: [
            "eee",
            {
              fff: 777n,
            },
            Symbol.iterator,
            undefined,
            null,
          ],
        },
      },
    };
    testWithFn((cloneDeep) => {
      testCloneDeepLogic(cloneDeep, json);
    });
  });
  it("should not stack overflow", () => {
    const deepObjRoot = {};
    let o: DeepObject = deepObjRoot;
    const count = 2000;
    for (let i = 0; i < count; i++) {
      o["a"] = {};
      o = o["a"];
    }
    testWithFn((cloneDeep: <T>(val: T) => T) => {
      const clonedDeepRoot = cloneDeep(deepObjRoot);
      o = deepObjRoot;
      let clonedO: DeepObject = clonedDeepRoot;
      for (let i = 0; i < count; i++) {
        expect(Object.keys(clonedO)).toStrictEqual(Object.keys(o));
        expect(clonedO).not.toBe(o);
        o = o["a"]!;
        clonedO = clonedO["a"]!;
      }
    });
  });
  it("should deal with circular reference", () => {
    const circular: DeepObject = {};
    circular["circular"] = circular;
    testWithFn((cloneDeep) => {
      testCloneDeepLogic(cloneDeep, circular);
    });
  });
  it("should fail with custom class", () => {
    class MyClass {
      foo = 1;
      get [Symbol.toStringTag]() {
        return MyClass.name;
      }
    }
    testWithFn((cloneDeep) => {
      const instance = new MyClass();
      expect(() => {
        cloneDeep(instance);
      }).toThrow(MyClass.name);
    });
  });
  it("should fail with functions", () => {
    const someFunction = jest.fn;
    testWithFn((cloneDeep) => {
      expect(() => {
        cloneDeep(someFunction);
      }).toThrow(Function.name);
    });
  });
});
describe("clone deep with custom class plugin", () => {
  const cloneDeep = new CloneDeepBuilder()
    .withPlugin(new CustomClassCloneDeepPlugin())
    .build();
  it("should work with custom class", () => {
    class MyClass {
      a = 1;
    }
    const instance = new MyClass();
    const input = { instance };
    const cloned = cloneDeep(input);
    expect(Object.getPrototypeOf(cloned.instance)).toBe(MyClass.prototype);
    testCloneDeepLogic(cloneDeep, input);
  });
});

describe("clone deep with date plugin", () => {
  const cloneDeepWithDatePlugin = new CloneDeepBuilder()
    .withPlugin(new JSONCloneDeepPlugin())
    .withPlugin(new DateCloneDeepPlugin())
    .build();
  class MyDate extends Date {
    get [Symbol.toStringTag]() {
      return MyDate.name;
    }
  }
  it("should only work with native Date", () => {
    expect(() => {
      const obj = {
        a: new MyDate(),
      };
      cloneDeepWithDatePlugin(obj);
    }).toThrow(MyDate.name);
    testCloneDeepLogic(cloneDeepWithDatePlugin, {
      a: { b: 1, c: new Date() },
    });
    const date = new Date();
    const extra = { b: [{ c: 12n }] };
    Reflect.set(date, "a", extra);
    const cloned = cloneDeepWithDatePlugin([date] as const);
    expectNotSameAndStrictEqual(Reflect.get(cloned[0], "a"), extra);
  });
});
