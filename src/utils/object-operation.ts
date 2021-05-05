import { WithoutKey } from "../types/converts";

export type PropertyConfig = WithoutKey<
  PropertyDescriptor,
  "get" | "set" | "value"
>;

export function overwriteDescriberConfig(
  overwrite: PropertyConfig | undefined,
  descriptor: PropertyDescriptor
) {
  if (overwrite) {
    typeof overwrite.configurable === "boolean" &&
      (descriptor.configurable = overwrite.configurable);
    typeof overwrite.enumerable === "boolean" &&
      (descriptor.enumerable = overwrite.enumerable);
    typeof overwrite.writable === "boolean" &&
      (descriptor.writable = overwrite.configurable);
  }
  return descriptor;
}
