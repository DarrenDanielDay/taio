import { bfs, dfs } from "../../../../src/libs/custom/algorithms/search";

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
    node: object;
    key: string;
  }): { key: string; node: object }[] =>
    typeof node !== "object"
      ? []
      : Object.keys(Reflect.get(node, key) as object).map((k) => ({
          key: k,
          node: Reflect.get(node, key) as object,
        }));

  it("should be the order", () => {
    expect(
      [
        ...dfs<{ node: object; key: string }, string>(
          { node: jsonTree, key: "a" },
          next,
          ({ key }) => key.toString()
        ),
      ].join("")
    ).toBe("abcdefghi0j1k");
  });
  it("should be the order", () => {
    expect(
      [
        ...bfs<{ node: object; key: string }, string>(
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
      node: object;
      key: string;
    }): { key: string; node: object }[] =>
      node !== jsonTree
        ? []
        : Object.keys(Reflect.get(node, key) as object).map((k) => ({
            key: k,
            node: Reflect.get(node, key) as object,
          }));
    expect(
      [
        ...bfs<{ node: object; key: string }, string>(
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
      node: object;
      key: string;
    }): { key: string; node: object }[] =>
      Array.isArray(node)
        ? []
        : Object.keys(Reflect.get(node, key) as object).map((k) => ({
            key: k,
            node: Reflect.get(node, key) as object,
          }));
    expect(
      [
        ...dfs<{ node: object; key: string }, string>(
          { node: jsonTree, key: "a" },
          next3,
          ({ key }) => key.toString()
        ),
      ].join("")
    ).toBe("abcdefghi01");
  });
  it("should not search deep", () => {
    const iterator = dfs<{ node: object; key: string }, string>(
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
    expect(result).toBe("abefghi0j1k");
  });
  it("should not search deep", () => {
    const iterator = bfs<{ node: object; key: string }, string>(
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
  it("should not forever-loop", () => {
    const a: Partial<{ a: unknown }> = {};
    a.a = a;
    let count = 0;
    [
      ...dfs(
        a,
        (a) => Object.keys(a).map((k) => Reflect.get(a, k)),
        () => count++
      ),
    ];
    expect(count).toBe(1);
    [
      ...bfs(
        a,
        (a) => Object.keys(a).map((k) => Reflect.get(a, k)),
        () => count++
      ),
    ];
    expect(count).toBe(2);
  });
});
