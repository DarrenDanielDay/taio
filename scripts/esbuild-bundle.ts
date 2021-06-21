import * as esbuild from "esbuild";
import * as glob from "glob";
esbuild.buildSync({
  tsconfig: "./tsconfig.json",
  bundle: true,
  entryPoints: [...glob.sync("src/**/index.ts")],
  outdir: "esbuild",
});
