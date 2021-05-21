export type StandardEnum<T> = {
  [name: string]: T | string;
  [id: number]: string;
};
