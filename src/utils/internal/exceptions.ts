export const die = (message?: string): never => {
  throw new Error(message);
};

export const invalidOperation = (message?: string) =>
  die(`Invalid Operation: ${message}`);

export const constructAbstractClass = (name: string) =>
  invalidOperation(`Cannot instantiate abstract class '${name}'`);

export const illegalState = (message?: string) =>
  die(`Illegal State: ${message}`);
