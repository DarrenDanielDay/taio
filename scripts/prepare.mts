import glob from "glob";
import { build } from "esbuild";
import { promisify } from "util";
const otherScripts = await promisify(glob)("scripts/*.ts");
await build({
  platform: "node",
  entryPoints: otherScripts,
  outdir: "./scripts-build",
  format: "esm",
  bundle: false,
  loader: {
    ".mts": "ts",
  },
  outExtension: {
    ".js": ".mjs",
  },
  absWorkingDir: process.cwd(),
});
