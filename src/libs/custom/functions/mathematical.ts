import type { Add, Multiply } from "../../../types/number";

/**
 * Pure function `add`.
 * @param a number a
 * @param b number b
 * @returns a + b
 */
export const add = <A extends number, B extends number>(
  a: A,
  b: B
): Add<A, B> =>
  // @ts-expect-error Number calculation
  a + b;

/**
 * Pure function `multiply`
 * @param a number a
 * @param b number b
 * @returns a * b
 */
export const multiply = <A extends number, B extends number>(
  a: A,
  b: B
): Multiply<A, B> => a * b;
