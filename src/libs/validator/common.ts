import type { TypeGuard } from "../../types/concepts";

export type Validator<T> = TypeGuard<unknown, T>;
export const is =
  <T>(reference: T): Validator<T> =>
  (value: unknown): value is T =>
    Object.is(value, reference);

export const defineValidator = <T>(validator: Validator<T>): Validator<T> =>
  validator;
