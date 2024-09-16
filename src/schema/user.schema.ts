import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  displayname: string;

  @Prop()
  departmentname: string;

  @Prop()
  division: string;

  @Prop()
  location: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'photo.png' })
  photo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
