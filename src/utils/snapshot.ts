import { invalidOperation } from "./internal/exceptions";
import { isNativeFunction, isObjectLike } from "./validator/object";
const snapshots = new WeakMap<object, object>();
const handler: Required<ProxyHandler<object>> = {
  apply(target: Function, thisArg: unknown, argArray: unknown[]) {
    if (isNativeFunction(target)) {
      return Reflect.apply(target, thisArg, argArray);
    }
    return invalidOperation("Cannot invoke custom methods on a snapshot.");
  },
  construct(): object {
    return invalidOperation("Cannot construct a snapshot.");
  },
  defineProperty(): boolean {
    return invalidOperation("Cannot add properties on a snapshot.");
  },
  deleteProperty(): boolean {
    return invalidOperation("Cannot delete properties on a snapshot.");
  },
  get(target: object, p: string | symbol, receiver: unknown): unknown {
    return snapshot(Reflect.get(target, p, receiver));
  },
  getOwnPropertyDescriptor(
    target: object,
    p: string | symbol
  ): PropertyDescriptor | undefined {
    return snapshot(Reflect.getOwnPropertyDescriptor(target, p));
  },
  getPrototypeOf(): object | null {
    return invalidOperation("Cannot access prototype on a snapshot.");
  },
  has(target: object, p: string | symbol): boolean {
    return Reflect.has(target, p);
  },
  isExtensible(target: object): boolean {
    return Reflect.isExtensible(target);
  },
  ownKeys(target: object): ArrayLike<string | symbol> {
    return Reflect.ownKeys(target);
  },
  preventExtensions(): boolean {
    return invalidOperation("Cannot prevent extension on a snapshot.");
  },
  set(): boolean {
    return invalidOperation("Cannot set properties on a snapshot.");
  },
  setPrototypeOf(): boolean {
    return invalidOperation("Cannot set prototype on a snapshot.");
  },
};

export const snapshot = <T extends unknown>(value: T): T => {
  // @ts-expect-error Dynamic implementation
  return isObjectLike(value)
    ? snapshots
        .set(value, snapshots.get(value) ?? new Proxy<object>(value, handler))
        .get(value)
    : value;
};
