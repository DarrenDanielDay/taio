import * as util from "util";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
const cwd = process.cwd();
async function main() {
  console.log(cwd);
  const packageJson = JSON.parse(
    (
      await util.promisify(fs.readFile)(path.resolve(cwd, "package.json"))
    ).toString("utf-8")
  ) as {
    dependencies: Record<string, string> | undefined;
    devDependencies: Record<string, string> | undefined;
  };
  const dependencies = Object.keys(packageJson.dependencies ?? {});
  const devDependencies = Object.keys(packageJson.devDependencies ?? {});
  const ds = dependencies.join(" ");
  const devs = devDependencies.join(" ");
  const exec = util.promisify(child_process.exec);
  const remove = (ds || devs) && `yarn remove ${ds} ${devs}`;
  const addDep = ds ? `yarn add ${ds}\n` : "";
  const addDevDep = devs ? `yarn add -D ${devs}` : "";
  const config: child_process.ExecOptions = { cwd };
  remove && (await exec(remove, config));
  addDevDep && (await exec(addDevDep, config));
  addDep && (await exec(addDep, config));
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    console.log("Update package script done.");
  });
