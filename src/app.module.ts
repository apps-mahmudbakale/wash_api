import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';

import * as dotenv from 'dotenv';

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
      entities: [User],
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Add SSL configuration here
    }),
    AuthModule,
  ],
})
export class AppModule {}
