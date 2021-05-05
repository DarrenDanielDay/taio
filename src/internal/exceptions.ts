export function die(message?: string): never {
  throw new Error(message);
}

export function invalidOperation(message?: string): never {
  return die(`Invalid operation: ${message}`);
}

export function illegalState(message?: string): never {
  return die(`Illegal state: ${message}`);
}
