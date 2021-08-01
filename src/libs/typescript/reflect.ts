import type { AnyConstructor, AnyFunc, AnyMethod } from "../../types/concepts";
import type { NonExtensibleObject } from "../../types/object";
import type { ITypedObject } from "./object";

interface ITypedReflect {
  apply<Fn extends AnyFunc | AnyMethod>(
    target: Fn,
    thisArgument: ThisParameterType<Fn>,
    argumentsList: Parameters<Fn>
  ): ReturnType<Fn>;
  construct<Ctor extends AnyConstructor>(
    target: Ctor,
    argumentsList: ConstructorParameters<Ctor>,
    newTarget?: InstanceType<Ctor>
  ): InstanceType<Ctor>;
  defineProperty: ITypedObject["defineProperty"];
  deleteProperty<T extends object, K extends keyof T>(
    target: T,
    key: K
  ): boolean;
  get<T extends object, K extends keyof T>(
    target: T,
    key: K,
    reciever?: T
  ): T[K];
  getOwnPropertyDescriptor: ITypedObject["getOwnPropertyDescriptor"];
  getPrototypeOf: ITypedObject["getPrototypeOf"];
  has<T extends object, K extends PropertyKey>(
    target: T,
    key: K
  ): T extends { [Key in K]?: unknown } ? boolean : false;
  isExtensible(target: object): boolean;
  ownKeys<T extends object>(target: T): (keyof T)[];
  preventExtensions<T extends object>(
    target: T
  ): asserts target is NonExtensibleObject<T>;
  set<T extends object, K extends keyof T>(
    target: T,
    key: K,
    value: T[K],
    reciever?: T
  ): boolean;
  setPrototypeOf: ITypedObject["setPrototypeOf"];
}

// @ts-expect-error Type overwrite
const TypedReflect: ITypedReflect = Reflect;
export { TypedReflect };
