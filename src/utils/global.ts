export const getGlobal = (): typeof globalThis => (0, eval)("this");
