/**
 * short for `JSON.parse(JSON.stringify(value))`
 * @param value json input
 * @returns cloned json value
 */
export const cloneJSONDeep = <T extends unknown>(value: T): T =>
  JSON.parse(JSON.stringify(value));
