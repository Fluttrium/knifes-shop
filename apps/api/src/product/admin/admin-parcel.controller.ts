import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminParcelService } from './admin-parcel.service';
import { AdminParcelFilterDto, AdminUpdateParcelStatusDto } from '../dto/admin-parcel.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { RolProtected } from 'src/auth/decorators/rol-protected.decorator';
import { Role } from '@prisma/client';

@ApiTags('Отправления (Админ)')
@ApiBearerAuth()
@Controller('admin/parcels')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@RolProtected(Role.admin)
export class AdminParcelController {
  constructor(private readonly parcelService: AdminParcelService) {}

  @Get()
  @ApiOperation({ summary: 'Список отправлений', description: 'Получить список отправлений с фильтрацией' })
  @ApiQuery({ name: 'orderId', required: false, description: 'ID заказа' })
  @ApiQuery({ name: 'status', required: false, description: 'Статус отправления' })
  @ApiResponse({ status: 200, description: 'Список отправлений' })
  async findAll(@Query() filter: AdminParcelFilterDto) {
    return this.parcelService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детали отправления', description: 'Получить детали отправления по ID' })
  @ApiParam({ name: 'id', description: 'ID отправления', example: 'uuid-parcel-id' })
  @ApiResponse({ status: 200, description: 'Детали отправления' })
  @ApiResponse({ status: 404, description: 'Отправление не найдено' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.parcelService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Изменить статус отправления', description: 'Изменить статус, трек-номер и комментарий отправления' })
  @ApiParam({ name: 'id', description: 'ID отправления', example: 'uuid-parcel-id' })
  @ApiResponse({ status: 200, description: 'Статус отправления обновлен' })
  @ApiResponse({ status: 404, description: 'Отправление не найдено' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateParcelStatusDto,
  ) {
    return this.parcelService.updateStatus(id, dto);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'История отправлений заказа', description: 'Получить историю отправлений по заказу' })
  @ApiParam({ name: 'orderId', description: 'ID заказа', example: 'uuid-order-id' })
  @ApiResponse({ status: 200, description: 'История отправлений' })
  async getHistoryByOrder(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.parcelService.getHistoryByOrder(orderId);
  }
} 