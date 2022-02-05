import type { Terminator, TypeGuard } from "../../../types/concepts";
import { Freeze } from "../../../utils/decorators/limitations";
import { getGlobal } from "../../../utils/global";
import { die } from "../../../utils/internal/exceptions";
import { sealedConstruct } from "../../../utils/object-operation";
import { capitalize } from "../../../utils/string";
import {
  hasPrototypeConstructor,
  isObjectLike,
} from "../../../utils/validator/object";
import type { CloneDeepFn } from "./schema";
import { bfs, dfs } from "./search";

export interface SearchCloneRequest<T = unknown, P = unknown> {
  target: T;
  payload: P;
}

export interface SearchCloneResponse<T = unknown, P = unknown> {
  cloned: T;
  payload: P;
}

export interface SearchCloneDeepPlugin<
  T extends object,
  P = undefined,
  Data = unknown
> {
  /**
   * The name of plugin, also plugin id.
   */
  name: string;
  /**
   * The filter function to filter plugin inputs.
   */
  filter: TypeGuard<object, T>;
  /**
   * Determine how to create a cloned object.
   * A target object can be only created once.
   * Call the `skip` terminator function to tell that this plugin cannot create a curresponding new object.
   * @param original original object
   * @param skip terminator
   */
  createObject?(original: T, skip: Terminator): T;
  /**
   * Determine how toclone deep the data of object.
   * If the plugin does not make contribution to get data of an object, just return an empty array.
   * @param original original object
   */
  enumerateDataToClone?(original: T): Iterable<SearchCloneRequest<Data, P>>;
  /**
   * Determin how to connect the deep cloned data to the new object.
   * @param newObject cloned new object
   * @param response cloned data and previous clone request payload
   */
  connectClonedData?(
    newObject: T,
    response: SearchCloneResponse<Data, P>
  ): void;
}

type GeneralCloneDeepPlugin = SearchCloneDeepPlugin<object, unknown>;

