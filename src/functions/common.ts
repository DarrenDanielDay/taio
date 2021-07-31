import type { IsEqual } from "../types/converts";

export function typed<T>(obj: T): T {
  return obj;
}
/**
 * This function is designed just for type testing.
 * @param equality This parameter should be inferred by given generic parameters.
 * @returns equality
 */
export function typeEqual<A, B>(equality: IsEqual<A, B>): IsEqual<A, B> {
  return equality;
}

export function noop() {
  /**
   * Do nothing.
   */
}

export function createNoop() {
  return function noop() {
    /**
     * Do nothing.
     */
  };
}
