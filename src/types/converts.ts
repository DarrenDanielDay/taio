export type WithoutKey<T, K extends keyof T> = Omit<T, K>;
