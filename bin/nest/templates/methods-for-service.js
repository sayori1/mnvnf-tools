async create(dto: Create{Model}Dto) {
  let {model} = await this.{model}Model.create(dto);
  return {model};
}

async getAll(count, page) {
  const {model}s = await this.{model}Model
    .find()
    .skip(Number(count * page))
    .limit(Number(count));
  return {model}s;
}

async search(query) {
  const {model}s = await this.{model}Model.find({
    name: { $regex: new RegExp(query, 'i') },
  });
  return {model}s;
}

async getOne(id: mongoose.Schema.Types.ObjectId) {
  return await this.{model}Model.findById(id);
}

async delete(id: mongoose.Schema.Types.ObjectId) {
  return await this.{model}Model.findByIdAndDelete(id);
}

async save(id, dto: Create{Model}Dto) {
  let {model} = await this.{model}Model.findByIdAndUpdate(id, { $set: dto });
  return {model};
}