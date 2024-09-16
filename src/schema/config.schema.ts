import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Config extends Document {
  @Prop({ required: true, unique: true })
  configname: string;

  @Prop({ required: true })
  configvalue: string;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
