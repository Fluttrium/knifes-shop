import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './product.controller';
import { ProductAdminController } from './admin/product-admin.controller';
import { ProductImagesController } from './admin/product-images.controller';

import {
  CategoryController,
  CategoryAdminController,
} from './category.controller';

import { ProductAdminService } from './admin/product-admin.service';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminPaymentController } from './admin/admin-payment.controller';
import { AdminPaymentService } from './admin/admin-payment.service';
import { AdminParcelController } from './admin/admin-parcel.controller';
import { AdminParcelService } from './admin/admin-parcel.service';
import { ProductService } from './product.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, UploadModule],
  controllers: [
    CategoryController,
    CategoryAdminController,
    ProductController,
    ProductAdminController,
    ProductImagesController,
    AdminPaymentController,
    AdminParcelController,
  ],
  providers: [
    ProductService,
    ProductAdminService,
    AdminPaymentService,
    AdminParcelService,
  ],
  exports: [
    ProductService,
    ProductAdminService,
    AdminPaymentService,
    AdminParcelService,
  ],
})
export class ProductModule {}
