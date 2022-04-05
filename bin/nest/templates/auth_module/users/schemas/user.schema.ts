import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { UserCourse } from "./usercourse.schema";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  login: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  banned: boolean;

  @Prop()
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
