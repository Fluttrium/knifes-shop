import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from 'src/prisma/prisma.module';
import {JwtStrategy} from "./strategies/jwt.strategies";


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports:[
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXP'),
          }
        }
      }
    }),
    PrismaModule,
  ],
  exports:[JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
