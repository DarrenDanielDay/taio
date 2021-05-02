import child_process from "child_process";
const fs: typeof import("fs/promises") = require("fs").promises;
import path from "path";
const folders = ["./build", "./dev-build", "./node_modules"];
const args = process.argv;

async function forceRemove(folder: string): Promise<void> {
  return fs.rm(folder, { recursive: true, force: true }).catch((e) => {
    console.error(`❌ remove ${folder} failed:`, e);
  });
}

const toRemove = new Set<string>();
function collect(p: string) {
  toRemove.add(path.resolve(p));
}

async function main() {
  folders.forEach((folder) => collect(folder));
  if (args.includes("--git")) {
    await new Promise<void>((resolve, reject) => {
      child_process.exec(
        `
git clean -f
git stash --include-untracked
git stash drop stash@{0}
`,
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }
  await Promise.all([...toRemove].map((p) => forceRemove(p)));
}
main().finally(() => {
  console.log("🧹clean script finished.");
});
