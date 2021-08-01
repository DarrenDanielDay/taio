import { TypedReflect } from "../../src/libs/typescript/reflect";
import {
  createPureTrackerProxyHandler,
  Operation,
  trackExpression,
} from "../../src/libs/custom/operators/reflect";
import type { ConstructorOf, Func } from "../../src/types/concepts";

const mapToType = (track: Operation) => track.type;
describe("pure proxy tracker handler", () => {
  it("should track object operation with same logic", () => {
    const obj = {};
    const track: Operation[] = [];
    const handler = createPureTrackerProxyHandler(track);
    const proxy = new Proxy(obj, handler);
    TypedReflect.defineProperty(proxy, "a", { value: 1, writable: true });
    TypedReflect.set(proxy, "a", 2);
    expect(TypedReflect.get(proxy, "a")).toBe(2);
    TypedReflect.setPrototypeOf(proxy, { x: 1 });
    expect(TypedReflect.getPrototypeOf(proxy)).toEqual({ x: 1 });
    expect(track.map(mapToType)).toEqual<Operation["type"][]>([
      "defineProperty",
      "getOwnPropertyDescriptor",
      "defineProperty",
      "set",
      "get",
      "setPrototypeOf",
      "getPrototypeOf",
    ]);
  });

  it("should track function operation with same logic", () => {
    const ctor = jest.fn((n: number) => ({ a: n * 2 }));
    const track: Operation[] = [];
    const proxy1 = new Proxy<typeof ctor>(
      ctor,
      createPureTrackerProxyHandler(track)
    );
    const constructed = TypedReflect.construct(proxy1, [1]);
    expect(constructed.a).toBe(2);
    expect(track.map(mapToType)).toEqual<Operation["type"][]>([
      "get",
      "construct",
    ]);
    expect(ctor).toBeCalledTimes(1);
    expect(ctor).toBeCalledWith(1);
    const fn = jest.fn((n: number) => ({ b: n + 1 }));
    const track2: Operation[] = [];
    const proxy2 = new Proxy<typeof fn>(
      fn,
      createPureTrackerProxyHandler(track2)
    );
    const result = proxy2(0);
    expect(result.b).toBe(1);
    expect(track2.map(mapToType)).toEqual<Operation["type"][]>(["apply"]);
  });
});

