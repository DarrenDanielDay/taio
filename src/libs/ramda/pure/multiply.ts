import { Multiply } from "../../../types/number";

/**
 * Pure function `multiply`
 * @param a number a
 * @param b number b
 * @returns a * b
 */
export function multiply<A extends number, B extends number>(
  a: A,
  b: B
): Multiply<A, B> {
  // @ts-expect-error
  return +a * +b;
}
