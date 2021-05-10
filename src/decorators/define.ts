import { AnyMethod, Method, MethodKeys } from "../types/concepts";
import {
  overwriteDescriptorConfig,
  PropertyConfig,
} from "../utils/object-operation";
import { method, property } from "./typed";

export function DefineProperty<T>(
  descriptor: TypedPropertyDescriptor<T>
): PropertyDecorator {
  return property((target, key) => {
    Object.defineProperty(target, key, descriptor);
  });
}

export interface MethodDecoratorContext<This, Key extends keyof This> {
  target: This;
  name: Key;
  func: This[Key] extends AnyMethod ? This[Key] : never;
}

export function WrappedMethod<This, Key extends MethodKeys<This>>(
  wrapper: Method<
    This,
    [MethodDecoratorContext<This, Key>, ...Parameters<This[Key]>],
    ReturnType<This[Key]>
  >,
  overwrite?: PropertyConfig
): MethodDecorator {
  return method<This, Key>((target, methodName, descriptor) => {
    const originalMethod = descriptor.value;
    // @ts-expect-error
    descriptor.value = function (this: This, ...args: Parameters<This[Key]>) {
      return wrapper.apply(this, [
        { name: methodName, target, func: originalMethod! },
        ...args,
      ]);
    };
    overwriteDescriptorConfig(overwrite, descriptor);
    return descriptor;
  });
}

export interface Accessors<This, T> {
  get: Method<This, [], T>;
  set: Method<This, [T], void>;
}

export interface AccessorContext<
  This,
  Key extends keyof This,
  Type extends keyof Accessors<This, This[Key]>
> {
  func: Accessors<This, This[Key]>[Type];
  target: This;
  name: Key;
}

export function Accesser<
  This,
  Key extends keyof This,
  Type extends keyof Accessors<This, This[Key]>
>(
  type: Type,
  handler: Method<
    This,
    [
      AccessorContext<This, Key, Type>,
      ...Parameters<Accessors<This, This[Key]>[Type]>
    ],
    ReturnType<Accessors<This, This[Key]>[Type]>
  >,
  overwrite?: PropertyConfig
): MethodDecorator {
  return method(
    // @ts-expect-error
    (target: This, key: Key, describer: TypedPropertyDescriptor<This[Key]>) => {
      const originalAccessor = describer[type] as Accessors<
        This,
        This[Key]
      >[Type];
      // @ts-expect-error
      describer[type] = function (
        this: This,
        ...args: Parameters<Accessors<This, This[Key]>[Type]>
      ) {
        return handler.call(
          this,
          { func: originalAccessor, name: key, target },
          ...args
        );
      };
      overwriteDescriptorConfig(overwrite, describer);
      return describer;
    }
  );
}