describe("expression analyser", () => {
  it("should proxy all access", () => {
    const expr = (foo: {
      a: { b: { c(arg: string): { d: number } } };
    }): number => foo.a.b.c("").d;
    const tracks = trackExpression(expr);
    expect(tracks.map(mapToType)).toEqual([
      "get",
      "get",
      "get",
      "apply",
      "get",
    ]);
  });

  it("should proxy construct", () => {
    const expr = (foo: { bar: { baz: typeof Array } }) =>
      new foo.bar.baz()
        .map((v) => +v)
        .map((v) => v.toFixed())
        .join("").length;
    const tracks = trackExpression(expr);
    expect(tracks.map(mapToType)).toEqual([
      "get",
      "get",
      "get",
      "construct",
      "get",
      "apply",
      "get",
      "apply",
      "get",
      "apply",
      "get",
    ]);
  });

  describe("apply", () => {
    const result: Operation["type"][] = ["apply"];
    it("should track fn()", () => {
      expect(
        trackExpression((fn: Func<[], void>) => fn()).map(mapToType)
      ).toEqual(result);
    });
    it("should track Reflect.apply", () => {
      expect(
        trackExpression((fn: Func<[], void>) =>
          Reflect.apply(fn, undefined, [])
        ).map(mapToType)
      ).toEqual(result);
    });
  });

  describe("construct", () => {
    const result: Operation["type"][] = ["get", "construct"];
    it("should track Reflect.construct", () => {
      expect(
        trackExpression((ctor: ConstructorOf<object, []>) =>
          Reflect.construct(ctor, [])
        ).map(mapToType)
      ).toEqual(result);
    });
    it("should track new operator", () => {
      expect(
        trackExpression((ctor: ConstructorOf<object, []>) => new ctor()).map(
          mapToType
        )
      ).toEqual(result);
    });
  });
  describe("defineProperty", () => {
    const result: Operation["type"][] = ["defineProperty"];
    it("should track Reflect.defineProperty", () => {
      expect(
        trackExpression((obj: object) =>
          Reflect.defineProperty(obj, "", {})
        ).map(mapToType)
      ).toEqual(result);
    });
    it("should track Object.defineProperty", () => {
      expect(
        trackExpression((obj: object) =>
          Object.defineProperty(obj, "", {})
        ).map(mapToType)
      ).toEqual(result);
    });
    it("should track Object.defineProperties", () => {
      expect(
        trackExpression((obj: object) =>
          Object.defineProperties(obj, {
            a: {},
            b: {},
          })
        ).map(mapToType)
      ).toEqual([...result, ...result]);
    });
  });
  describe("deleteProperty", () => {
    const result: Operation["type"][] = ["deleteProperty"];
    it("should track Reflect.deleteProperty", () => {
      expect(
        trackExpression((obj: object) => Reflect.deleteProperty(obj, "")).map(
          mapToType
        )
      ).toEqual(result);
    });
    it("should track delete operator", () => {
      expect(
        trackExpression((obj: Record<string, unknown>) => delete obj[""]).map(
          mapToType
        )
      ).toEqual(result);
    });
  });

  describe("get", () => {
    const result: Operation["type"][] = ["get"];
    it("should track Reflect.get", () => {
      expect(
        trackExpression((obj: object) => Reflect.get(obj, "")).map(mapToType)
      ).toEqual(result);
    });
    it("should track index member access", () => {
      expect(
        trackExpression((obj: { a: unknown }) => obj.a).map(mapToType)
      ).toEqual(result);
    });
    it("should track index member access", () => {
      expect(
        trackExpression((obj: Record<string, unknown>) => obj["a"]).map(
          mapToType
        )
      ).toEqual(result);
    });
  });
  describe("getOwnPropertyDescriptor", () => {
    const result: Operation["type"][] = ["getOwnPropertyDescriptor"];
    it("should track Reflect.getOwnPropertyDescriptor", () => {
      expect(
        trackExpression((obj: object) =>
          Reflect.getOwnPropertyDescriptor(obj, "")
        ).map(mapToType)
      ).toEqual(result);
    });
    it("should track Object.getOwnPropertyDescriptor", () => {
      expect(
        trackExpression((obj: object) =>
          Object.getOwnPropertyDescriptor(obj, "")
        ).map(mapToType)
      ).toEqual(result);
    });
  });
  describe("getPrototypeOf", () => {
    const result: Operation["type"][] = ["getPrototypeOf"];
    it("should track Reflect.getPrototypeOf", () => {
      expect(
        trackExpression((obj: object) => Reflect.getPrototypeOf(obj)).map(
          mapToType
        )
      ).toEqual(result);
    });
    it("should track Object.getPrototypeOf", () => {
      expect(
        trackExpression((obj: object) => Object.getPrototypeOf(obj)).map(
          mapToType
        )
      ).toEqual(result);
    });
  });
  describe("has", () => {
    const result: Operation["type"][] = ["has"];
    it("should track Reflect.has", () => {
      expect(
        trackExpression((obj: object) => Reflect.has(obj, "")).map(mapToType)
      ).toEqual(result);
    });
    it("should track in operator", () => {
      expect(
        trackExpression((obj: Record<string, unknown>) => "" in obj).map(
          mapToType
        )
      ).toEqual(result);
    });
  });
  describe("isExtensible", () => {
    const result: Operation["type"][] = ["isExtensible"];
    it("should track Reflect.isExtensible", () => {
      expect(
        trackExpression((obj: object) => Reflect.isExtensible(obj)).map(
          mapToType
        )
      ).toEqual(result);
    });
    it("should track Object.isExtensible", () => {
      expect(
        trackExpression((obj: object) => Object.isExtensible(obj)).map(
          mapToType
        )
      ).toEqual(result);
    });
  });
  describe("ownKeys", () => {
    const result: Operation["type"][] = ["ownKeys"];
    it("should track Reflect.ownKeys", () => {
      expect(
        trackExpression((obj: object) => Reflect.ownKeys(obj)).map(mapToType)
      ).toEqual(result);
    });
    it("should track Object.ownKeys", () => {
      expect(
        trackExpression((obj: object) => Object.keys(obj))
          .map(mapToType)
          .includes("ownKeys")
      ).toBeTruthy();
    });
  });
  describe("preventExtensions", () => {
    const result: Operation["type"][] = ["preventExtensions"];
    it("should track Reflect.preventExtensions", () => {
      expect(
        trackExpression((obj: object) => Reflect.preventExtensions(obj)).map(
          mapToType
        )
      ).toEqual(result);
    });
    it("should track Object.preventExtensions", () => {
      expect(
        trackExpression((obj: object) => Object.preventExtensions(obj)).map(
          mapToType
        )
      ).toEqual(result);
    });
  });
  describe("set", () => {
    const result: Operation["type"][] = [
      "getOwnPropertyDescriptor",
      "defineProperty",
      "set",
    ];
    it("should track Reflect.set", () => {
      expect(
        trackExpression((obj: object) => Reflect.set(obj, "a", 1)).map(
          mapToType
        )
      ).toEqual(result);
    });
    it("should track dot member setter", () => {
      expect(
        trackExpression((obj: { a: number }) => (obj.a = 1)).map(mapToType)
      ).toEqual(result);
    });
    it("should track index member setter", () => {
      expect(
        trackExpression((obj: { a: number }) => (obj["a"] = 1)).map(mapToType)
      ).toEqual(result);
    });
  });
  describe("setPrototypeOf", () => {
    const result: Operation["type"][] = ["setPrototypeOf"];
    it("should track Reflect.setPrototypeOf", () => {
      expect(
        trackExpression((obj: object) => Reflect.setPrototypeOf(obj, null)).map(
          mapToType
        )
      ).toEqual(result);
    });
    it("should track Object.setPrototypeOf", () => {
      expect(
        trackExpression((obj: object) => Object.setPrototypeOf(obj, null)).map(
          mapToType
        )
      ).toEqual(result);
    });
  });
});
