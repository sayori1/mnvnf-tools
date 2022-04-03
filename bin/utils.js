import fs from "fs";
import path from "path";
import replace from "replace";
import prettier from "prettier";

function renameFilesAndDirs(dir, from, to) {
  function throughDir(dir) {
    fs.readdirSync(dir).forEach((File) => {
      const absolute = path.join(dir, File);
      const newPath = path.join(
        path.dirname(absolute),
        path.basename(absolute).replace(from, to)
      );

      fs.renameSync(absolute, newPath);

      if (fs.statSync(newPath).isDirectory()) throughDir(newPath);
    });
  }
  throughDir(dir);
}

function replaceMany(toReplace, dir) {
  for (let key in toReplace) {
    replace({
      regex: key,
      replacement: toReplace[key],
      recursive: true,
      paths: [dir],
    });
  }
}

function prettierMany(dir) {
  function throughDir(dir) {
    fs.readdirSync(dir).forEach((File) => {
      const absolute = path.join(dir, File);

      if (fs.statSync(absolute).isDirectory()) throughDir(absolute);
      else
        fs.readFile(absolute, "utf8", function (err, data) {
          fs.writeFile(
            absolute,
            prettier.format(data, {
              arrowParens: "always",
              bracketSpacing: true,
              endOfLine: "lf",
              htmlWhitespaceSensitivity: "css",
              insertPragma: false,
              jsxBracketSameLine: false,
              jsxSingleQuote: false,
              printWidth: 80,
              proseWrap: "preserve",
              quoteProps: "as-needed",
              requirePragma: false,
              semi: true,
              singleQuote: false,
              tabWidth: 2,
              trailingComma: "es5",
              useTabs: false,
              vueIndentScriptAndStyle: false,
              parser: "typescript",
            }),
            "utf8",
            function (err) {}
          );
        });
    });
  }
  throughDir(dir);
}
export default { renameFilesAndDirs, replaceMany, prettierMany };
