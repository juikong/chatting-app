import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { jwtConstants } from './auth/constants';
import { MessagesModule } from './messages/messages.module';
import { DepartmentsModule } from './departments/departments.module';
import { HeadersModule } from './headers/headers.module';
import { FilesModule } from './files/files.module';
import { ConfigsModule } from './configs/configs.module';
import { AdminconfigsModule } from './adminconfigs/adminconfigs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    MessagesModule,
    DepartmentsModule,
    HeadersModule,
    FilesModule,
    ConfigsModule,
    AdminconfigsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
