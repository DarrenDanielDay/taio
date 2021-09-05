import type { AccessByPath, AccessPaths } from "../../../types/object";

export function access<T, Path extends AccessPaths<T>>(
  obj: T,
  path: Path
): AccessByPath<T, Path> {
  let result: unknown = obj;
  for (const key of path as PropertyKey[]) {
    // @ts-expect-error result and key cannot be inferred.
    result = Reflect.get(result, key);
  }
  // @ts-expect-error result and key cannot be inferred.
  return result;
}
