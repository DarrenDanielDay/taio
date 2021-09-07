export function capitalize<Str extends string>(s: Str): Capitalize<Str> {
  // @ts-expect-error Template string
  return `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
}

export function uncapitalize<Str extends string>(s: Str): Uncapitalize<Str> {
  // @ts-expect-error Template string
  return `${s.slice(0, 1).toLowerCase()}${s.slice(1)}`;
}

export function isNumberString(s: string): boolean {
  return typeof s === "string" && !!s && +s === +s;
}
