import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import mongoose from 'mongoose';
import { {Module}Service } from './{module}.service';
{controller-imports}

@Controller()
export class {Module}Controller {
  constructor(private readonly {module}Service: {Module}Service) {}
  {controller-code}
}
