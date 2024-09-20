import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminconfigsService } from './adminconfigs.service';
import { AdminconfigsController } from './adminconfigs.controller';
import { Adminconfig, AdminconfigSchema } from '../schema/adminconfig.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Adminconfig.name, schema: AdminconfigSchema },
    ]),
  ],
  controllers: [AdminconfigsController],
  providers: [AdminconfigsService],
  exports: [AdminconfigsService],
})
export class AdminconfigsModule {}
