import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Adminconfig } from '../schema/adminconfig.schema';

@Injectable()
export class AdminconfigsService {
  constructor(
    @InjectModel(Adminconfig.name) private adminconfigModel: Model<Adminconfig>,
  ) {}

  // Create a new config
  async create(configname: string, configvalue: string): Promise<Adminconfig> {
    const newConfig = new this.adminconfigModel({
      configname,
      configvalue,
    });
    return newConfig.save();
  }

  // Retrieve all configs
  async findAll(): Promise<Adminconfig[]> {
    return this.adminconfigModel.find().exec();
  }

  // Retrieve a single config by ID
  async findOne(id: string): Promise<Adminconfig> {
    const config = await this.adminconfigModel.findById(id).exec();
    if (!config) {
      throw new NotFoundException(`Adminconfig with ID "${id}" not found`);
    }
    return config;
  }

  // Update a config by ID
  async update(id: string, configvalue: string): Promise<Adminconfig> {
    const updatedConfig = await this.adminconfigModel
      .findByIdAndUpdate(
        id,
        { configvalue },
        { new: true }, // Return the updated document
      )
      .exec();
    if (!updatedConfig) {
      throw new NotFoundException(`Adminconfig with ID "${id}" not found`);
    }
    return updatedConfig;
  }

  // Remove a config by ID
  async remove(id: string): Promise<void> {
    const result = await this.adminconfigModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Adminconfig with ID "${id}" not found`);
    }
  }

  async getConfig(configname: string): Promise<Adminconfig> {
    const config = await this.adminconfigModel.findOne({ configname }).exec();
    return config;
  }

  async getEmailHost(): Promise<string> {
    const config = await this.adminconfigModel
      .findOne({ configname: 'EMAIL_HOST' })
      .exec();
    if (!config) {
      return 'localhost';
    }
    return config.configvalue;
  }

  async getEmailUsername(): Promise<string> {
    const config = await this.adminconfigModel
      .findOne({ configname: 'EMAIL_USERNAME' })
      .exec();
    if (!config) {
      return 'john.doe@email.com';
    }
    return config.configvalue;
  }

  async getEmailPassword(): Promise<string> {
    const config = await this.adminconfigModel
      .findOne({ configname: 'EMAIL_PASSWORD' })
      .exec();
    if (!config) {
      return 'password';
    }
    return config.configvalue;
  }
}
