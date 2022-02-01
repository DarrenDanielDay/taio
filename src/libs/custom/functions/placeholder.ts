import { is } from "../../../utils/validator/utils";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _$_: unique symbol = Symbol();
export type Placeholder = typeof _$_;
export const isPlaceholder = is(_$_);
