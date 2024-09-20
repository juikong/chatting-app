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
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminconfigsService } from './adminconfigs/adminconfigs.service';
import { MessagesModule } from './messages/messages.module';
import { DepartmentsModule } from './departments/departments.module';
import { HeadersModule } from './headers/headers.module';
import { FilesModule } from './files/files.module';
import { ConfigsModule } from './configs/configs.module';
import { AdminconfigsModule } from './adminconfigs/adminconfigs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MailerModule.forRootAsync({
      imports: [AdminconfigsModule],
      inject: [AdminconfigsService],
      useFactory: async (adminconfigsService: AdminconfigsService) => {
        const emailHost = await adminconfigsService.getEmailHost();
        const emailUsername = await adminconfigsService.getEmailUsername();
        const emailPassword = await adminconfigsService.getEmailPassword();
        return {
          transport: {
            host: emailHost,
            auth: {
              user: emailUsername,
              pass: emailPassword,
            },
          },
        };
      },
    }),
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
