import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
