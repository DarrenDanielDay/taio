import fs from "fs";
import path from "path";
import child_process from "child_process";
const cwd = process.cwd();
async function main() {
  console.log(cwd);
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(cwd, "package.json")).toString("utf-8")
  ) as {
    dependencies: { [key: string]: string };
    devDependencies: { [key: string]: string };
  };
  const dependencies = Object.keys(packageJson.dependencies ?? {});
  const devDependencies = Object.keys(packageJson.devDependencies ?? {});
  const ds = dependencies.join(" ");
  const devs = devDependencies.join(" ");
  return new Promise<void>((resolve, reject) => {
    const remove = `yarn remove ${ds} ${devs}`;
    const install = `${ds.length ? `yarn add ${ds}\n` : ""}${
      devs.length ? `yarn add -D ${devs}` : ""
    }`;
    child_process.exec(remove, { cwd }, (err) => {
      if (err) {
        reject(err);
      } else {
        child_process.exec(install, { cwd }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    console.log("Update package script done.");
  });
