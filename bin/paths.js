import path from "path";
import { getInstalledPath } from "get-installed-path";

const packageDir = await getInstalledPath("mnvnf-tools");
const currentDir = process.cwd();

const nestProject = packageDir + `/bin/nest/templates/nest-project`;
const nestModel = packageDir + `/bin/nest/templates/{model}`;
const nestModule = packageDir + `/bin/nest/templates/{module}`;

export default { packageDir, currentDir, nestProject, nestModel, nestModule };
