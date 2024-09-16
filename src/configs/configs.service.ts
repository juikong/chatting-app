import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config } from '../schema/config.schema';

@Injectable()
export class ConfigsService {
  constructor(@InjectModel(Config.name) private configModel: Model<Config>) {}

  // Create a new config
  async create(configname: string, configvalue: string): Promise<Config> {
    const newConfig = new this.configModel({
      configname,
      configvalue,
    });
    return newConfig.save();
  }

  // Retrieve all configs
  async findAll(): Promise<Config[]> {
    return this.configModel.find().exec();
  }

  // Retrieve a single config by ID
  async findOne(id: string): Promise<Config> {
    const config = await this.configModel.findById(id).exec();
    if (!config) {
      throw new NotFoundException(`Config with ID "${id}" not found`);
    }
    return config;
  }

  // Update a config by ID
  async update(id: string, configvalue: string): Promise<Config> {
    const updatedConfig = await this.configModel
      .findByIdAndUpdate(
        id,
        { configvalue },
        { new: true }, // Return the updated document
      )
      .exec();
    if (!updatedConfig) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }
    return updatedConfig;
  }

  // Remove a config by ID
  async remove(id: string): Promise<void> {
    const result = await this.configModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Config with ID "${id}" not found`);
    }
  }

  async getConfig(configname: string): Promise<Config> {
    const config = await this.configModel.findOne({ configname }).exec();
    return config;
  }
}
