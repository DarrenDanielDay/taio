export const capitalize = <Str extends string>(s: Str): Capitalize<Str> =>
  // @ts-expect-error Template string
  `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;

export const uncapitalize = <Str extends string>(s: Str): Uncapitalize<Str> =>
  // @ts-expect-error Template string
  `${s.slice(0, 1).toLowerCase()}${s.slice(1)}`;

export const isNumberString = (s: string): boolean =>
  typeof s === "string" && !!s && +s === +s;
