import type { Nullish } from "../../../types/common";
import type { EnumUnderlayingType, StandardEnum } from "../../../types/enum";

export type JSONSchema =
  | JSONArraySchema
  | JSONBooleanSchema
  | JSONEnumSchema
  | JSONLiteralSchema
  | JSONNullSchema
  | JSONNumberSchema
  | JSONObjectSchema
  | JSONStringSchema
  | JSONTupleSchema
  | JSONUnionSchema;

export interface BaseSchema {
  description?: string;
}

export interface JSONStringSchema extends BaseSchema {
  type: "string";
}

export interface JSONNumberSchema extends BaseSchema {
  type: "number";
}

export interface JSONBooleanSchema extends BaseSchema {
  type: "boolean";
}

export interface JSONNullSchema extends BaseSchema {
  type: "null";
}

export interface JSONLiteralSchema extends BaseSchema {
  type: "literal";
  value: unknown;
}

export interface JSONEnumSchema extends BaseSchema {
  type: "enum";
  enumObject: StandardEnum<EnumUnderlayingType>;
}

export interface JSONArraySchema extends BaseSchema {
  type: "array";
  item: JSONSchema;
}

export interface JSONTupleSchema extends BaseSchema {
  type: "tuple";
  items: readonly JSONSchema[];
}

export interface JSONObjectSchema extends BaseSchema {
  type: "object";
  fields: Record<string, JSONSchema>;
}

export interface JSONUnionSchema extends BaseSchema {
  type: "union";
  unions: readonly JSONSchema[];
}

export type CreateTypeBySchemaType<T extends JSONSchema> =
  T extends JSONStringSchema
    ? string
    : T extends JSONNumberSchema
    ? number
    : T extends JSONBooleanSchema
    ? boolean
    : T extends JSONNullSchema
    ? Nullish
    : T extends JSONLiteralSchema
    ? T["value"]
    : T extends JSONEnumSchema
    ? T["enumObject"] extends StandardEnum<infer E>
      ? E
      : never
    : T extends JSONArraySchema
    ? CreateTypeBySchemaType<T["item"]>[]
    : T extends JSONTupleSchema
    ? CreateTupleTypeBySchema<T["items"]>
    : T extends JSONObjectSchema
    ? CreateObjectTypeBySchema<T>
    : T extends JSONUnionSchema
    ? CreateTypeBySchemaType<T["unions"][number]>
    : never;

export type CreateTupleTypeBySchema<S extends readonly JSONSchema[]> = {
  -readonly [K in keyof S]: CreateTypeBySchemaType<Extract<S[K], JSONSchema>>;
};

export type CreateObjectTypeBySchema<T extends JSONObjectSchema> = {
  -readonly [K in keyof T["fields"]]: CreateTypeBySchemaType<T["fields"][K]>;
};
