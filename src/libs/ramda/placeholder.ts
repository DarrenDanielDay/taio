export const _$_: unique symbol = Symbol();
export type PlaceHolder = typeof _$_;
export function isPlaceHolder(value: unknown): value is PlaceHolder {
  return Object.is(value, _$_);
}
