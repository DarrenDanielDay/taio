export function typed<T>(obj: T): T {
  return obj;
}

export function noop() {
  /**
   * Do nothing.
   */
}

export function createNoop() {
  return function noop() {
    /**
     * Do nothing.
     */
  };
}