export class CloneDeepBuilder {
  #searchAlgorithm: typeof bfs | typeof dfs = bfs;
  #plugins = new Map<string, GeneralCloneDeepPlugin>();
  constructor() {
    Object.freeze(this);
    sealedConstruct(CloneDeepBuilder, new.target);
  }
  withSearch(search: "bfs" | "dfs") {
    switch (search) {
      case "bfs":
        this.#searchAlgorithm = bfs;
        break;
      case "dfs":
        this.#searchAlgorithm = dfs;
        break;
    }
    return this;
  }
  withPlugin(plugin: GeneralCloneDeepPlugin) {
    if (this.#plugins.has(plugin.name)) {
      return die("Duplicated plugin name.");
    }
    this.#plugins.set(plugin.name, plugin);
    return this;
  }
  #createSkip() {
    const obj = {
      skipped: false,
      skip: () => {
        obj.skipped = true;
        return die();
      },
    };
    return obj;
  }
  build(): CloneDeepFn {
    interface InternalCloneRequest {
      type:
        | "root"
        | {
            from: object;
            plugin: GeneralCloneDeepPlugin;
          };
      cloneRequest: SearchCloneRequest;
    }

    interface InternalConnectContext {
      request: InternalCloneRequest;
      response: SearchCloneResponse;
    }
    const snapshot = {
      search: this.#searchAlgorithm,
      plugins: [...this.#plugins.values()].reverse(),
    };
    const pluginError = (plugin: GeneralCloneDeepPlugin, message: string) =>
      die(`Error with clone deep plugin "${plugin.name}": ${message}`);
    return <T extends unknown>(value: T): T => {
      const clonedMapping = new WeakMap<
        object,
        {
          clonedObject: object;
          enumerated: boolean;
        }
      >();
      const iterator = snapshot.search<
        InternalCloneRequest,
        InternalConnectContext
      >(
        { cloneRequest: { target: value, payload: undefined }, type: "root" },
        function* (internalReq) {
          const target = internalReq.cloneRequest.target;
          if (!isObjectLike(target)) {
            return;
          }
          const existingRecord = clonedMapping.get(target);
          if (existingRecord) {
            if (existingRecord.enumerated) {
              return;
            }
            existingRecord.enumerated = true;
          }
          for (const plugin of snapshot.plugins) {
            if (!plugin.filter(target)) {
              continue;
            }
            const enumerated = plugin.enumerateDataToClone?.(target) ?? [];
            for (const request of enumerated) {
              yield {
                cloneRequest: request,
                type: {
                  plugin,
                  from: target,
                },
              };
            }
          }
        },
        (internalReq) => {
          const createWith = (cloned: unknown): InternalConnectContext => {
            return {
              request: internalReq,
              response: Object.freeze({
                cloned,
                get payload() {
                  return internalReq.cloneRequest.payload;
                },
              }),
            };
          };
          const raw = internalReq.cloneRequest.target;
          if (!isObjectLike(raw)) {
            return createWith(raw);
          }
          const existingRecord = clonedMapping.get(raw);
          if (existingRecord) {
            return createWith(existingRecord.clonedObject);
          }
          for (const plugin of snapshot.plugins) {
            if (
              typeof plugin.createObject !== "function" ||
              !plugin.filter(raw)
            ) {
              continue;
            }
            const skipper = this.#createSkip();
            try {
              const cloned = plugin.createObject(raw, skipper.skip);
              if (!isObjectLike(cloned)) {
                return pluginError(
                  plugin,
                  "Method `createObject` must return a non-primitive value."
                );
              }
              clonedMapping.set(raw, {
                clonedObject: cloned,
                enumerated: false,
              });
              return createWith(cloned);
            } catch (error) {
              if (skipper.skipped) {
                continue;
              }
              throw error;
            }
          }
          return die(
            `Cannot find a plugin that can create a copy for this object: ${Object.prototype.toString.call(
              raw
            )}`
          );
        }
      );
      let result: unknown = null;
      for (
        let iteration = iterator.next();
        !iteration.done;
        iteration = iterator.next()
      ) {
        const {
          request: { type },
          response,
        } = iteration.value;
        if (type === "root") {
          result = response.cloned;
          continue;
        }
        type.plugin.connectClonedData?.(
          clonedMapping.get(type.from)!.clonedObject,
          response
        );
      }
      // @ts-expect-error not type safe
      return result;
    };
  }
}

Freeze(CloneDeepBuilder);
interface JSONCloneDeepPluginPayload {
  descriptor: PropertyDescriptor;
  key: PropertyKey;
}
/**
 * The json clone deep plugin only supports：
 * Array (prototype === `Array.prototype`)
 * Simple object (prototype === `null` || prototype === `Object.prototype`)
 * With this plugin only, you can just clone where `JSON.parse(JSON.stringify(obj))` can!
 */
export class JSONCloneDeepPlugin
  implements SearchCloneDeepPlugin<object, JSONCloneDeepPluginPayload>
{
  name = "json";
  filter: TypeGuard<object, object> = isObjectLike;
  createObject(original: object, skip: Terminator): object {
    const prototype: unknown = Object.getPrototypeOf(original);
    if (Array.isArray(original) && prototype === Array.prototype) {
      return [];
    }
    if (prototype === Object.prototype || prototype === null) {
      return Object.create(prototype);
    }
    return skip();
  }
  *enumerateDataToClone(
    original: object
  ): Iterable<SearchCloneRequest<unknown, JSONCloneDeepPluginPayload>> {
    const descriptorMap = Object.getOwnPropertyDescriptors(original);
    for (const key of Reflect.ownKeys(descriptorMap)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const descriptor: PropertyDescriptor = Reflect.get(descriptorMap, key);
      if (descriptor.get || descriptor.set) {
        // Computed props are skipped.
        continue;
      }
      yield {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        target: Reflect.get(original, key),
        payload: {
          descriptor,
          key,
        },
      };
    }
  }
  connectClonedData(
    newObject: object,
    clonedData: SearchCloneResponse<unknown, JSONCloneDeepPluginPayload>
  ): void {
    Object.defineProperty(newObject, clonedData.payload.key, {
      ...clonedData.payload.descriptor,
      value: clonedData.cloned,
    });
  }
}

