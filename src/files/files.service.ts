import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from '../schema/file.schema';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  // Create a new file
  async create(content: string): Promise<File> {
    const newFile = new this.fileModel({ content });
    return newFile.save();
  }

  // Retrieve all files
  async findAll(): Promise<File[]> {
    return this.fileModel.find().exec();
  }

  // Retrieve a single file by ID
  async findOne(id: string): Promise<File> {
    const file = await this.fileModel.findById(id).exec();
    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }
    return file;
  }

  // Update a file by ID
  async update(id: string, content: string): Promise<File> {
    const updatedFile = await this.fileModel
      .findByIdAndUpdate(
        id,
        { content },
        { new: true }, // Return the updated document
      )
      .exec();
    if (!updatedFile) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }
    return updatedFile;
  }

  // Remove a file by ID
  async remove(id: string): Promise<void> {
    const result = await this.fileModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }
  }
}
