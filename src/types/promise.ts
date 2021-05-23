export type Promisify<T> = T extends Promise<unknown> ? T : Promise<T>;
export type UnPromisefy<T> = T extends Promise<infer R> ? UnPromisefy<R> : T;
