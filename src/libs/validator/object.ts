import type { EmptyObject } from "../../types/object";
import type { Validator } from "./common";
import { isNull } from "./primitive";

export const isObjectLike = (
  value: unknown
): value is Record<PropertyKey, unknown> =>
  (!isNull(value) && typeof value === "object") || typeof value === "function";

export const isObject =
  <T extends EmptyObject>(
    schema: { [K in keyof T]: Validator<T[K]> }
  ): Validator<T> =>
  (value: unknown): value is T =>
    isObjectLike(value) &&
    Object.entries<Validator<T[keyof T]>>(schema).every(([key, validator]) =>
      validator(Reflect.get(value, key))
    );
