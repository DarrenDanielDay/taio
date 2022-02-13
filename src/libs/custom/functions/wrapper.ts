export const always =
  <T extends unknown>(value: T) =>
  () =>
    value;
export const T = always(true as const);
export const F = always(false);
