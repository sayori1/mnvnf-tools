import nest from "../bin/nest/nest.js";

nest.createNestProject("bookstore", [
  {
    name: "book",
    modelsToCreate: [{ name: "book", propsToCreate: ["price:number"] }],
  },
  {
    auth_module: true,
    file_module: true,
  },
]);
