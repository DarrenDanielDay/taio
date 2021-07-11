export type Promisify<T> = T extends PromiseLike<unknown> ? T : Promise<T>;
export type UnPromisefy<T> = T extends PromiseLike<infer R>
  ? UnPromisefy<R>
  : T;
