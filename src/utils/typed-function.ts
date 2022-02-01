import { identity } from "../libs/custom/functions/identity";
import type { IsEqual } from "../types/converts";

export const keyOf: <T>(key: keyof T) => keyof T = identity;

/**
 * This function is designed just for type testing.
 * @param equality This parameter should be inferred by given generic parameters.
 * @returns equality
 */
export const typeEqual: <A, B>(equality: IsEqual<A, B>) => IsEqual<A, B> =
  identity;

export const noop = () => {
  /**
   * Do nothing.
   */
};

/**
 * @internal
 */
export const createProxyHost = () =>
  function noop() {
    /**
     * Do nothing.
     */
  };
