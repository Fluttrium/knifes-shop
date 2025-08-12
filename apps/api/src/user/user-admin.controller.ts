import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRoleGuard } from '../auth/guards/user-role/user-role.guard';
import { RolProtected } from '../auth/decorators/rol-protected.decorator';
import { Role } from '@prisma/client';
import { UserAdminService } from './user-admin.service';

@ApiTags('Админ - Пользователи')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@ApiBearerAuth()
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get()
  @RolProtected(Role.admin)
  @ApiOperation({ summary: 'Получить всех пользователей (админ)' })
  @ApiResponse({ status: 200, description: 'Список пользователей получен' })
  async getAllUsers(@Query() query: any) {
    return this.userAdminService.getAllUsers(query);
  }

  @Get('statistics')
  @RolProtected(Role.admin)
  @ApiOperation({ summary: 'Получить статистику пользователей (админ)' })
  @ApiResponse({ status: 200, description: 'Статистика получена' })
  async getUserStatistics() {
    return this.userAdminService.getUserStatistics();
  }
}
