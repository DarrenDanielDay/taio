import { identity } from "../../../libs/custom/functions/identity";
import type { JSONSchema } from "../interfaces/json-describer";

export const defineSchema: <Schema extends JSONSchema>(
  schema: Schema
) => Schema = identity;
