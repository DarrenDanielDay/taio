import type { AnyConstructor } from "../types/concepts";
import type { OmitKey } from "../types/object";
import { invalidOperation } from "./internal/exceptions";

export type PropertyConfig = OmitKey<
  PropertyDescriptor,
  "get" | "set" | "value"
>;

export const overwriteDescriptorConfig = (
  overwrite: PropertyConfig | undefined,
  descriptor: PropertyDescriptor
): PropertyDescriptor => ({
  ...descriptor,
  configurable:
    typeof overwrite?.configurable === "boolean"
      ? overwrite.configurable
      : descriptor.configurable,
  enumerable:
    typeof overwrite?.enumerable === "boolean"
      ? overwrite.enumerable
      : descriptor.enumerable,
  writable:
    typeof overwrite?.writable === "boolean"
      ? overwrite.writable
      : descriptor.writable,
});

export const sealedConstruct = (
  target: AnyConstructor,
  newTarget: AnyConstructor | Function
) => {
  if (target !== newTarget) {
    invalidOperation("Cannot instantiate a subclass of a sealed class.");
  }
};
