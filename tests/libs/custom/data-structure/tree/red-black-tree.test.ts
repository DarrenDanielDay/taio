import { match } from "../../../../../src/libs/custom/data-structure/common/option";
import type { Comparator } from "../../../../../src/libs/custom/data-structure/interfaces/schema";
import { RBTree } from "../../../../../src/libs/custom/data-structure/tree/red-black-tree";
import { identity } from "../../../../../src/libs/custom/functions/identity";
import { always } from "../../../../../src/libs/custom/functions/wrapper";

describe("RB Tree", () => {
  const numberComparator: Comparator<number> = (a, b) => a - b;
  const insertOrder = [
    6, 3, 87, 13, 57, 59, 72, 68, 92, 81, 61, 19, 30, 14, 77, 60, 56, 94, 45,
    62, 33, 7, 35, 31, 55, 42, 91, 99, 43, 58, 16, 71, 54, 89, 65, 23, 49, 93,
    11, 98, 67, 10, 34, 86, 46, 73, 4, 20, 74, 37, 44, 41, 80, 90, 88, 95, 12,
    9, 66, 78, 27, 53, 48, 15, 70, 0, 32, 97, 85, 17, 26, 1, 39, 2, 22, 8, 24,
    5, 21, 28, 69, 47, 75, 76, 82, 18, 25, 36, 52, 40, 29, 64, 63, 96, 83, 84,
    51, 50, 79, 38,
  ];
  const eraceOrder = [
    20, 16, 48, 54, 71, 89, 53, 72, 61, 65, 7, 67, 49, 34, 83, 19, 29, 87, 45,
    73, 10, 13, 1, 90, 14, 57, 4, 42, 21, 88, 9, 8, 55, 84, 30, 51, 68, 46, 0,
    78, 99, 43, 85, 28, 81, 58, 74, 93, 91, 76, 60, 95, 52, 5, 32, 75, 17, 2,
    63, 23, 35, 33, 38, 37, 77, 94, 56, 3, 6, 98, 92, 26, 11, 66, 96, 59, 62,
    41, 86, 44, 36, 80, 15, 27, 40, 18, 47, 70, 97, 22, 82, 25, 50, 24, 12, 39,
    79, 64, 69, 31,
  ];
  let [rbTree, arr, replaceTreeWithRangedTree] = (() => {
    const createRangedTree = (total: number) => {
      const rbTree = new RBTree(numberComparator);
      const arr = Array.from({ length: total }, (_, k) => k);
      arr.forEach((n) => {
        rbTree.insert(n);
      });
      return [rbTree, arr] as const;
    };
    const updateRange = (n: number) => ([rbTree, arr] = createRangedTree(n));
    return [...createRangedTree(0), updateRange];
  })();
  beforeEach(() => {
    replaceTreeWithRangedTree(0);
  });
  it("should be binary search tree", () => {
    replaceTreeWithRangedTree(100);
    expect([...rbTree]).toStrictEqual(arr);
    const iterator = rbTree[Symbol.iterator]();
    arr.forEach((n) => {
      const iteration = iterator.next();
      if (iteration.done) {
        fail("Invalid node order");
      } else {
        expect(iteration.value).toBe(n);
      }
    });
    expect(iterator.next().done).toBe(true);
  });
  it("should delete all element", () => {
    replaceTreeWithRangedTree(100);
    arr.forEach((n) => {
      rbTree.erase(n);
    });
    expect([...rbTree]).toStrictEqual([]);
  });
  it("should fail to insert with existing entry", () => {
    expect(rbTree.insert(1)[1]).toBe(true);
    expect(rbTree.insert(1)[1]).toBe(false);
  });
  it("should fail to erase with missing entry", () => {
    expect(rbTree.erase(-1)).toBe(false);
  });
  it("should cover it", () => {
    const simpleRBTree = new RBTree(numberComparator);
    simpleRBTree.insert(0);
    simpleRBTree.insert(1);
    expect(simpleRBTree.erase(0)).toBe(true);
    expect(simpleRBTree.erase(1)).toBe(true);
    simpleRBTree.insert(0);
    simpleRBTree.insert(-1);
    simpleRBTree.insert(1);
    expect(simpleRBTree.erase(0)).toBe(true);
    expect(simpleRBTree.erase(-1)).toBe(true);
    simpleRBTree.insert(1);
    const tree = new RBTree(numberComparator);
    insertOrder.forEach((n) => tree.insert(n));
    eraceOrder.forEach((n) => tree.erase(n));
  });
  it("should find entry by search", () => {
    rbTree.insert(99);
    rbTree.insert(0);
    expect(match(rbTree.search(99), identity, always(-1))).toBe(99);
    expect(match(rbTree.search(0), identity, always(-1))).toBe(0);
    expect(match(rbTree.search(-10), identity, always(-1))).toBe(-1);
  });
});
