import { Controller, Get } from '@nestjs/common';
import { {Module}Service } from './{module}.service';

@Controller()
export class {Module}Controller {
  constructor(private readonly {module}Service: {Module}Service) {}

  @Get()
  getHello(): string {
    return this.{Module}Service.getHello();
  }
}
