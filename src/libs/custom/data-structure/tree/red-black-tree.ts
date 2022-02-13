import { Freeze } from "../../../../utils/decorators/limitations";
import { sealedConstruct } from "../../../../utils/object-operation";
import { rawRecursiveGenerator } from "../../algorithms/recursive";
import type { Comparator } from "../interfaces/schema";
import { typedBinarySearchFactory } from "./binary-search";
import type { RBTreeNode } from "./binary-tree-schema";

const createRNode = <T extends unknown>(entry: T): RBTreeNode<T> => ({
  parent: null,
  left: null,
  right: null,
  color: "red",
  entry,
});

const createBNode = <T extends unknown>(entry: T): RBTreeNode<T> => ({
  parent: null,
  left: null,
  right: null,
  color: "black",
  entry,
});

type RBNodeIter<T> = RBTreeNode<T> | null;

export class RBTree<T> implements Iterable<T> {
  #root: RBNodeIter<T> = null;
  #comparator: Comparator<T>;
  #generatorFactory = rawRecursiveGenerator<[node: RBNodeIter<T>], T>(
    function* (node) {
      if (node) {
        yield this.sequence(node.left);
        yield this.value(node.entry);
        yield this.sequence(node.right);
      }
    }
  );

  constructor(comparator: Comparator<T>) {
    sealedConstruct(RBTree, new.target);
    this.#comparator = comparator;
    Object.freeze(this);
  }
  #search = typedBinarySearchFactory<RBTreeNode<T>>();
  #rotateL(parent: RBTreeNode<T>) {
    const subR = parent.right!;
    const subRL = subR.left;
    const parentParent = parent.parent;

    parent.right = subRL;
    if (subRL) {
      subRL.parent = parent;
    }
    subR.left = parent;
    parent.parent = subR;
    if (!parentParent) {
      this.#root = subR;
      this.#root.parent = null;
    } else {
      if (parent === parentParent.left) {
        parentParent.left = subR;
      } else {
        parentParent.right = subR;
      }
      subR.parent = parentParent;
    }
  }
  #rotateR(parent: RBTreeNode<T>) {
    const subL = parent.left!;
    const subLR = subL.right;
    const parentParent = parent.parent;
    parent.left = subLR;
    if (subLR) {
      subLR.parent = parent;
    }
    subL.right = parent;
    parent.parent = subL;
    if (!parentParent) {
      this.#root = subL;
      this.#root.parent = null;
    } else {
      if (parent === parentParent.left) {
        parentParent.left = subL;
      } else {
        parentParent.right = subL;
      }
      subL.parent = parentParent;
    }
  }
  #rotateLR(parent: RBTreeNode<T>) {
    this.#rotateL(parent.left!);
    this.#rotateR(parent);
  }
  #rotateRL(parent: RBTreeNode<T>) {
    this.#rotateR(parent.right!);
    this.#rotateL(parent);
  }
  search(entry: T) {
    return this.#search(this.#root, entry, this.#comparator);
  }
  insert(entry: T): [T, boolean] {
    if (!this.#root) {
      const newNode = createBNode(entry);
      this.#root = newNode;
      return [newNode.entry, true];
    }
    let cur: RBNodeIter<T> = this.#root;
    let parent: RBNodeIter<T> = null;
    while (cur) {
      const result = this.#comparator(entry, cur.entry);
      if (result < 0) {
        parent = cur;
        cur = cur.left;
      } else if (result > 0) {
        parent = cur;
        cur = cur.right;
      } else {
        return [cur.entry, false];
      }
    }
    cur = createRNode(entry);
    const newNode = cur;
    const result = this.#comparator(entry, parent!.entry);
    if (result < 0) {
      parent!.left = cur;
      cur.parent = parent;
    } else {
      parent!.right = cur;
      cur.parent = parent;
    }

    while (parent && parent.color === "red") {
      const grandFather = parent.parent!;
      if (parent === grandFather.left) {
        const uncle = grandFather.right;
        if (uncle && uncle.color === "red") {
          parent.color = uncle.color = "black";
          grandFather.color = "red";
          cur = grandFather;
          parent = cur.parent;
        } else {
          if (cur === parent.left) {
            this.#rotateR(grandFather);
            grandFather.color = "red";
            parent.color = "black";
          } else {
            this.#rotateLR(grandFather);
            grandFather.color = "red";
            cur.color = "black";
          }
          break;
        }
      } else {
        const uncle = grandFather.left;
        if (uncle && uncle.color === "red") {
          uncle.color = parent.color = "black";
          grandFather.color = "red";
          cur = grandFather;
          parent = cur.parent;
        } else {
          if (cur === parent.left) {
            this.#rotateRL(grandFather);

            cur.color = "black";
            grandFather.color = "red";
          } else {
            this.#rotateL(grandFather);
            grandFather.color = "red";
            parent.color = "black";
          }
          break;
        }
      }
    }
    this.#root.color = "black";
    return [newNode.entry, true];
  }

  erase(entry: T): boolean {
    let parent: RBNodeIter<T> = null;
    let cur: RBNodeIter<T> = this.#root;
    let delParentPos: RBNodeIter<T> = null;
    let delPos: RBNodeIter<T> = null;
    while (cur) {
      const result = this.#comparator(entry, cur.entry);
      if (result < 0) {
        parent = cur;
        cur = cur.left;
      } else if (result > 0) {
        parent = cur;
        cur = cur.right;
      } else {
        if (!cur.left) {
          if (cur === this.#root) {
            this.#root = this.#root.right;
            if (this.#root) {
              this.#root.parent = null;
              this.#root.color = "black";
            }
            // delete cur
            return true;
          } else {
            delParentPos = parent;
            delPos = cur;
          }
          break;
        } else if (!cur.right) {
          if (cur === this.#root) {
            this.#root = this.#root.left;
            if (this.#root) {
              this.#root.parent = null;
              this.#root.color = "black";
            }
            // delete cur
            return true;
          } else {
            delParentPos = parent;
            delPos = cur;
          }
          break;
        } else {
          let minParent = cur;
          let minRight = cur.right;
          while (minRight.left) {
            minParent = minRight;
            minRight = minRight.left;
          }
          cur.entry = minRight.entry;
          delParentPos = minParent;
          delPos = minRight;
          break;
        }
      }
    }
    if (!delPos) {
      return false;
    }
    const del = delPos;
    const delP = delParentPos;
    if (delPos.color === "black") {
      if (delPos.left) {
        delPos.left.color = "black";
      } else if (delPos.right) {
        delPos.right.color = "black";
      } else {
        while (delPos !== this.#root) {
          if (delPos === delParentPos!.left) {
            let brothor = delParentPos!.right!;
            if (brothor.color === "red") {
              delParentPos!.color = "red";
              brothor.color = "black";
              this.#rotateL(delParentPos!);
              brothor = delParentPos!.right!;
            }
            if (
              (!brothor.left || brothor.left.color === "black") &&
              (!brothor.right || brothor.right.color === "black")
            ) {
              brothor.color = "red";
              if (delParentPos!.color === "red") {
                delParentPos!.color = "black";
                break;
              }
              delPos = delParentPos;
              delParentPos = delPos!.parent;
            } else {
              if (!brothor.right || brothor.right.color === "black") {
                brothor.left!.color = "black";
                brothor.color = "red";
                this.#rotateR(brothor);
                brothor = delParentPos!.right!;
              }
              brothor.color = delParentPos!.color;
              delParentPos!.color = "black";
              brothor.right!.color = "black";
              this.#rotateL(delParentPos!);
              break;
            }
          } else {
            let brother = delParentPos!.left!;
            if (brother.color === "red") {
              delParentPos!.color = "red";
              brother.color = "black";
              this.#rotateR(delParentPos!);
              brother = delParentPos!.left!;
            }
            if (
              (!brother.left || brother.left.color === "black") &&
              (!brother.right || brother.right.color === "black")
            ) {
              brother.color = "red";
              if (delParentPos!.color === "red") {
                delParentPos!.color = "black";
                break;
              }
              delPos = delParentPos;
              delParentPos = delPos!.parent;
            } else {
              if (!brother.left || brother.left.color === "black") {
                brother.right!.color = "black";
                brother.color = "red";
                this.#rotateL(brother);
                brother = delParentPos!.left!;
              }
              brother.color = delParentPos!.color;
              delParentPos!.color = "black";
              brother.left!.color = "black";
              this.#rotateR(delParentPos!);
              break;
            }
          }
        }
      }
    }
    if (!del.left) {
      if (del === delP!.left) {
        delP!.left = del.right;
        if (del.right) {
          del.right.parent = delP;
        }
      } else {
        delP!.right = del.right;
        if (del.right) {
          del.right.parent = delP;
        }
      }
    } else {
      if (del === delP!.left) {
        delP!.left = del.left;
        del.left.parent = delP;
      } else {
        delP!.right = del.left;
        del.left.parent = delP;
      }
    }
    // delete del
    return true;
  }
  [Symbol.iterator]() {
    return this.#generatorFactory(this.#root);
  }
}
Freeze(RBTree);
