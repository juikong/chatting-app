import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminconfigsService } from './adminconfigs.service';
import { Adminconfig } from '../schema/adminconfig.schema';

@Controller('adminconfigs')
export class AdminconfigsController {
  constructor(private readonly adminconfigsService: AdminconfigsService) {}

  @Post()
  async create(
    @Body('configname') configname: string,
    @Body('configvalue') configvalue: string,
  ): Promise<Adminconfig> {
    return this.adminconfigsService.create(configname, configvalue);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Adminconfig[]> {
    return this.adminconfigsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('config/:id')
  async findOne(@Param('id') id: string): Promise<Adminconfig> {
    return this.adminconfigsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('configvalue') configvalue: string,
  ): Promise<Adminconfig> {
    return this.adminconfigsService.update(id, configvalue);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.adminconfigsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':configname')
  async getConfigValue(
    @Param('configname') key: string,
  ): Promise<{ exists: boolean; value?: Adminconfig }> {
    const value = await this.adminconfigsService.getConfig(key);
    return value ? { exists: true, value } : { exists: false };
  }
}
