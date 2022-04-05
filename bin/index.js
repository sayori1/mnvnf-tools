#! /usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import nest from "./nest/nest.js";
import helper from "./helper.js";
import { nestOptional } from "./inquirer.js";

const run = async () => {
  helper.init();
};

run();
