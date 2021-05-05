export function die(message?: string): never {
  throw new Error(message);
}

export function invalidOperation(message?: string): never {
  return die(`Invalid Operation: ${message}`);
}

export function illegalState(message?: string): never {
  return die(`Illegal State: ${message}`);
}
