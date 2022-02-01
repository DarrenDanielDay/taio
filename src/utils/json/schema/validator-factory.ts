import { TypedObject } from "../../../libs/typescript/object";
import { die } from "../../internal/exceptions";
import { isArrayOf, isTupleOf, isUnionOf } from "../../validator/array";
import type { Validator } from "../../validator/common";
import { isEnumOf } from "../../validator/enum";
import { isObject } from "../../validator/object";
import { isNullish, primitiveOf } from "../../validator/primitive";
import { is } from "../../validator/utils";
import { isJSONLike } from "../core/is-json-like";
import type {
  CreateObjectTypeBySchema,
  CreateTypeBySchemaType,
  JSONObjectSchema,
  JSONSchema,
} from "../interfaces/json-describer";

const internalCreateValidatorBySchema = <Schema extends JSONSchema>(
  schema: Schema
): Validator<CreateTypeBySchemaType<Schema>> => {
  if (schema.type === "object") {
    type T = CreateObjectTypeBySchema<Extract<typeof schema, JSONObjectSchema>>;
    const entries = TypedObject.entries(schema.fields);
    type ValidatorOfT = {
      [K in keyof T]: Validator<T[K]>;
    };
    const obj = entries.reduce<Partial<ValidatorOfT>>(
      (acc, [key, subschema]) => {
        Reflect.set(acc, key, internalCreateValidatorBySchema(subschema));
        return acc;
      },
      {}
    );
    // @ts-expect-error Dynamic impl
    return isObject(obj);
  }
  if (schema.type === "array") {
    // @ts-expect-error Dynamic impl
    return isArrayOf(internalCreateValidatorBySchema(schema.item));
  }
  if (schema.type === "tuple") {
    // @ts-expect-error Dynamic impl
    return isTupleOf(...schema.items.map(internalCreateValidatorBySchema));
  }
  if (schema.type === "enum") {
    // @ts-expect-error Dynamic impl
    return isEnumOf(schema.enumObject);
  }
  if (schema.type === "null") {
    // @ts-expect-error Dynamic impl
    return isNullish;
  }
  if (schema.type === "literal") {
    // @ts-expect-error Dynamic impl
    return is(schema.value);
  }
  if (schema.type === "union") {
    return isUnionOf(...schema.unions.map(internalCreateValidatorBySchema));
  }
  // @ts-expect-error Dynamic impl
  return primitiveOf(schema.type);
};

export const createValidatorBySchema = <Schema extends JSONSchema>(
  schema: Schema
): Validator<CreateTypeBySchemaType<Schema>> => {
  if (!isJSONLike(schema)) {
    return die("Invalid JSON Schema.");
  }
  return internalCreateValidatorBySchema(schema);
};
