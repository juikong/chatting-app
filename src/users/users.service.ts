import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    email: string,
    username: string,
    displayname: string,
    departmentname: string,
    division: string,
    location: string,
    password: string,
    photo: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      username,
      displayname,
      departmentname,
      division,
      location,
      password: hashedPassword,
      photo,
    });
    return newUser.save();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  //async findOne(email: string): Promise<User | undefined> {
  //  return this.userModel.findOne({ email }).exec();
  //}

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }

  async updateEmail(id: string, email: string): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { email }, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }

  async updatePassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }

  async updatePhoto(id: string, photoUrl: string): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { photo: photoUrl },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find({ username: { $ne: 'admin' } })
      .select('-password')
      .sort({ _id: -1 })
      .exec();
  }

  async findAdminUser(): Promise<User | null> {
    return this.userModel
      .findOne({ username: 'admin' })
      .select('-password')
      .exec();
  }

  // Remove a user by ID
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
