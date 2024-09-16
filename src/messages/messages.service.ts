import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../schema/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  // Create a new message
  async create(
    content: string,
    senderId: string,
    recipientId: string,
    departmentId: string | null,
    headerId: string,
    fileId: string | null,
  ): Promise<Message> {
    const newMessage = new this.messageModel({
      content,
      sender: new Types.ObjectId(senderId),
      recipient: new Types.ObjectId(recipientId),
      department: departmentId ? new Types.ObjectId(departmentId) : undefined,
      header: new Types.ObjectId(headerId),
      file: fileId ? new Types.ObjectId(fileId) : undefined,
    });
    return newMessage.save();
  }

  // Retrieve all messages
  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  // Retrieve messages by Header ID
  async findMessagesByHeaderId(headerId: string): Promise<Message[]> {
    return this.messageModel
      .find({ header: new Types.ObjectId(headerId) })
      .exec();
  }

  // Retrieve a single message by ID
  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }
    return message;
  }

  // Update a message by ID
  async update(id: string, content: string): Promise<Message> {
    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(
        id,
        { content },
        { new: true }, // Return the updated document
      )
      .exec();
    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }
    return updatedMessage;
  }

  // Remove a message by ID
  async remove(id: string): Promise<void> {
    const result = await this.messageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }
  }

  // Remove messages by Header ID
  async deleteMessagesByHeader(headerId: string): Promise<void> {
    const result = await this.messageModel.deleteMany({
      header: new Types.ObjectId(headerId),
    });
    if (!result) {
      throw new NotFoundException(
        `Messages with Header ID "${headerId}" not found`,
      );
    }
  }
}
