import * as fs from "fs/promises";
import * as glob from "glob";
import { promisify } from "util";
async function main() {
  const pattern = "src/**/index.ts";
  const files = await promisify(glob.glob)(pattern);
  await Promise.all(
    files.map((file) =>
      fs.rm(file).catch((error) =>
        console.error(`Remove ${file} failed:
${error}`)
      )
    )
  );
}

main().finally(() => {
  console.log("Index clean up finished.");
});
