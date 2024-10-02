import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CarWashers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  kycDocument: string; // Path to uploaded KYC documents (NIN, BVN)

  @Column({ nullable: true })
  profilePicture: string; // Path to the uploaded profile picture

  @Column()
  bvn: string; // Bank Verification Number

  @Column()
  nin: string; // National Identification Number

  @Column()
  bankName: string; // Bank Name

  @Column()
  bankAccountNumber: string; // Bank Account Number

  @Column({ default: false })
  isKYCVerified: boolean;

  @Column({ default: false })
  isActive: boolean;
}
