import { snapshot } from "../../src/utils/snapshot";

describe("Snapshot Proxy", () => {
  it("should have access to all propertoes", () => {
    const foo = {
      a: 1,
      b: 2,
      c: [3],
    };
    const fooSnapshot = snapshot(foo);
    expect(fooSnapshot.a).toBe(1);
    const descs = Object.getOwnPropertyDescriptors(fooSnapshot);
    expect(descs.a.value).toBe(1);
    expect(descs.b.value).toBe(2);
    expect(descs.c.value![0]).toBe(3);
    expect("a" in fooSnapshot).toBe(true);
    expect(Object.isExtensible(fooSnapshot)).toBe(true);
    expect(Reflect.ownKeys(fooSnapshot)).toStrictEqual(["a", "b", "c"]);
    const mappedC = [...fooSnapshot.c];
    expect(mappedC[0]).toBe(3);
  });
  it("should prevent any modification", () => {
    const bar = {
      c: Date,
      d: {
        e: {
          f() {
            return 1;
          },
          g: () => 2,
        },
        h: 3,
      },
    };
    const barSnapshot = snapshot(bar);
    expect(() => {
      barSnapshot.d.e.f();
    }).toThrow(/invoke/i);
    expect(() => {
      new barSnapshot.c();
    }).toThrow(/construct/i);
    expect(() => {
      Object.defineProperty(barSnapshot, "x", { value: 1 });
    }).toThrow(/add prop/i);
    expect(() => {
      const deletable: Partial<typeof barSnapshot> = barSnapshot;
      delete deletable.c;
    }).toThrow(/delete prop/i);
    expect(() => {
      Object.getPrototypeOf(barSnapshot);
    }).toThrow(/prototype/i);
    expect(() => {
      Object.preventExtensions(barSnapshot.d);
    }).toThrow(/prevent extension/i);
    expect(() => {
      Object.setPrototypeOf(barSnapshot.d, null);
    }).toThrow(/set proto/);
    expect(() => {
      barSnapshot.d.h = 4;
    }).toThrow(/set prop/);
  });
});
