import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { Config } from '../schema/config.schema';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Post()
  async create(
    @Body('configname') configname: string,
    @Body('configvalue') configvalue: string,
  ): Promise<Config> {
    return this.configsService.create(configname, configvalue);
  }

  @Get()
  async findAll(): Promise<Config[]> {
    return this.configsService.findAll();
  }

  @Get('config/:id')
  async findOne(@Param('id') id: string): Promise<Config> {
    return this.configsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('configvalue') configvalue: string,
  ): Promise<Config> {
    return this.configsService.update(id, configvalue);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.configsService.remove(id);
  }

  @Get(':configname')
  async getConfigValue(
    @Param('configname') key: string,
  ): Promise<{ exists: boolean; value?: Config }> {
    const value = await this.configsService.getConfig(key);
    return value ? { exists: true, value } : { exists: false };
  }
}
