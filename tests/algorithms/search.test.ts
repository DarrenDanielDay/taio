import { bfs, dfs } from "../../src/algorithms/search";

describe("search algorithm", () => {
  const jsonTree = {
    a: {
      b: {
        c: 1,
        d: 2,
      },
      e: {
        f: 3,
      },
      g: 4,
      h: 5,
      i: [{ j: 6 }, { k: 7 }],
    },
  };
  const next = ({
    node,
    key,
  }: {
    node: any;
    key: string;
  }): { key: string; node: any }[] =>
    typeof node !== "object"
      ? []
      : Object.keys(Reflect.get(node, key)).map((k) => ({
          key: k,
          node: Reflect.get(node, key),
        }));

  it("should be the order", () => {
    expect(
      [
        ...dfs<{ node: any; key: string }, string>(
          { node: jsonTree, key: "a" },
          next,
          ({ key }) => key.toString()
        ),
      ].join("")
    ).toBe("ai1k0jhgefbdc");
  });
  it("should be the order", () => {
    expect(
      [
        ...bfs<{ node: any; key: string }, string>(
          { node: jsonTree, key: "a" },
          next,
          ({ key }) => key.toString()
        ),
      ].join("")
    ).toBe("abeghicdf01jk");
  });

  it("should not search all", () => {
    const next2 = ({
      node,
      key,
    }: {
      node: any;
      key: string;
    }): { key: string; node: any }[] =>
      node !== jsonTree
        ? []
        : Object.keys(Reflect.get(node, key)).map((k) => ({
            key: k,
            node: Reflect.get(node, key),
          }));
    expect(
      [
        ...bfs<{ node: any; key: string }, string>(
          { node: jsonTree, key: "a" },
          next2,
          ({ key }) => key.toString()
        ),
      ].join("")
    ).toBe("abeghi");
  });

  it("should not search all", () => {
    const next3 = ({
      node,
      key,
    }: {
      node: any;
      key: string;
    }): { key: string; node: any }[] =>
      Array.isArray(node)
        ? []
        : Object.keys(Reflect.get(node, key)).map((k) => ({
            key: k,
            node: Reflect.get(node, key),
          }));
    expect(
      [
        ...dfs<{ node: any; key: string }, string>(
          { node: jsonTree, key: "a" },
          next3,
          ({ key }) => key.toString()
        ),
      ].join("")
    ).toBe("ai10hgefbdc");
  });
  it("should not search deep", () => {
    const iterator = dfs<{ node: any; key: string }, string>(
      { node: jsonTree, key: "a" },
      next,
      ({ key }) => key.toString()
    );
    const result = [
      iterator.next(),
      iterator.next(),
      iterator.next(false),
      iterator.next(true),
      ...iterator,
    ]
      .map((r) => (typeof r === "string" ? r : r.value))
      .join("");
    expect(result).toBe("aihgefbdc");
  });
  it("should not search deep", () => {
    const iterator = bfs<{ node: any; key: string }, string>(
      { node: jsonTree, key: "a" },
      next,
      ({ key }) => key.toString()
    );
    const result = [
      iterator.next(),
      iterator.next(),
      iterator.next(false),
      iterator.next(true),
      iterator.next(false),
      iterator.next(false),
      iterator.next(false),
      ...iterator,
    ]
      .map((r) => (typeof r === "string" ? r : r.value))
      .join("");
    expect(result).toBe("abeghif");
  });
});
