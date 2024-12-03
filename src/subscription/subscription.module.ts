import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { Payment } from '../entities/payment.entity';
import { User } from '../entities/user.entity';
import { Package } from '../entities/package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Payment, User, Package])],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
