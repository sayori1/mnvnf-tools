import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type {Model}Document = {Model} & Document;

@Schema()
export class {Model} {
  {props}
}

export const {Model}Schema = SchemaFactory.createForClass({Model});
