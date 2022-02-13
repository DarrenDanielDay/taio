import { OrderedMap } from "../../../../../src/libs/custom/data-structure/map/ordered-map";

describe("Ordered Map", () => {
  it("should implement mapping logic", () => {
    interface Obj {
      foo: number;
      bar?: string;
    }
    const orderedMap = new OrderedMap<Obj, boolean>((a, b) => a.foo - b.foo);
    expect(orderedMap.has({ foo: 0 })).toBe(false);
    expect(orderedMap.set({ foo: 0 }, false)).toBe(orderedMap);
    expect(orderedMap.set({ foo: 1 }, true)).toBe(orderedMap);
    expect(orderedMap.set({ foo: 2 }, false)).toBe(orderedMap);
    expect(orderedMap.get({ foo: 1 })).toBe(true);
    expect(orderedMap.get({ foo: 2 })).toBe(false);
    expect(orderedMap.has({ foo: 0 })).toBe(true);
    expect(orderedMap.delete({ foo: 0 })).toBe(true);
    expect(orderedMap.has({ foo: 0 })).toBe(false);
    expect(orderedMap.get({ foo: 0 })).toBe(undefined);
  });
});
