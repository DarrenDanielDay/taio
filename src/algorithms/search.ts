import { LinkedQueue } from "../data-structure/queue/linked-queue";
import { LinkedStack } from "../data-structure/stack/linked-stack";

export function* dfs<T, R>(
  root: T,
  next: (value: T) => Iterable<T>,
  visitor: (value: T) => R
): Generator<R, void, boolean | undefined> {
  const visited = new Set<T>();
  const stack = new LinkedStack<T>();
  stack.push(root);
  while (!!stack.size) {
    const current = stack.pop();
    visited.add(current);
    const deeper = yield visitor.call(undefined, current);
    if (deeper === false) {
      continue;
    }
    for (const newTarget of next.call(undefined, current)) {
      !visited.has(newTarget) && stack.push(newTarget);
    }
  }
}

export function* bfs<T, R>(
  root: T,
  next: (value: T) => Iterable<T>,
  visitor: (value: T) => R
): Generator<R, void, boolean | undefined> {
  const visited = new Set<T>();
  const stack = new LinkedQueue<T>();
  stack.enqueue(root);
  while (!!stack.size) {
    const current = stack.dequeue();
    visited.add(current);
    const deeper = yield visitor.call(undefined, current);
    if (deeper === false) {
      continue;
    }
    for (const newTarget of next.call(undefined, current)) {
      !visited.has(newTarget) && stack.enqueue(newTarget);
    }
  }
}
