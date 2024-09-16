import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeadersService } from './headers.service';
import { HeadersController } from './headers.controller';
import { Header, HeaderSchema } from '../schema/header.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Header.name, schema: HeaderSchema }]),
  ],
  controllers: [HeadersController],
  providers: [HeadersService],
})
export class HeadersModule {}
