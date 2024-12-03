// src/packages/packages.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Package } from '../entities/package.entity';
import { Service } from '../entities/service.entity';
import { Subscription } from '../entities/subscription.entity';
import { Payment } from '../entities/payment.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Package, Service, Subscription, Payment, User]),
  ],
  providers: [PackagesService],
  controllers: [PackagesController],
})
export class PackagesModule {}
