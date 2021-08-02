import type { TypeAssertionFunc, TypeGuard } from "../../types/concepts";

export type Validator<T> = TypeGuard<unknown, T>;
export type Assertion<T> = TypeAssertionFunc<unknown, T>;
