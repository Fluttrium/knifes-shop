import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAdminController } from './user-admin.controller';
import { UserAdminService } from './user-admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UserController, UserAdminController],
  providers: [UserService, UserAdminService],
  imports: [AuthModule, PrismaModule],
  exports: [],
})
export class UserModule {}
