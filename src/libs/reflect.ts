import type { AnyArray } from "../types/array";
import type { AnyFunc, AnyMethod, ConstructorOf } from "../types/concepts";
import type { ITypedObject } from "./object";

interface ITypedReflect {
  apply<Fn extends AnyMethod | AnyFunc>(
    target: Fn,
    thisArgument: ThisParameterType<Fn>,
    argumentsList: Parameters<Fn>
  ): ReturnType<Fn>;
  construct<Ctor extends ConstructorOf<unknown, AnyArray>>(
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
  ownKeys<T extends object>(target: T): (keyof T)[];
  set<T extends object, K extends keyof T>(
    target: T,
    key: K,
    value: T[K],
    reciever?: T
  ): boolean;
}

// @ts-expect-error
const TypedReflect: ITypedReflect = Reflect;
export { TypedReflect };
