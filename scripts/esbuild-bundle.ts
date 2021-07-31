import * as esbuild from "esbuild";
import * as glob from "glob";
esbuild.buildSync({
  tsconfig: "./tsconfig.json",
  entryPoints: [...glob.sync("src/**/*.ts")],
  sourcemap: true,
  outdir: "build",
});
