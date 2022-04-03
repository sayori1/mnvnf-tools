import fs from "fs";
import fse from "fs-extra";
import helper from "../helper.js";
import paths from "../paths.js";
import inquirer from "inquirer";
import chalk from "chalk";
import replace from "replace";
import utils from "../utils.js";
import process from "process";

import {
  createNestModelInquirer,
  createNestModuleInquirer,
} from "../inquirer.js";

function createNestProject() {
  fse.copy(paths.nestProject, paths.currentDir + "/backend", function (err) {
    if (err) {
      {
        overwrite: true;
      }
    } else {
      console.log("success!");
    }
  });
}
helper.commands.command(
  "nest-create",
  "Create nest project",
  () => {},
  (args) => {
    createNestProject();
  }
);

async function createNestModule(name, modelsToCreate = []) {
  const dir = paths.currentDir + `/${name}`;

  let toReplace = {
    "{module}": name,
    "{Module}": name[0].toUpperCase() + name.substring(1),
  };

  await fse.copy(paths.nestModule, dir);
  utils.replaceMany(toReplace, dir);
  utils.renameFilesAndDirs(dir, "{module}", name);

  process.chdir(process.cwd() + `/${name}`);
  let moduleDeps = "";
  let serviceDeps = "";

  if (modelsToCreate.length != []) {
    for (let model of modelsToCreate) {
      await createNestModel(model.name, model.propsToCreate);
      moduleDeps += `
        MongooseModule.forFeature([{ name: ${model.name}.name, schema: ${model.name}Schema }]),`;
      serviceDeps += `
      @InjectModel(${
        model.name
      }.name) private ${model.name.toLowerCase()}Model: Model<${
        model.name
      }Document>,
      `;
    }
  }

  toReplace = {
    "{module-deps}": moduleDeps,
    "{service-deps}": serviceDeps,
  };

  utils.replaceMany(toReplace, dir);
  utils.prettierMany(dir);
}
async function createNestModuleCli() {
  let ret = await createNestModuleInquirer();
  await createNestModule(ret.name, ret.modelsToCreate);
}
helper.commands.command(
  "nest-create-module",
  "Create nest module",
  () => {},
  (args) => {
    createNestModuleCli();
  }
);

async function createNestModel(name, propsToCreate) {
  const dir = paths.currentDir + `/${name}`;

  let props = "";
  let dto_props = "";
  for (let prop of propsToCreate) {
    let name = prop.split(":")[0].trim();
    let type = prop.split(":")[1].trim();
    let typeName = type.split("[")[0];

    let isArray = type.endsWith("[]");
    let isPrimitive = ["number", "string", "number[]", "string[]"].includes(
      type
    );

    let mongoose = ``;
    if (!isPrimitive) {
      if (isArray)
        mongoose = `{type: [{ type: mongoose.Schema.Types.ObjectId, ref: '${typeName}', default: [] }]}`;
      else
        mongoose = `{type: mongoose.Schema.Types.ObjectId, ref: '${typeName}'}`;
    }

    props += `@Prop(${mongoose})\n${name} : ${type};\n\n`;
    dto_props += `readonly ${name};\n`;
  }

  let toReplace = {
    "{model}": name,
    "{Model}": name[0].toUpperCase() + name.substring(1),
    "{props}": props,
    "{dto-props}": dto_props,
  };

  fse.copy(paths.nestModel, dir, function (err) {
    if (!err) {
      utils.replaceMany(toReplace, dir);
      utils.renameFilesAndDirs(dir, "{model}", name);
      utils.prettierMany(dir);
      console.log(chalk.green("Succesfuly generated!"));
    }
  });
}
async function createNestModelCli() {
  let ret = await createNestModelInquirer();
  return await createNestModel(ret.name, ret.propsToCreate);
}
helper.commands.command(
  "nest-create-model [module name]",
  "Create nest model",
  () => {},
  (args) => {
    createNestModelCli();
  }
);
export default { createNestProject };
