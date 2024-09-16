import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Header } from '../schema/header.schema';

@Injectable()
export class HeadersService {
  constructor(@InjectModel(Header.name) private headerModel: Model<Header>) {}

  // Create a new header
  async create(
    content: string,
    senderId: string,
    recipientId: string,
    departmentId: string | null,
    userId: string,
  ): Promise<Header> {
    const newHeader = new this.headerModel({
      content,
      sender: new Types.ObjectId(senderId),
      recipient: new Types.ObjectId(recipientId),
      department: departmentId ? new Types.ObjectId(departmentId) : undefined,
      user: new Types.ObjectId(userId),
      updatedAt: new Date(),
    });
    return newHeader.save();
  }

  // Retrieve all headers
  async findAll(): Promise<Header[]> {
    return this.headerModel.find().exec();
  }

  // Retrieve a single header by ID
  async findOne(id: string): Promise<Header> {
    const header = await this.headerModel.findById(id).exec();
    if (!header) {
      throw new NotFoundException(`Header with ID "${id}" not found`);
    }
    return header;
  }

  // Retrieve exist headers by User ID
  async findExistHeadersByUserId(
    userId: string,
    otherId: string,
  ): Promise<Header[]> {
    return this.headerModel
      .find({
        user: new Types.ObjectId(userId),
        recipient: new Types.ObjectId(otherId),
      })
      .sort({ updatedAt: -1 })
      .exec();
  }

  // Retrieve header from Sender
  async findHeaderBySender(userId: string, otherId: string): Promise<Header> {
    return this.headerModel
      .findOne({
        sender: new Types.ObjectId(userId),
        user: new Types.ObjectId(otherId),
      })
      .sort({ updatedAt: -1 })
      .exec();
  }

  // Retrieve header from Sender
  async findHeaderByRecipient(
    userId: string,
    otherId: string,
  ): Promise<Header> {
    return this.headerModel
      .findOne({
        recipient: new Types.ObjectId(userId),
        user: new Types.ObjectId(otherId),
      })
      .sort({ updatedAt: -1 })
      .exec();
  }

  // Retrieve headers by User ID
  async findHeadersByUserId(userId: string): Promise<Header[]> {
    return this.headerModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .exec();
  }

  // Retrieve headers by Department ID
  async findHeadersByDepartmentId(departmentId: string): Promise<Header[]> {
    return this.headerModel
      .find({ department: new Types.ObjectId(departmentId) })
      .sort({ updatedAt: -1 })
      .exec();
  }

  // Update a header by ID
  async update(
    id: string,
    content: string,
    senderId: string,
    recipientId: string,
  ): Promise<Header> {
    const updatedHeader = await this.headerModel
      .findByIdAndUpdate(
        id,
        {
          content,
          sender: new Types.ObjectId(senderId),
          recipient: new Types.ObjectId(recipientId),
          updatedAt: new Date(),
        },
        { new: true }, // Return the updated document
      )
      .exec();
    if (!updatedHeader) {
      throw new NotFoundException(`Header with ID "${id}" not found`);
    }
    return updatedHeader;
  }

  // Remove a header by ID
  async remove(id: string): Promise<void> {
    const result = await this.headerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Header with ID "${id}" not found`);
    }
  }
}
