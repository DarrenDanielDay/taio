import type { AnyMethod, Method, MethodKeys } from "../../types/concepts";
import type { IndexKey } from "../../types/converts";
import type { AnyPrototype } from "../../types/object";

export function parameter<
  This,
  Key extends MethodKeys<This>,
  Index extends IndexKey<Parameters<Extract<This[Key], AnyMethod>>>
>(
  decorator: (target: This, key: Key, index: Index) => void
): ParameterDecorator {
  // @ts-expect-error Contravariance
  return decorator;
}

export type ExtractToMethod<
  This,
  Key extends MethodKeys<This>
> = This[Key] extends AnyMethod
  ? Method<This, Parameters<This[Key]>, ReturnType<This[Key]>>
  : never;

export function method<This, Key extends MethodKeys<This>>(
  decorator: (
    target: This,
    key: Key,
    descriptor: TypedPropertyDescriptor<ExtractToMethod<This, Key>>
  ) => TypedPropertyDescriptor<ExtractToMethod<This, Key>> | void
): MethodDecorator {
  // @ts-expect-error Contravariance
  return decorator;
}

export function property<This, Key extends keyof This>(
  decorator: (target: This, key: Key) => void
): PropertyDecorator {
  // @ts-expect-error Contravariance
  return decorator;
}

export function cls<Class extends AnyPrototype>(
  decorator: (cls: Class) => Class | void
): ClassDecorator {
  // @ts-expect-error Contravariance
  return decorator;
}
