// eslint-disable-next-line @typescript-eslint/naming-convention
export const _$_: unique symbol = Symbol();
export type Placeholder = typeof _$_;
export function isPlaceholder(value: unknown): value is Placeholder {
  return Object.is(value, _$_);
}
