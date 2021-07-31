import { DefaultMap } from "../data-structure/map/default-map";
import { invalidOperation } from "../internal/exceptions";
import type { AnyConstructor } from "../types/concepts";
import type { PropertyConfig } from "../utils/object-operation";
import { overwriteDescriptorConfig } from "../utils/object-operation";
import { cls, property } from "./typed";

export const Sealed = cls<AnyConstructor>((classObject) => {
  const proxy = new Proxy(classObject, {
    construct: function (...args) {
      if (args[2] !== proxy) {
        return invalidOperation(
          "Cannot instantiate a subclass of a sealed class."
        );
      }
      return Reflect.construct(...args);
    },
  });
  return proxy;
});

export const Freeze = cls<AnyConstructor>((classObject) => {
  Object.freeze(classObject);
  Object.freeze(classObject.prototype);
});
export class Property<This, Key extends keyof This> {
  #symbol = Symbol();
  #initValue;
  constructor(initValue: This[Key]) {
    this.#initValue = initValue;
  }
  get(instance: This): This[Key] {
    const descriptor: TypedPropertyDescriptor<This[Key]> | undefined =
      Object.getOwnPropertyDescriptor(instance, this.#symbol);
    return descriptor ? descriptor.value! : this.#initValue;
  }
  set(instance: This, value: This[Key]) {
    const descriptor: TypedPropertyDescriptor<This[Key]> | undefined =
      Object.getOwnPropertyDescriptor(instance, this.#symbol);
    if (!descriptor) {
      Object.defineProperty(instance, this.#symbol, {
        value,
        writable: true,
      });
    } else {
      // @ts-expect-error Skipped check of object type
      Reflect.set(instance, this.#symbol, value);
    }
  }
}

export const ReadonlyOutside = <This>(propConfig?: PropertyConfig) => {
  const propertyMap = new DefaultMap<keyof This, Property<This, keyof This>>(
    () => new Property(undefined!)
  );
  const accessor = {
    get<Key extends keyof This>(instance: This, key: Key): This[Key] {
      // @ts-expect-error Managed by correct type, so it should be corresponded.
      return propertyMap.get(key).get(instance);
    },
    set<Key extends keyof This>(instance: This, key: Key, value: This[Key]) {
      return propertyMap.get(key).set(instance, value);
    },
    decorate<Key extends keyof This>(initValue: This[Key]) {
      return property<This, Key>((target, key) => {
        Object.defineProperty(
          target,
          key,
          overwriteDescriptorConfig(propConfig, {
            get(this: This) {
              if (!propertyMap.has(key)) {
                const prop = new Property(initValue);
                propertyMap.set(key, prop);
                accessor.set(this, key, initValue);
                return initValue;
              }
              return accessor.get(this, key);
            },
            set() {
              return invalidOperation("Cannot set readonly property.");
            },
          })
        );
      });
    },
  };
  return accessor;
};
