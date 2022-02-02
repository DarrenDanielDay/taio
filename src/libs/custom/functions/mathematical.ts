import type {
  AbsBAnd,
  AbsBOr,
  AbsBXOr,
  Add,
  Decrease,
  Increase,
  Inverse,
  Multiply,
  Opposite,
  Substract,
} from "../../../types/number";

/**
 * Pure function `opposite`.
 * @param n number n
 * @returns n + 1
 */
export const opposite = <N extends number>(n: N): Opposite<N> =>
  // @ts-expect-error Number calculation
  -n;

/**
 * Pure function `inverse`.
 * @param n number n
 * @returns n + 1
 */
export const inverse = <N extends number>(n: N): Inverse<N> =>
  // @ts-expect-error Number calculation
  ~n;

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
 * Pure function `substract`.
 * @param a number a
 * @param b number b
 * @returns a - b
 */
export const substract = <A extends number, B extends number>(
  a: A,
  b: B
): Substract<A, B> =>
  // @ts-expect-error Number calculation
  a - b;
/**
 * Pure function `bitAnd`.
 * @param a number a
 * @param b number b
 * @returns a & b
 */
export const bitAnd = <A extends number, B extends number>(
  a: A,
  b: B
): AbsBAnd<A, B> =>
  // @ts-expect-error Number calculation
  a & b;
/**
 * Pure function `bitOr`.
 * @param a number a
 * @param b number b
 * @returns a | b
 */
export const bitOr = <A extends number, B extends number>(
  a: A,
  b: B
): AbsBOr<A, B> =>
  // @ts-expect-error Number calculation
  a | b;
/**
 * Pure function `bitXOr`.
 * @param a number a
 * @param b number b
 * @returns a ^ b
 */
export const bitXOr = <A extends number, B extends number>(
  a: A,
  b: B
): AbsBXOr<A, B> =>
  // @ts-expect-error Number calculation
  a ^ b;

/**
 * Pure function `increase`.
 * @param n number n
 * @returns n + 1
 */
export const increase = <N extends number>(n: N): Increase<N> =>
  // @ts-expect-error Number calculation
  n + 1;

/**
 * Pure function `increase`.
 * @param n number n
 * @returns n + 1
 */
export const decrease = <N extends number>(n: N): Decrease<N> =>
  // @ts-expect-error Number calculation
  n - 1;

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

/**
 * Pure function `divide`
 * @param a number a
 * @param b number b
 * @returns Math.floor(a / b)
 */
export const divide = (a: number, b: number): number => Math.floor(a / b);

/**
 * Pure function `divide`
 * @param a number a
 * @param b number b
 * @returns a % b
 */
export const mod = (a: number, b: number): number => a % b;
