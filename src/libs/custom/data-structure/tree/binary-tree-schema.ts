export interface BinaryNode<T> {
  left: this | null;
  right: this | null;
  entry: T;
}

export type Color = "black" | "red";

export interface RBTreeNode<T> extends BinaryNode<T> {
  parent: this | null;
  color: Color;
}
