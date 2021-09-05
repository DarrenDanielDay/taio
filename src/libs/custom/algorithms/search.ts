import { isPrimitive } from "../../../utils/validator/primitive";
import { LinkedQueue } from "../data-structure/queue/linked-queue";
import { LinkedStack } from "../data-structure/stack/linked-stack";

interface SearchResult {
  circular: Set<unknown>;
}

export function* dfs<T, R>(
  root: T,
  next: (value: T) => Iterable<T>,
  visitor: (value: T) => R
): Generator<R, SearchResult, boolean | undefined> {
  const visited = new Set<T>();
  const circular = new Set<unknown>();
  const stack = new LinkedStack<T>();
  stack.push(root);
  while (!!stack.size) {
    const current = stack.pop();
    visited.add(current);
    const deeper = yield visitor.call(undefined, current);
    if (deeper === false) {
      continue;
    }
    const reverseStack = new LinkedStack<T>();
    for (const newTarget of next.call(undefined, current)) {
      if (!visited.has(newTarget)) {
        reverseStack.push(newTarget);
      } else if (!isPrimitive(newTarget)) {
        circular.add(newTarget);
      }
    }
    while (!!reverseStack.size) {
      stack.push(reverseStack.pop());
    }
  }
  return {
    circular,
  };
}

export function* bfs<T, R>(
  root: T,
  next: (value: T) => Iterable<T>,
  visitor: (value: T) => R
): Generator<R, SearchResult, boolean | undefined> {
  const visited = new Set<T>();
  const queue = new LinkedQueue<T>();
  const circular = new Set<unknown>();
  queue.enqueue(root);
  while (!!queue.size) {
    const current = queue.dequeue();
    visited.add(current);
    const deeper = yield visitor.call(undefined, current);
    if (deeper === false) {
      continue;
    }
    for (const newTarget of next.call(undefined, current)) {
      if (!visited.has(newTarget)) {
        queue.enqueue(newTarget);
      } else if (!isPrimitive(newTarget)) {
        circular.add(newTarget);
      }
    }
  }
  return {
    circular,
  };
}
