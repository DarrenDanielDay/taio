import * as esbuild from "esbuild";
import * as glob from "glob";
const commonConfig: esbuild.BuildOptions = {
  tsconfig: "./tsconfig.json",
  entryPoints: [...glob.sync("src/**/*.ts")],
  sourcemap: true,
  outdir: "build",
};
esbuild.buildSync({
  ...commonConfig,
  format: "esm",
  outExtension: {
    ".js": ".mjs",
  },
});
esbuild.buildSync({
  ...commonConfig,
  format: "cjs",
  outExtension: {
    ".js": ".cjs",
  },
});
esbuild.buildSync({
  ...commonConfig,
  format: "cjs",
});
