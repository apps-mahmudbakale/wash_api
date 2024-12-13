import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Washing } from './washing.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  plateNumber: string;

  @ManyToOne(() => User, (user) => user.cars)
  user: User;
  @OneToMany(() => Washing, (washing) => washing.car)
  washings: Washing[];
}
