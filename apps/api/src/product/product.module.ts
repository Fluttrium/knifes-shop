import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './product.controller';
import { ProductAdminController } from './admin/product-admin.controller';
import { PaymentController } from './controllers/payment.controller';
import {
  CategoryController,
  CategoryAdminController,
} from './category.controller';

import { ProductAdminService } from './admin/product-admin.service';
import { PaymentService } from './services/payment.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminPaymentController } from './admin/admin-payment.controller';
import { AdminPaymentService } from './admin/admin-payment.service';
import { AdminParcelController } from './admin/admin-parcel.controller';
import { AdminParcelService } from './admin/admin-parcel.service';
import { ProductService } from './product.service';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
  controllers: [
    CategoryController,
    CategoryAdminController,
    ProductController,
    ProductAdminController,
    PaymentController,
    AdminPaymentController,
    AdminParcelController,
  ],
  providers: [
    ProductService,
    ProductAdminService,
    PaymentService,
    AdminPaymentService,
    AdminParcelService,
  ],
  exports: [
    ProductService,
    ProductAdminService,
    PaymentService,
    AdminPaymentService,
    AdminParcelService,
  ],
})
export class ProductModule {}
