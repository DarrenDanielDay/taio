import type { Func, Mapper } from "../../../types/concepts";
import { LinkedQueue } from "../data-structure/queue/linked-queue";
interface SearchResult {
  circular: Set<unknown>;
}

type IterateNext<T> = Func<[value: T], Iterable<T>>;
export function* dfs<T, R>(
  root: T,
  next: IterateNext<T>,
  visitor: Mapper<T, R>
): Generator<R, SearchResult, boolean | undefined> {
  interface StackFrame {
    target: T;
    iterator?: Iterator<T>;
  }
  const visited = new Set<T>();
  const circular = new Set<unknown>();
  const stack = new Array<StackFrame>();
  stack.push({ target: root });
  while (!!stack.length) {
    const currentFrame = stack.at(-1)!;
    const current = currentFrame.target;
    const currentIterator = currentFrame.iterator;
    if (!currentIterator) {
      const deeper = yield visitor.call(undefined, current);
      visited.add(current);
      if (deeper === false) {
        stack.pop();
        continue;
      }
    }
    const iterator =
      currentIterator ??
      (currentFrame.iterator = next
        .call(undefined, current)
        [Symbol.iterator]());
    const iteration = iterator.next();
    if (iteration.done) {
      stack.pop();
    } else {
      const nextTarget = iteration.value;
      if (!visited.has(nextTarget)) {
        stack.push({ target: nextTarget });
      } else {
        circular.add(nextTarget);
      }
    }
  }
  return {
    circular,
  };
}

export function* bfs<T, R>(
  root: T,
  next: IterateNext<T>,
  visitor: Mapper<T, R>
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
      } else {
        circular.add(newTarget);
      }
    }
  }
  return {
    circular,
  };
}
