import chalk from "chalk";
import inquirer from "inquirer";

export async function createNestProjectInquirer() {
  console.log(chalk.green("Generating Nest project..."));

  let { name } = await inquirer.prompt({
    message: "Let's name the project: ",
    name: "name",
  });

  let modulesToCreate = [];
  while (true) {
    let { answer } = await inquirer.prompt({
      message: "create new module y/n?",
      name: "answer",
    });
    if (answer == "n") break;
    if (answer == "y") modulesToCreate.push(await createNestModuleInquirer());
  }

  return { name, modulesToCreate };
}

export async function createNestModuleInquirer() {
  console.log(chalk.green("Generating Nest module..."));

  let { name } = await inquirer.prompt({
    message: "Let's name the module: ",
    name: "name",
  });

  let modelsToCreate = [];
  while (true) {
    let { answer } = await inquirer.prompt({
      message: "create new model y/n?",
      name: "answer",
    });
    if (answer == "n") break;
    if (answer == "y") modelsToCreate.push(await createNestModelInquirer());
  }

  return { name, modelsToCreate };
}

export async function createNestModelInquirer() {
  console.log(chalk.green("Generating Nest model..."));

  let { name } = await inquirer.prompt({
    message: "Let's name the model: ",
    name: "name",
  });

  let propsToCreate = [];
  while (true) {
    let { answer } = await inquirer.prompt({
      message: "create new prop [name: type] or no",
      name: "answer",
    });
    if (answer == "no") break;
    else propsToCreate.push(answer);
  }
  return { propsToCreate, name };
}
