import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressService, CreateAddressDto, UpdateAddressDto } from './address.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

class CreateAddressRequestDto implements CreateAddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

class UpdateAddressRequestDto implements UpdateAddressDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  address1?: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

@ApiTags('Адреса')
@Controller('orders/addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список адресов пользователя' })
  @ApiResponse({ status: 200, description: 'Список адресов получен' })
  async getAddresses(@GetUser('id') userId: string) {
    return this.addressService.getAddresses(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить адрес по ID' })
  @ApiResponse({ status: 200, description: 'Адрес найден' })
  @ApiResponse({ status: 404, description: 'Адрес не найден' })
  async getAddressById(
    @GetUser('id') userId: string,
    @Param('id') addressId: string,
  ) {
    return this.addressService.getAddressById(userId, addressId);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый адрес' })
  @ApiResponse({ status: 201, description: 'Адрес создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  async createAddress(
    @GetUser('id') userId: string,
    @Body() createAddressDto: CreateAddressRequestDto,
  ) {
    return this.addressService.createAddress(userId, createAddressDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить адрес' })
  @ApiResponse({ status: 200, description: 'Адрес обновлен' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 404, description: 'Адрес не найден' })
  async updateAddress(
    @GetUser('id') userId: string,
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressRequestDto,
  ) {
    return this.addressService.updateAddress(userId, addressId, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить адрес' })
  @ApiResponse({ status: 200, description: 'Адрес удален' })
  @ApiResponse({ status: 400, description: 'Адрес используется в заказах' })
  @ApiResponse({ status: 404, description: 'Адрес не найден' })
  async deleteAddress(
    @GetUser('id') userId: string,
    @Param('id') addressId: string,
  ) {
    return this.addressService.deleteAddress(userId, addressId);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Установить адрес по умолчанию' })
  @ApiResponse({ status: 200, description: 'Адрес установлен по умолчанию' })
  @ApiResponse({ status: 404, description: 'Адрес не найден' })
  async setDefaultAddress(
    @GetUser('id') userId: string,
    @Param('id') addressId: string,
  ) {
    return this.addressService.setDefaultAddress(userId, addressId);
  }
} 