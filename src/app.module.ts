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
      entities: [User, CarWashers, Package, GiftCard],
      synchronize: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    CarWashersModule,
    PackagesModule,
    GiftCardModule,
  ],
})
export class AppModule {}
