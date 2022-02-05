import type { AnyParams } from "../../types/array";
import type { ConstructorOf, InstanceSource } from "../../types/concepts";
import type { EmptyObject } from "../../types/object";
import type { Validator } from "./common";
import { isNull } from "./primitive";

export const isObjectOrNull = (value: unknown): value is object | null =>
  typeof value === "object";

export const isObjectLike = (
  value: unknown
): value is Record<PropertyKey, unknown> =>
  (!isNull(value) && typeof value === "object") || typeof value === "function";

export const isObject =
  <T extends EmptyObject>(schema: {
    [K in keyof T]: Validator<T[K]>;
  }): Validator<T> =>
  (value: unknown): value is T =>
    isObjectLike(value) &&
    Object.entries<Validator<T[keyof T]>>(schema).every(([key, validator]) =>
      validator(Reflect.get(value, key))
    );

export const isInstanceOf =
  <T extends unknown>(constructor: InstanceSource<T>): Validator<T> =>
  (value): value is T =>
    // @ts-expect-error Symbol.hasInstance is not considered by TypeScript
    value instanceof constructor;

export const hasPrototypeConstructor =
  <T extends object>(constructor: ConstructorOf<T, AnyParams>): Validator<T> =>
  (value): value is T =>
    Object.getPrototypeOf(value)?.constructor === constructor;
