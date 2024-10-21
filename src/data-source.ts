import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import * as dotenv from 'dotenv';
import { CarWashers } from './entities/car-washers.entity';
import { Package } from './entities/package.entity';

// Load environment variables from .env file
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres', // You can cast this to the appropriate type
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, CarWashers, Package],
  migrations: ['src/migrations/*.ts'],
  synchronize: true, // Be cautious with this in production
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Add SSL configuration here
});
