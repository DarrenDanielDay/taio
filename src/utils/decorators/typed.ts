import { identity } from "../../libs/custom/functions/identity";
import type { AnyMethod, Method, MethodKeys } from "../../types/concepts";
import type { IndexKey } from "../../types/converts";
import type { AnyPrototype } from "../../types/object";
// @ts-expect-error Contravariance
export const parameter: <
  This,
  Key extends MethodKeys<This>,
  Index extends IndexKey<Parameters<Extract<This[Key], AnyMethod>>>
>(
  decorator: (target: This, key: Key, index: Index) => void
) => ParameterDecorator = identity;

export type ExtractToMethod<
  This,
  Key extends MethodKeys<This>
> = This[Key] extends AnyMethod
  ? Method<This, Parameters<This[Key]>, ReturnType<This[Key]>>
  : never;

// @ts-expect-error Contravariance
export const method: <This, Key extends MethodKeys<This>>(
  decorator: (
    target: This,
    key: Key,
    descriptor: TypedPropertyDescriptor<ExtractToMethod<This, Key>>
  ) => TypedPropertyDescriptor<ExtractToMethod<This, Key>> | void
) => MethodDecorator = identity;

// @ts-expect-error Contravariance
export const property: <This, Key extends keyof This>(
  decorator: (target: This, key: Key) => void
) => PropertyDecorator = identity;

// @ts-expect-error Contravariance
export const cls: <Class extends AnyPrototype>(
  decorator: (cls: Class) => Class | void
) => ClassDecorator = identity;
