import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { {Module}Controller } from './{module}.controller';
import { {Module}Service } from './{module}.service';
{module-imports}

@Module({
  imports: [
    {module-deps}
  ],
  controllers: [{Module}Controller],
  providers: [{Module}Service],
})
export class {Module}Module {}
