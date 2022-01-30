import { promisify } from "util";
import { exec, type ExecOptions } from "child_process";
import { resolve } from "path";
import { readFile } from "fs/promises";
const cwd = process.cwd();
const execAsync = promisify(exec);
try {
  const packageJson = JSON.parse(
    (await readFile(resolve(cwd, "package.json"))).toString("utf-8")
  ) as {
    dependencies: Record<string, string> | undefined;
    devDependencies: Record<string, string> | undefined;
  };
  const dependencies = Object.keys(packageJson.dependencies ?? {});
  const devDependencies = Object.keys(packageJson.devDependencies ?? {});
  const ds = dependencies.join(" ");
  const devs = devDependencies.join(" ");
  const remove = (ds || devs) && `yarn remove ${ds} ${devs}`;
  const addDep = ds ? `yarn add ${ds}\n` : "";
  const addDevDep = devs ? `yarn add -D ${devs}` : "";
  const config: ExecOptions = { cwd };
  for (const command of [remove, addDevDep, addDep]) {
    if (command) {
      await execAsync(command, config);
    }
  }
} catch (err) {
  console.error(err);
} finally {
  console.log("Update package script done.");
}
