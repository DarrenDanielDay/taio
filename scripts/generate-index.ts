import fs from "fs/promises";
import path from "path";
const src = "src";
const suffix = ".ts";
const index = "index.ts";
async function main() {
  const srcFolder = path.resolve(process.cwd(), src);
  await generateIndex(srcFolder);
}

function PascalCase(kebabCase: string): string {
  return kebabCase
    .split("-")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join("");
}

async function generateIndex(folder: string) {
  const dirs = await fs.readdir(folder);
  await fs.writeFile(
    path.join(folder, index),
    dirs
      .filter((dir) => !dir.endsWith(index))
      .map((dir) => {
        const submoduleName = dir.replace(suffix, "");
        return `export * as ${PascalCase(
          submoduleName
        )} from "./${submoduleName}"`;
      })
      .join("\n")
  );
  await Promise.all(
    dirs.map(async (dir) => {
      const target = path.join(folder, dir);
      const stat = await fs.stat(target);
      if (stat.isDirectory()) {
        await generateIndex(target);
      }
    })
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => {
    console.log("Generate index script done.");
  });
