import { readdir, stat, writeFile } from "fs/promises";
import { join, parse, resolve } from "path";
const src = "src";
const index = "index";
const indexTS = "index.ts";
async function main() {
  const srcFolder = resolve(process.cwd(), src);
  await generateIndex(srcFolder);
}

function toPascalCase(kebabCase: string): string {
  return kebabCase
    .split("-")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join("");
}

async function generateIndex(folder: string) {
  const children = await readdir(folder);
  const stats = await Promise.all(
    children.map(async (child) => {
      const absPath = join(folder, child);
      const childStat = await stat(absPath);
      const fileName = parse(child).name;
      return {
        stat: childStat,
        absPath,
        importName: toPascalCase(fileName),
        importPath: childStat.isDirectory()
          ? `./${fileName}/${index}`
          : `./${fileName}`,
      };
    })
  );
  const subModules = stats.filter((dir) => !dir.absPath.endsWith(indexTS));
  const starredImports = subModules
    .map((subModule) => {
      return `import * as ${subModule.importName} from "${subModule.importPath}";`;
    })
    .join("\n");
  const moduleNames = `{ ${subModules
    .map((subModule) => subModule.importName)
    .join(", ")} }`;
  const namedExports = `export ${moduleNames}`;
  const defaultExport = `export default ${moduleNames}`;
  await writeFile(
    join(folder, indexTS),
    `${starredImports}
${namedExports}
${defaultExport}`
  );
  await Promise.all(
    children.map(async (dir) => {
      const target = join(folder, dir);
      const targetStat = await stat(target);
      if (targetStat.isDirectory()) {
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
