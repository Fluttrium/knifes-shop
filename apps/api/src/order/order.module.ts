import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderAdminController } from './admin/order-admin.controller';
import { OrderAdminService } from './admin/order-admin.service';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { ParcelService } from './parcel.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [PrismaModule, AuthModule, CartModule],
  controllers: [AddressController, OrderController, OrderAdminController],
  providers: [OrderService, OrderAdminService, AddressService, ParcelService],
  exports: [OrderService, OrderAdminService, AddressService, ParcelService],
})
export class OrderModule {}
