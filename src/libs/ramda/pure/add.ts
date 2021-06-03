import { Add } from "../../../types/number";

export function add<A extends number, B extends number>(a: A, b: B): Add<A, B> {
  // @ts-expect-error
  return +a + +b;
}
