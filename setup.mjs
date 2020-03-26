import { execFileSync } from "child_process";
import {
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
  fstatSync
} from "fs";
import { basename } from "path";
function start() {
  const packageName = basename(process.cwd());
  for (let filename of readdirSync(".")) {
    if (filename === "setup.mjs") {
      continue;
    }

    const stat = fstatSync(filename);
    if (stat.isDirectory()) {
      continue;
    }

    let fileContent = readFileSync(filename, "utf8");
    fileContent = fileContent.replace(/__package_name__/g, packageName);
    unlinkSync(filename);
    filename = filename.replace(/__package_name__/g, packageName);
    writeFileSync(filename, fileContent);
  }

  execFileSync("npm", [
    "install",
    "--save-dev",
    "codecov",
    "eslint",
    "nyc",
    "prettier",
    "testami"
  ]);

  execFileSync("npm", ["test"]);
}

start();
