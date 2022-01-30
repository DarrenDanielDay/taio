import { type BuildOptions, build } from "esbuild";
import glob from "glob";
import { promisify } from "util";
import esm from "../tsconfig.prod.esm.json";
import cjs from "../tsconfig.prod.cjs.json";
const globAsync = promisify(glob);
const commonConfig: BuildOptions = {
  sourcemap: true,
};
await build({
  ...commonConfig,
  entryPoints: await globAsync("src/**/*.ts"),
  format: "cjs",
  outdir: cjs.compilerOptions.outDir,
});
await build({
  ...commonConfig,
  entryPoints: await globAsync("src/**/*.mts"),
  format: "esm",
  outdir: esm.compilerOptions.outDir,
  outExtension: {
    ".js": ".mjs",
  },
});
