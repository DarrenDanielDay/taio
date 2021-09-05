import type { JSONSchema } from "../interfaces/json-describer";

export function defineSchema<Schema extends JSONSchema>(
  schema: Schema
): Schema {
  return schema;
}
