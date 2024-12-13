import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Car } from './car.entity';

@Entity()
export class Washing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.washings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Car, (car) => car.washings, { onDelete: 'CASCADE' })
  car: Car;

  @Column({ nullable: true })
  washerId: number;

  @CreateDateColumn()
  requestedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
