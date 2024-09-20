import {
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Body,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from '../schema/user.schema';
import { RegisterDto } from './register.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signupadmin')
  async registeradmin(@Body() body: RegisterDto) {
    return this.usersService.create(
      body.email,
      'admin',
      body.displayname,
      body.departmentname,
      body.division,
      body.location,
      body.password,
      body.photo,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('signup')
  async register(@Body() body: RegisterDto) {
    return this.usersService.create(
      body.email,
      body.username,
      body.displayname,
      body.departmentname,
      body.division,
      body.location,
      body.password,
      body.photo,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/email')
  async updateEmail(
    @Param('id') id: string,
    @Body('email') email: string,
  ): Promise<User> {
    return this.usersService.updateEmail(id, email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body('password') newPassword: string,
  ): Promise<User> {
    return this.usersService.updatePassword(id, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos', // Directory where the photos will be saved
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updatePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const photoUrl = file.filename;
    await this.usersService.updatePhoto(id, photoUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('allusers')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('adminuser')
  async getAdminUser() {
    return this.usersService.findAdminUser();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Post('passwordreset')
  async sendPasswordEmail(@Body('email') email: string): Promise<void> {
    const result = await this.usersService.findAdminUser();
    const userid = result._id.toString();
    this.usersService.updatePassword(userid, 'c51wIkS52g');
    await this.usersService.sendPasswordMail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('newuser')
  async sendNewUserMail(
    @Body('serverurl') serverurl: string,
    @Body('email') email: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<void> {
    const result = await this.usersService.findAdminUser();
    const adminemail = result.email;
    await this.usersService.sendNewUserMail(
      serverurl,
      email,
      username,
      password,
      adminemail,
    );
  }
}
