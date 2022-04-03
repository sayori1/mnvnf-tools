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
  createNestProjectInquirer,
} from "../inquirer.js";

async function createNestProject(name, modulesToCreate) {
  await fse.copy(paths.nestProject, paths.currentDir + `/${name}`);

  let appModules = "";
  let appImports = "";
  if (modulesToCreate.length != []) {
    process.chdir(paths.currentDir + `/${name}/src`);

    for (let module of modulesToCreate) {
      await createNestModule(module.name, module.modelsToCreate);

      let Name = utils.capitalize(module.name);
      appModules += `${Name}Module,`;
      appImports += `import { ${Name}Module } from "./${name}/${name}.module";\n`;
    }
    utils.replaceMany(
      { "{app-modules}": appModules, "{app-imports}": appModules },
      paths.currentDir + `/${name}`
    );
  }
}
async function createNestProjectCli() {
  let ret = await createNestProjectInquirer();
  await createNestProject(ret.name, ret.modulesToCreate);
  console.log(chalk.blue("Project succesfully generated!"));
  console.log(chalk.blue("make cd and call npm install"));
}
helper.commands.command(
  "nest-create",
  "Create nest project",
  () => {},
  (args) => {
    createNestProjectCli();
  }
);

async function createNestModule(name, modelsToCreate = []) {
  const dir = process.cwd() + `/${name}`;

  await fse.copy(paths.nestModule, dir);

  let toReplace = {
    "{module}": name,
    "{Module}": name[0].toUpperCase() + name.substring(1),
  };
  utils.replaceMany(toReplace, dir);
  utils.renameFilesAndDirs(dir, "{module}", name);

  process.chdir(process.cwd() + `/${name}`);
  let moduleDeps = "";
  let serviceDeps = "";
  let serviceImports = "";
  let moduleImports = "";

  if (modelsToCreate.length != []) {
    for (let model of modelsToCreate) {
      await createNestModel(model.name, model.propsToCreate);
      let Model = utils.capitalize(model.name);
      moduleDeps += `MongooseModule.forFeature([{ name: ${Model}.name, schema: ${Model}Schema }]),`;
      serviceDeps += `@InjectModel(${Model}.name) private ${model.name.toLowerCase()}Model: Model<${Model}Document>,`;
      serviceImports += `import { ${Model}, ${Model}Document } from './${model.name}Model/schema/${model.name}.schema';\n`;
      moduleImports += `import { ${Model}, ${Model}Schema } from "./${model.name}Model/schema/${model.name}.schema";\n`;
    }
  }

  toReplace = {
    "{module-deps}": moduleDeps,
    "{service-deps}": serviceDeps,
    "{module-imports}": moduleImports,
    "{service-imports": serviceImports,
  };

  utils.replaceMany(toReplace, dir);
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
  const dir = process.cwd() + `/${name}Model`;

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
      utils.replaceMany(toReplace, process.cwd());
      utils.renameFilesAndDirs(dir, "{model}", name);
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
export default { createNestProject, createNestModel, createNestModule };
