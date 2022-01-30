import type { AnyArray, ArrayItem } from "../../types/array";
import type { MergeAll, UnionToIntersection } from "../../types/converts";
import type { Validator } from "./common";

export const isArrayOf =
  <T extends unknown>(itemValidator: Validator<T>): Validator<T[]> =>
  (value: unknown): value is T[] =>
    Array.isArray(value) && value.every((item) => itemValidator(item));
export const arrayOf = isArrayOf;

type MapTypesToValidators<Types extends AnyArray> = {
  [K in keyof Types]: Validator<Types[K]>;
};
type MapValidatorsToTypes<Validators extends readonly Validator<unknown>[]> = {
  [K in keyof Validators]: Validators[K] extends Validator<infer T> ? T : never;
};

export const isTupleOf =
  <Types extends AnyArray>(
    ...validators: MapTypesToValidators<Types>
  ): Validator<Types> =>
  (value: unknown): value is Types =>
    Array.isArray(value) &&
    value.length === validators.length &&
    validators.every((validator, i) => i in value && validator(value[i]));
export const tupleOf = isTupleOf;
/**
 * Same logic with `isTupleOf` but different type inference.
 */
// @ts-expect-error Conditional type
export const isTupleThat: <Validators extends readonly Validator<unknown>[]>(
  ...validators: Validators
) => Validator<MapValidatorsToTypes<Validators>> = isTupleOf;
export const tupleThat = isTupleThat;

export const isUnionOf =
  <Types extends AnyArray>(
    ...validators: MapTypesToValidators<Types>
  ): Validator<ArrayItem<Types>> =>
  (value): value is ArrayItem<Types> =>
    validators.some((validator) => validator(value));
export const unionOf = isUnionOf;
/**
 * Same logic with `isUnionOf` but different type inference.
 */
// @ts-expect-error Conditional type
export const isUnionThat: <Validators extends readonly Validator<unknown>[]>(
  ...validators: Validators
) => Validator<ArrayItem<MapValidatorsToTypes<Validators>>> = isUnionOf;
export const unionThat = isUnionThat;

export const isIntersectionOf =
  <Types extends AnyArray>(
    ...validators: MapTypesToValidators<Types>
  ): Validator<UnionToIntersection<ArrayItem<Types>>> =>
  (value): value is UnionToIntersection<ArrayItem<Types>> =>
    validators.every((validator) => validator(value));
export const intersectionOf = isIntersectionOf;
/**
 * Same logic with `isIntersectionOf` but different type inference.
 */
// @ts-expect-error Conditional type
export const isIntersectionThat: <
  Validators extends readonly Validator<unknown>[]
>(
  ...validators: Validators
) => Validator<
  UnionToIntersection<ArrayItem<MapValidatorsToTypes<Validators>>>
> = isIntersectionOf;
export const intersectionThat = isIntersectionThat;
/**
 * Same logic with `isIntersectionOf` but different type inference.
 */
// @ts-expect-error Conditional type
export const isMergedObjectThat: <
  Validators extends readonly Validator<unknown>[]
>(
  ...validators: Validators
) => Validator<
  MergeAll<
    MapValidatorsToTypes<Validators> extends readonly object[]
      ? MapValidatorsToTypes<Validators>
      : never
  >
> = isIntersectionThat;

export const isAnyOf =
  <Types extends AnyArray>(...values: Types): Validator<ArrayItem<Types>> =>
  (value): value is ArrayItem<Types> =>
    values.some((enumeration) => Object.is(enumeration, value));
export const anyOf = isAnyOf;
