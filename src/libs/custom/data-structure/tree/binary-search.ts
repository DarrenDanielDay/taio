import { rawRecursive } from "../../algorithms/recursive";
import { none, Option, some } from "../common/option";
import type { Comparator } from "../interfaces/schema";
import type { BinaryNode } from "./binary-tree-schema";

export const typedBinarySearchFactory = <N extends BinaryNode<unknown>>() =>
  rawRecursive<
    [node: N | null, entry: N["entry"], comparator: Comparator<N["entry"]>],
    Option<N["entry"]>
  >(function* (node, entry, comparator) {
    if (node === null) {
      return none();
    }
    const result = comparator(node.entry, entry);
    if (result > 0) {
      return yield this.call(node.left, entry, comparator);
    }
    if (result < 0) {
      return yield this.call(node.right, entry, comparator);
    }
    return some(node.entry);
  });
