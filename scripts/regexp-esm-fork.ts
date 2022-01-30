import { readFile, writeFile } from "fs/promises";
import glob from "glob";
import { join, parse } from "path";
import { promisify } from "util";
const maybeMissingSuffix = ".mjs";
const sourceFiles = await promisify(glob)("src/**/*.ts");
await Promise.all(
  sourceFiles.map(async (file) => {
    const { base, dir } = parse(file);
    const newName = base.replace(".ts", ".mts");
    const newFile = join(dir, newName);
    const originalCode = (await readFile(file)).toString("utf-8");
    await writeFile(
      newFile,
      originalCode.replace(
        /import (.*?) from "(.*?)"/gms,
        (_, items, originalImportPath: string) => {
          const newImportPath = `${originalImportPath}${
            originalImportPath.endsWith(maybeMissingSuffix)
              ? ""
              : maybeMissingSuffix
          }`;
          return `import ${items} from "${newImportPath}"`;
        }
      )
    );
  })
);
