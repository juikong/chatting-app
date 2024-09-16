import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Department extends Document {
  @Prop({ required: true })
  departmentname: string;

  @Prop({ default: 'group-photo.png' })
  photo: string;

  @Prop([String])
  members: string[];
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
