import type { AnyParams } from "../../../types/array";

export const argument = <P extends AnyParams>(...args: P) => args;
