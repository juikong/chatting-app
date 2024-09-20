import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

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

  async sendPasswordMail(to: string): Promise<void> {
    const message = `Your password have been reset to c51wIkS52g, this is temporary password please change your account password after login`;

    this.mailerService.sendMail({
      to,
      from: `Chat-ing Admin <"${to}">`,
      subject: `Password Reset`,
      text: message,
    });
  }

  async sendNewUserMail(
    serverurl: string,
    to: string,
    username: string,
    password: string,
    adminemail: string,
  ): Promise<void> {
    const message = `<!DOCTYPE html><html><head><title>New User</title></head><body>Your Chat-ing login information:-<br />Server URL: ${serverurl.substring(8)}<br />Username: ${username}<br />Password: ${password}<br /><br />Chat-ing Admin</body></html>`;

    this.mailerService.sendMail({
      to,
      from: `Chat-ing Admin <"${adminemail}">`,
      subject: `Chat-ing Login`,
      html: message,
    });
  }
}
