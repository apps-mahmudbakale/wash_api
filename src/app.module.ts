import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { CarWashers } from './entities/car-washers.entity';

import * as dotenv from 'dotenv';
import { CarWashersModule } from './car-washers/car-washers.module';
import { PackagesModule } from './packages/packages.module';
import { Package } from './entities/package.entity';
import { GiftCardModule } from './gift-cards/gift-cards.module';
import { GiftCard } from './entities/gift-card.entity';
import { RatingsModule } from './ratings/ratings.module';
import { Rating } from './entities/rating.entity';
import { Service } from './entities/service.entity';
import { SubscriptionModule } from './subscription/subscription.module';
import { Payment } from './entities/payment.entity';
import { Subscription } from './entities/subscription.entity';
import { CarsModule } from './cars/cars.module';
import { PoliciesModule } from './policies/policies.module';
import { FaqsModule } from './faqs/faqs.module';
import { Car } from './entities/car.entity';
import { WashingModule } from './washing/washing.module';
import { Washing } from './entities/washing.entity';

// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        CarWashers,
        Package,
        GiftCard,
        Rating,
        Service,
        Payment,
        Subscription,
        Car,
        Washing,
      ],
      synchronize: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    CarWashersModule,
    PackagesModule,
    GiftCardModule,
    RatingsModule,
    SubscriptionModule,
    CarsModule,
    PoliciesModule,
    FaqsModule,
    WashingModule,
  ],
})
export class AppModule {}
