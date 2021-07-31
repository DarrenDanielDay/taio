import type { InitialOptionsTsJest } from "ts-jest/dist/types";
import { defaults as tsjPreset } from "ts-jest/presets";
const config: InitialOptionsTsJest = {
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  transform: {
    ...tsjPreset.transform,
  },
  testMatch: [process.cwd() + "/tests/**/?(*.)+(spec|test).[jt]s?(x)"],
};
export default config;
