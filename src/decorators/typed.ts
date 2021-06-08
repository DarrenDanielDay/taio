import type { AnyMethod, Method, MethodKeys } from "../types/concepts";

export function parameter<
  This,
  Key extends MethodKeys<This>,
  Index extends Extract<keyof Parameters<This[Key]>, number>
>(
  decorator: (target: This, key: Key, index: Index) => void
): ParameterDecorator {
  // @ts-expect-error
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
  ) => void | TypedPropertyDescriptor<ExtractToMethod<This, Key>>
): MethodDecorator {
  // @ts-expect-error
  return decorator;
}

export function property<This, Key extends keyof This>(
  decorator: (target: This, key: Key) => void
): PropertyDecorator {
  // @ts-expect-error
  return decorator;
}

export function cls<Class extends Function>(
  decorator: (cls: Class) => void | Class
): ClassDecorator {
  // @ts-expect-error
  return decorator;
}
