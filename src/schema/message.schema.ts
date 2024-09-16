import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Department } from './department.schema';
import { Header } from './header.schema';
import { File } from './file.schema';

@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Department.name })
  department: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Header.name, required: true })
  header: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: File.name })
  file: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
