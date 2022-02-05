import { cloneDeep } from "../../../../src/libs/custom/functions/clone-deep";

describe("clone deep", () => {
  it("should clone json", () => {
    class MyClass {
      foo = 1;
    }
    const set = new Set();
    set.add({ setEl: 1 });
    const map = new Map();
    map.set({ mapK: 2 }, { mapV: 3 });
    const input = {
      a: {
        b: {
          c: 123,
          d: ["eee", Symbol.iterator, undefined, null],
          g: new MyClass(),
          h: {
            set,
            map,
          },
        },
      },
    };
    const cloned = cloneDeep(input);
    expect(cloned).toStrictEqual(input);
  });
  it("should skip computed props", () => {
    const o = {
      get a() {
        return 1;
      },
    };
    const cloned = cloneDeep(o);
    expect(cloned).toStrictEqual({});
    expect(cloned.a).toBeUndefined();
  });
});
