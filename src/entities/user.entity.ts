import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Subscription } from './subscription.entity';
import { Payment } from './payment.entity';
import { Car } from './car.entity';
import { Washing } from './washing.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'bigint', nullable: true })
  otpExpires: number;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  long: number;

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];
  @OneToMany(() => Washing, (washing) => washing.user)
  washings: Washing[];
}
