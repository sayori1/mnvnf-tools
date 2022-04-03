import path from "path";
import { getInstalledPath } from "get-installed-path";

const packageDir = await getInstalledPath("mnvnf-tools");
const currentDir = process.cwd();

const nestProject = packageDir + `/bin/nest/templates/project`;
const nestModel = packageDir + `/bin/nest/templates/{model}`;
const nestModule = packageDir + `/bin/nest/templates/{module}`;
const nestMethodsController =
  packageDir + `/bin/nest/templates/methods-for-controller.js`;
const nestMethodsService =
  packageDir + `/bin/nest/templates/methods-for-service.js`;

export default {
  packageDir,
  currentDir,
  nestProject,
  nestModel,
  nestModule,
  nestMethodsController,
  nestMethodsService
};
