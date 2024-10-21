import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CarWashers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  bankName: string;

  @Column()
  accountNumber: string;

  @Column({ nullable: true })
  bvn?: string;

  @Column({ nullable: true })
  nin?: string;

  @Column({ default: false })
  isKYCVerified: boolean;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  kycDocument?: string;
  @Column('decimal', { precision: 10, scale: 8 }) // Adjust precision/scale as needed
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 }) // Adjust precision/scale as needed
  longitude: number;
}