/**
 * In addition to the json plugin, this plugin includes user defined class.
 * Any instance of the constructors on global object will not be considered.
 */
export class CustomClassCloneDeepPlugin extends JSONCloneDeepPlugin {
  override name = "custom class";
  #builtinConstructors = (() => {
    const globalObject = getGlobal();
    return new Set(
      Object.getOwnPropertyNames(
        Object.getOwnPropertyDescriptors(globalObject)
      ).reduce<Function[]>((acc, name) => {
        const fn: unknown = Reflect.get(globalObject, name);
        if (typeof fn === "function" && capitalize(name) === name) {
          acc.push(fn);
        }
        return acc;
      }, [])
    );
  })();
  override createObject(original: object, skip: Terminator): object {
    const prototype: unknown = Object.getPrototypeOf(original);
    if (
      isObjectLike(prototype) &&
      !this.#builtinConstructors.has(prototype.constructor)
    ) {
      return Object.create(prototype);
    }
    return super.createObject(original, skip);
  }
}

export class DateCloneDeepPlugin implements SearchCloneDeepPlugin<Date> {
  name = "date";
  filter: TypeGuard<object, Date> = hasPrototypeConstructor(Date);
  createObject(original: Date): Date {
    return new Date(original);
  }
}

export class SetCloneDeepPlugin implements SearchCloneDeepPlugin<Set<unknown>> {
  name = "set";
  filter: TypeGuard<object, Set<unknown>> = hasPrototypeConstructor(Set);
  createObject() {
    return new Set();
  }
  *enumerateDataToClone(
    original: Set<unknown>
  ): Iterable<SearchCloneRequest<unknown, undefined>> {
    for (const item of Set.prototype.values.call(original)) {
      yield {
        target: item,
        payload: undefined,
      };
    }
  }
  connectClonedData(
    newObject: Set<unknown>,
    response: SearchCloneResponse<unknown, undefined>
  ): void {
    newObject.add(response.cloned);
  }
}

interface MapCloneDeepPluginPayload {
  entry: [unknown, unknown];
  map: WeakMap<[unknown, unknown], unknown>;
}
export class MapCloneDeepPlugin
  implements
    SearchCloneDeepPlugin<Map<unknown, unknown>, MapCloneDeepPluginPayload>
{
  name = "map";
  filter: TypeGuard<object, Map<unknown, unknown>> =
    hasPrototypeConstructor(Map);
  createObject(): Map<unknown, unknown> {
    return new Map();
  }
  *enumerateDataToClone(
    original: Map<unknown, unknown>
  ): Iterable<SearchCloneRequest<unknown, MapCloneDeepPluginPayload>> {
    const map: MapCloneDeepPluginPayload["map"] = new WeakMap();
    for (const entry of Map.prototype.entries.call(original)) {
      const convert: [unknown, unknown] = entry;
      const [k, v] = convert;
      yield {
        target: k,
        payload: {
          entry,
          map,
        },
      };
      yield {
        target: v,
        payload: {
          entry,
          map,
        },
      };
    }
  }
  connectClonedData(
    newObject: Map<unknown, unknown>,
    response: SearchCloneResponse<unknown, MapCloneDeepPluginPayload>
  ): void {
    const { cloned, payload } = response;
    const { entry, map } = payload;
    if (map.has(entry)) {
      const stored = map.get(entry);
      newObject.set(stored, cloned);
    } else {
      map.set(entry, cloned);
    }
  }
}
