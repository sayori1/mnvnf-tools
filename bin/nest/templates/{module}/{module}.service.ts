import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
{service-imports}

@Injectable()
export class {Module}Service {
  constructor(
    {service-deps}
  ){}
  {service-code}
}
