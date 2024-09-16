import {
  Controller,
  //Body,
  Request,
  Get,
  Post,
  UseGuards,
  //HttpException,
  //HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
//import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
//import { LoginDto } from './auth/login.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  //@Post('auth/login')
  //async login(@Body() loginDto: LoginDto) {
  //  const token = await this.authService.validateUser(loginDto);
  //  if (!token) {
  //    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //  }
  //  return { accessToken: token };
  //}

  //@UseGuards(JwtAuthGuard)
  //@Get('profile')
  //getProfile(@Request() req) {
  //  return req.user;
  //}
}
