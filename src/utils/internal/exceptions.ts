export function die(message?: string): never {
  throw new Error(message);
}

export function invalidOperation(message?: string) {
  return die(`Invalid Operation: ${message}`);
}

export function illegalState(message?: string) {
  return die(`Illegal State: ${message}`);
}
