import type { Func } from "../../../../types/concepts";

export interface Option<T> {
  value?: T;
}

export const some = <T extends unknown>(value: T): Option<T> => ({ value });
export const none = <T extends unknown>(): Option<T> => ({});

export const hasSome = <T extends unknown>(
  option: Option<T>
): option is Required<Option<T>> => Reflect.has(option, "value");

export const hasNone = <T extends unknown>(
  option: Option<T>
): option is Omit<Option<T>, "value"> => !Reflect.has(option, "value");

export const match = <T, R>(
  option: Option<T>,
  whenSome: Func<[value: T], R>,
  whenNone: Func<[], R>
) => (hasSome(option) ? whenSome(option.value) : whenNone());
