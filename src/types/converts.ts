export type WithoutKey<T, K extends keyof T> = Omit<T, K>;
export type StringKey<T> = Extract<keyof T, string>;
