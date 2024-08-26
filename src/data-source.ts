import { DataSource } from 'typeorm';
import { User } from './entities/user.entity'; // your entity

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'wash_n_wax',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Don't use `synchronize` in production
});
