import type { TypeGuard } from "../../types/concepts";

export type Validator<T> = TypeGuard<unknown, T>;
