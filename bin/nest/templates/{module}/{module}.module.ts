import { Module } from '@nestjs/common';
import { {Module}Controller } from './{module}.controller';
import { {Module}Service } from './{module}.service';

@Module({
  imports: [
    {module-deps}
  ],
  controllers: [{Module}Controller],
  providers: [{Module}Service],
})
export class {Module}Module {}
