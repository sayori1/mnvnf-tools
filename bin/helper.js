import yargs from "yargs";
import chalk from "chalk";
import boxen from "boxen";
import { hideBin } from "yargs/helpers";

const commands = yargs(hideBin(process.argv))
  .scriptName(">")
  .wrap(null)
  .demandCommand(1)
  .version("v1.0.0");

function init() {
  console.log(chalk.green("Initialization..."));
  console.log(
    boxen("tools version v1.0", {
      title: "mnvnf-tools",
      titleAlignment: "center",
    })
  );
  commands.parse();
}

export default { init, commands };
