import * as fs from "fs/promises";
import * as path from "path";
const src = "src";
const suffix = ".ts";
const index = "index.ts";
async function main() {
  const srcFolder = path.resolve(process.cwd(), src);
  await generateIndex(srcFolder);
}

function toPascalCase(kebabCase: string): string {
  return kebabCase
    .split("-")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join("");
}

async function generateIndex(folder: string) {
  const dirs = await fs.readdir(folder);
  const subModules = dirs.filter((dir) => !dir.endsWith(index));
  const starredImports = subModules
    .map((dirOrFile) => {
      const submoduleName = getModuleName(dirOrFile);
      return `import * as ${toPascalCase(
        submoduleName
      )} from "./${submoduleName}";`;
    })
    .join("\n");
  const moduleNames = `{ ${subModules
    .map((dirOrFile) => toPascalCase(getModuleName(dirOrFile)))
    .join(", ")} }`;
  const namedExports = `export ${moduleNames}`;
  const defaultExport = `export default ${moduleNames}`;
  await fs.writeFile(
    path.join(folder, index),
    `${starredImports}
${namedExports}
${defaultExport}`
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

  function getModuleName(dirOrFile: string) {
    return dirOrFile.replace(suffix, "");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => {
    console.log("Generate index script done.");
  });
