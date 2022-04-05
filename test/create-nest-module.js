import nest from "../bin/nest/nest.js";

nest.createNestModule("book", [
  { name: "book", propsToCreate: ["price:number"] },
]);
