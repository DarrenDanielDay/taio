import type { AnyConstructor } from "../../types/concepts";
import { cls } from "./typed";
import { sealedConstruct } from "../object-operation";

export const Sealed = cls<AnyConstructor>((classObject) => {
  const proxy = new Proxy(classObject, {
    construct(...args) {
      sealedConstruct(proxy, args[2]);
      return Reflect.construct(...args);
    },
  });
  return proxy;
});

export const Freeze = cls<AnyConstructor>((classObject) => {
  Object.freeze(classObject);
  Object.freeze(classObject.prototype);
});
