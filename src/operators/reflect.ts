import { noop } from "../functions/common";
import { AnyArray } from "../types/array";
import { Func, Method } from "../types/concepts";

export type Operation =
  | ApplyOperation<any, any, any, any>
  | ConstructOperation<any, any, any>
  | DefinePropertyOperation<any, any, any>
  | DeletePropertyOperation<any, any>
  | GetOperation<any, any>
  | GetOwnPropertyDescriptorOperation<any, any>
  | GetPrototypeOfOperation<any>
  | HasOperation<any, any>
  | IsExtensibleOperation<any>
  | OwnKeysOperation<any>
  | PreventExtensionsOperation<any>
  | SetOperation<any, any>
  | SetPrototypeOfOperation<any, any>;
interface BaseOperation<T> {
  type: keyof ProxyHandler<object>;
  target: T;
  result: unknown;
}

export interface ApplyOperation<
  T extends Func<Args, R> | Method<This, Args, R>,
  This,
  Args extends AnyArray,
  R
> extends BaseOperation<T> {
  type: "apply";
  thisArg: This;
  argArray: Args;
  result: R;
}

export interface ConstructOperation<
  T extends { new (...args: AnyArray): R },
  Args extends AnyArray,
  R
> extends BaseOperation<T> {
  type: "construct";
  argArray: Args;
  newTarget: T;
  result: R;
}

export interface DefinePropertyOperation<T, K extends PropertyKey, R>
  extends BaseOperation<T> {
  type: "defineProperty";
  key: K;
  descriptor: TypedPropertyDescriptor<R>;
  result: boolean;
}

export interface DeletePropertyOperation<T, K extends keyof T>
  extends BaseOperation<T> {
  type: "deleteProperty";
  key: K;
  result: boolean;
}

export interface GetOperation<T, K extends keyof T> extends BaseOperation<T> {
  type: "get";
  key: K;
  receiver: T;
  result: T[K];
}

export interface GetOwnPropertyDescriptorOperation<T, K extends keyof T>
  extends BaseOperation<T> {
  type: "getOwnPropertyDescriptor";
  key: K;
  result: TypedPropertyDescriptor<T[K]> | undefined;
}

export interface GetPrototypeOfOperation<T> extends BaseOperation<T> {
  type: "getPrototypeOf";
  result: T | null;
}

export interface HasOperation<T, K> extends BaseOperation<T> {
  type: "has";
  key: K;
  result: K extends keyof T ? true : false;
}

export interface IsExtensibleOperation<T> extends BaseOperation<T> {
  type: "isExtensible";
  result: boolean;
}

export interface OwnKeysOperation<T> extends BaseOperation<T> {
  type: "ownKeys";
  result: ArrayLike<keyof T>;
}

export interface PreventExtensionsOperation<T> extends BaseOperation<T> {
  type: "preventExtensions";
  result: boolean;
}

export interface SetOperation<T, K extends keyof T> extends BaseOperation<T> {
  type: "set";
  key: K;
  value: T[K];
  receiver: T;
  result: boolean;
}

export interface SetPrototypeOfOperation<T, P> extends BaseOperation<T> {
  type: "setPrototypeOf";
  prototype: P;
  result: boolean;
}

