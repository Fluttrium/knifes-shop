import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RolProtected } from './rol-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import {Role} from "@repo/database";



export function Auth(...roles: Role[]) {

  return applyDecorators(
    RolProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  );
}