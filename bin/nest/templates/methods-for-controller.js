@Post()
create(@Body() dto: Create{Model}Dto) {
  return this.{module}Service.create(dto);
}

@Get()
getAll(@Param('count') count: number, @Param('page') page: number) {
    return this.{module}Service.getAll(count, page);
}

@Get(':id')
getOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
  return this.{module}Service.getOne(id);
}

@Get('/search')
search(@Param('query') query: string) {
    return this.{module}Service.search(query);
}

@Delete(':id')
delete(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.{module}Service.delete(id);
}

@Put(':id')
save(
  @Param('id') id: mongoose.Schema.Types.ObjectId,
  @Body() dto: Create{Model}Dto,
) {
  return this.{module}Service.save(id, dto);
}