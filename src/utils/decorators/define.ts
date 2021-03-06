import type {
  AnyMethod,
  Getter,
  Method,
  MethodKeys,
  Setter,
} from "../../types/concepts";
import type { PropertyConfig } from "../object-operation";
import { overwriteDescriptorConfig } from "../object-operation";
import type { ExtractToMethod } from "./typed";
import { method, property } from "./typed";

export const DefineProperty = <T extends unknown>(
  descriptor: TypedPropertyDescriptor<T>
): PropertyDecorator =>
  property((target, key) => {
    Object.defineProperty(target, key, descriptor);
  });

export interface MethodDecoratorContext<This, Key extends MethodKeys<This>> {
  target: This;
  name: Key;
  func: ExtractToMethod<This, Key>;
}

export const WrappedMethod = <This, Key extends MethodKeys<This>>(
  wrapper: Method<
    This,
    [
      MethodDecoratorContext<This, Key>,
      ...Parameters<Extract<This[Key], AnyMethod>>
    ],
    ReturnType<Extract<This[Key], AnyMethod>>
  >,
  overwrite?: PropertyConfig
): MethodDecorator =>
  method<This, Key>((target, methodName, descriptor) => {
    const originalMethod = descriptor.value;
    // @ts-expect-error Conditional type
    descriptor.value = function (this: This, ...args: Parameters<This[Key]>) {
      return wrapper.apply(this, [
        { name: methodName, target, func: originalMethod! },
        ...args,
      ]);
    };
    overwriteDescriptorConfig(overwrite, descriptor);
    return descriptor;
  });

export interface Accessors<This, T> {
  get: Getter<This, T>;
  set: Setter<This, T>;
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

export const Accesser = <
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
): MethodDecorator =>
  method(
    // @ts-expect-error Contravariance
    (target: This, key: Key, describer: TypedPropertyDescriptor<This[Key]>) => {
      const originalAccessor = describer[type]!;
      // @ts-expect-error Index type inferred as union type
      describer[type] = function (
        this: This,
        ...args: Parameters<Accessors<This, This[Key]>[Type]>
      ) {
        return handler.call(
          this,
          // @ts-expect-error Index type inferred as union type
          { func: originalAccessor, name: key, target },
          ...args
        );
      };
      overwriteDescriptorConfig(overwrite, describer);
      return describer;
    }
  );
