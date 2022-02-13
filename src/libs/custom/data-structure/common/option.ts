import type { Func } from "../../../../types/concepts";

export interface Option<T> {
  value?: T;
}

export interface None {}

export interface Some<T> {
  value: T;
}

export const some = <T extends unknown>(value: T): Some<T> => ({ value });
export const none = (): None => ({});

export const hasSome = <T extends unknown>(
  option: Option<T>
): option is Some<T> => Reflect.has(option, "value");

export const hasNone = <T extends unknown>(option: Option<T>): option is None =>
  !Reflect.has(option, "value");

export const match = <T, R>(
  option: Option<T>,
  whenSome: Func<[value: T], R>,
  whenNone: Func<[], R>
) => (hasSome(option) ? whenSome(option.value) : whenNone());
