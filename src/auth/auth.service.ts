import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
//import { LoginDto } from './login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //async validateUser(loginDto: LoginDto): Promise<string | null> {
  //  const { email, password } = loginDto;
  //  const user = await this.usersService.findOne(email);
  //  if (user && (await bcrypt.compare(password, user.password))) {
  //    return this.jwtService.sign({ email });
  //  }
  //  return null;
  //}

  async login(user: any) {
    const payload = { username: user._doc.username, sub: user._doc._id };
    return {
      access_token: this.jwtService.sign(payload),
      user_id: user._doc._id,
    };
  }
}
