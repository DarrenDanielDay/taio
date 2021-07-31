export interface StandardEnum<T> {
  [name: string]: T | string;
  [id: number]: string;
}
export type EnumUnderlayingType = number | string;
