import type { Add } from "../../../types/number";

/**
 * Pure function `add`.
 * @param a number a
 * @param b number b
 * @returns a + b
 */
export function add<A extends number, B extends number>(a: A, b: B): Add<A, B> {
  // @ts-expect-error Number calculation
  return +a + +b;
}