export function createPureTrackerProxyHandler<T>(tracks: Operation[]) {
  const proxyHandler: ProxyHandler<Function> = {
    apply(target, thisArg, argArray) {
      const result = Reflect.apply(target, thisArg, argArray);
      tracks.push({
        type: "apply",
        result,
        argArray,
        target,
        thisArg,
      });
      return result;
    },
    construct(target, argArray, newTarget) {
      const result = Reflect.construct(target, argArray, newTarget);
      tracks.push({ type: "construct", result, target, argArray, newTarget });
      return result;
    },
    defineProperty(target, key, descriptor) {
      const result = Reflect.defineProperty(target, key, descriptor);
      tracks.push({ type: "defineProperty", result, target, key, descriptor });
      return result;
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key);
      tracks.push({ type: "deleteProperty", result, target, key });
      return result;
    },
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      tracks.push({ type: "get", result, target, key, receiver });
      return result;
    },
    getOwnPropertyDescriptor(target, key) {
      const result = Reflect.getOwnPropertyDescriptor(target, key);
      tracks.push({ type: "getOwnPropertyDescriptor", result, target, key });
      return result;
    },
    getPrototypeOf(target) {
      const result = Reflect.getPrototypeOf(target);
      tracks.push({ type: "getPrototypeOf", result, target });
      return result;
    },
    has(target, key) {
      const result = Reflect.has(target, key);
      tracks.push({ type: "has", result, target, key });
      return result;
    },
    isExtensible(target) {
      const result = Reflect.isExtensible(target);
      tracks.push({ type: "isExtensible", result, target });
      return result;
    },
    ownKeys(target) {
      const result = Reflect.ownKeys(target);
      tracks.push({ type: "ownKeys", result, target });
      return result;
    },
    preventExtensions(target) {
      const result = Reflect.preventExtensions(target);
      tracks.push({ type: "preventExtensions", result, target });
      return result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      tracks.push({ type: "set", result, target, key, value, receiver });
      return result;
    },
    setPrototypeOf(target, prototype) {
      const result = Reflect.setPrototypeOf(target, prototype);
      tracks.push({ type: "setPrototypeOf", result, target, prototype });
      return result;
    },
  };
  // @ts-expect-error
  return proxyHandler as Required<ProxyHandler<T>>;
}

export function createExpressionAnalyser(
  tracks: Operation[]
): ProxyHandler<object> {
  let wrapped: Function | undefined;
  const wrapResultWithProxy = () => {
    wrapped = wrapped ?? new Proxy(noop, proxyHandler);
    return wrapped;
  };
  const pureHandler = createPureTrackerProxyHandler(tracks);
  const proxyHandler: ProxyHandler<Function> = {
    apply(target, thisArg, argArray) {
      const result = Reflect.apply(target, thisArg, argArray);
      tracks.push({
        type: "apply",
        result,
        argArray,
        target,
        thisArg,
      });
      return wrapResultWithProxy();
    },
    construct(target, argArray, newTarget) {
      const result = Reflect.construct(target, argArray, newTarget);
      tracks.push({ type: "construct", result, target, argArray, newTarget });
      return wrapResultWithProxy();
    },
    defineProperty(target, key, descriptor) {
      return pureHandler.defineProperty.call(this, target, key, descriptor);
    },
    deleteProperty(target, key) {
      return pureHandler.deleteProperty.call(this, target, key);
    },
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      tracks.push({ type: "get", result, target, key, receiver });
      return wrapResultWithProxy();
    },
    getOwnPropertyDescriptor(target, key) {
      return pureHandler.getOwnPropertyDescriptor.call(this, target, key);
    },
    getPrototypeOf(target) {
      const result = Reflect.getPrototypeOf(target);
      tracks.push({ type: "getPrototypeOf", result, target });
      return wrapResultWithProxy();
    },
    has(target, key) {
      return pureHandler.has.call(this, target, key);
    },
    isExtensible(target) {
      return pureHandler.isExtensible.call(this, target);
    },
    ownKeys(target) {
      return pureHandler.ownKeys.call(this, target);
    },
    preventExtensions(target) {
      return pureHandler.preventExtensions.call(this, target);
    },
    set(target, key, value, receiver) {
      return pureHandler.set.call(this, target, key, value, receiver);
    },
    setPrototypeOf(target, prototype) {
      return pureHandler.setPrototypeOf.call(this, target, prototype);
    },
  };
  return proxyHandler;
}

export function trackExpression<T, R>(expression: (input: T) => R) {
  const track: Operation[] = [];
  const handler = createExpressionAnalyser(track);
  Reflect.apply(expression, undefined, [new Proxy(noop, handler)]);
  return track;
}
