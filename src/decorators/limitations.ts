import { DefaultMap } from "../data-structure/map/default-map";
import { invalidOperation } from "../internal/exceptions";
import {
  overwriteDescriptorConfig,
  PropertyConfig,
} from "../utils/object-operation";
import { cls, property } from "./typed";

export const Sealed = cls<Function>((classObject) => {
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

export class Property<This, Key extends keyof This> {
  #symbol = Symbol();
  #initValue;
  constructor(initValue?: This[Key]) {
    this.#initValue = initValue;
  }
  get(instance: This): This[Key] {
    const descriptor = Object.getOwnPropertyDescriptor(
      instance,
      this.#symbol
    ) as TypedPropertyDescriptor<This[Key]> | undefined;
    // @ts-expect-error
    return descriptor ? descriptor.value : this.#initValue;
  }
  set(instance: This, value: This[Key]) {
    const descriptor = Object.getOwnPropertyDescriptor(
      instance,
      this.#symbol
    ) as TypedPropertyDescriptor<This[Key]> | undefined;
    if (!descriptor) {
      Object.defineProperty(instance, this.#symbol, {
        value,
        writable: true,
      });
    } else {
      Reflect.set(instance as unknown as object, this.#symbol, value);
    }
  }
}

export function ReadonlyOutside<This>(propConfig?: PropertyConfig) {
  const propertyMap = new DefaultMap<keyof This, Property<This, keyof This>>(
    () => new Property()
  );
  const accessor = {
    get<Key extends keyof This>(instance: This, key: Key) {
      return propertyMap.get(key).get(instance) as This[Key];
    },
    set<Key extends keyof This>(instance: This, key: Key, value: This[Key]) {
      return propertyMap.get(key).set(instance, value);
    },
    decorate<Key extends keyof This>(initValue?: This[Key]) {
      return property<This, Key>((target, key) => {
        Object.defineProperty(
          target,
          key,
          overwriteDescriptorConfig(propConfig, {
            get(this: This) {
              if (!propertyMap.has(key)) {
                const prop = new Property(initValue);
                propertyMap.set(key, prop);
                // @ts-expect-error
                accessor.set(this, initValue);
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
}
