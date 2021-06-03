import { Multiply } from "../../../types/number";

export function multiply<A extends number, B extends number>(
  a: A,
  b: B
): Multiply<A, B> {
  // @ts-expect-error
  return +a * +b;
}
