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
  nestOptional,
} from "../inquirer.js";

async function createNestProject(name, modulesToCreate, optional) {
  await fse.copy(paths.nestProject, paths.currentDir + `/${name}`);

  if (optional) {
    await addNestAdditionalModules(optional.auth_module, optional.file_module);
    if (optional.auth_module) {
      modulesToCreate.push({ name: "auth", modulesToCreate: [] });
      modulesToCreate.push({ name: "users", modulesToCreate: [] });
    }
    if (optional.file_module)
      modulesToCreate.push({ name: "file", modulesToCreate: [] });
  }

  let appModules = "";
  let appImports = "";
  process.chdir(paths.currentDir + `/${name}/src`);
  if (modulesToCreate.length != []) {
    for (let module of modulesToCreate) {
      await createNestModule(module.name, module.modelsToCreate);

      let Name = utils.capitalize(module.name);
      appModules += `${Name}Module,\n`;
      appImports += `import { ${Name}Module } from "./${module.name}/${module.name}.module";\n`;
    }
    utils.replaceMany(
      { "{app-modules}": appModules, "{app-imports}": appImports },
      paths.currentDir + `/${name}`
    );
  }
}
async function createNestProjectCli() {
  let ret = await createNestProjectInquirer();
  await createNestProject(ret.name, ret.modulesToCreate, ret.optional);
}
helper.commands.command(
  "nest-create",
  "Create nest project",
  () => {},
  (args) => {
    createNestProjectCli();
  }
);

function generateCode(module, model) {
  let Module = utils.capitalize(module);
  let Model = utils.capitalize(model);

  let data = fs.readFileSync(paths.nestMethodsController);
  let controller = data.toString();
  data = fs.readFileSync(paths.nestMethodsService);
  let service = data.toString();

  controller.replace("{model}", model);
  controller.replace("{Model}", Model);
  controller.replace("{Module}", Module);
  for (var i = 0; i < 10; i += 1)
    controller = controller.replace("{module}", module); //analog of replaceAll

  return { controller, service };
}

async function createNestModule(name, modelsToCreate = []) {
  const dir = process.cwd() + `/${name}`;
  await fse.copy(paths.nestModule, dir);

  let toReplace = {
    "{module}": name,
    "{Module}": name[0].toUpperCase() + name.substring(1),
  };
  utils.replaceMany(toReplace, dir);
  utils.renameFilesAndDirs(dir, "{module}", name);

  let prevPath = process.cwd();
  process.chdir(process.cwd() + `/${name}`);
  let moduleDeps = "";
  let serviceDeps = "";
  let serviceImports = "";
  let moduleImports = "";
  let controllerImports = "";
  let controllerCode = "";
  let serviceCode = "";

  if (modelsToCreate.length != []) {
    for (let model of modelsToCreate) {
      await createNestModel(model.name, model.propsToCreate);
      let Model = utils.capitalize(model.name);
      moduleDeps += `MongooseModule.forFeature([{ name: ${Model}.name, schema: ${Model}Schema }]),`;
      serviceDeps += `@InjectModel(${Model}.name) private ${model.name.toLowerCase()}Model: Model<${Model}Document>,`;
      serviceImports += `import { ${Model}, ${Model}Document } from './${model.name}Model/schema/${model.name}.schema';\n`;
      serviceImports += `import { Create${Model}Dto } from './${model.name}Model/dto/create-${model.name}.dto';\n`;
      controllerImports += `import { Create${Model}Dto } from './${model.name}Model/dto/create-${model.name}.dto';`;
      moduleImports += `import { ${Model}, ${Model}Schema } from "./${model.name}Model/schema/${model.name}.schema";\n`;
      let code = generateCode(name, model.name);
      controllerCode += code.controller;
      serviceCode += code.service;
    }
  }

  toReplace = {
    "{module-deps}": moduleDeps,
    "{service-deps}": serviceDeps,
    "{module-imports}": moduleImports,
    "{service-imports}": serviceImports,
    "{controller-imports}": controllerImports,
    "{controller-code}": controllerCode,
    "{service-code}": serviceCode,
  };

  utils.replaceMany(toReplace, dir);
  process.chdir(prevPath);
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

async function addNestAdditionalModules(auth_module, file_module) {
  if (auth_module) await fse.copy(paths.nestAuthModule, process.cwd());
  if (file_module) await fse.copy(paths.nestFileModule, process.cwd());
}
async function addNestAdditionalModulesCli() {
  let result = await nestOptional();
  await addNestAdditionalModules(result.auth_module, result.file_module);
  console.log(chalk.green("Modules added"));
}
helper.commands.command(
  "nest-additional-modules",
  "Add auth/guards module or file module",
  () => {},
  (args) => {
    addNestAdditionalModulesCli();
  }
);

export default { createNestProject, createNestModel, createNestModule };
