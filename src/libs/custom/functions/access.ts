import type { AccessByPath, AccessPaths } from "../../../types/object";

export const access = <T, Path extends AccessPaths<T>>(
  obj: T,
  path: Path
): AccessByPath<T, Path> =>
  // @ts-expect-error result and key cannot be inferred.
  (path as PropertyKey[]).reduce((prev, key) => Reflect.get(prev, key), obj);
