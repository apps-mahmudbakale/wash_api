import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Washing } from './washing.entity';

@Entity()
export class CarWashers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  idDocumentType: string; // Stores the identifier (e.g., NIN number)

  @Column({ type: 'text', nullable: true }) // Changed from string to text for Base64 data
  idDocumentFilename: string; // Stores the Base64 string of the ID document

  @Column({ type: 'text', nullable: true }) // Changed from string to text for Base64 data
  passportPhotoFilename: string; // Stores the Base64 string of the passport photo

  @Column({ type: 'decimal', nullable: true}) // Adjust precision/scale as needed
  latitude: number;

  @Column({ type: 'decimal', nullable: true }) // Adjust precision/scale as needed
  longitude: number;

  @Column({ type: 'text', nullable: true })
  guarantor1Name: string;

  @Column({ type: 'text', nullable: true })
  guarantor1Phone: string;

  @Column({ type: 'text', nullable: true })
  guarantor1Address: string;

  @Column({ type: 'text', nullable: true })
  guarantor2Name: string;

  @Column({ type: 'text', nullable: true })
  guarantor2Phone: string;

  @Column({ type: 'text', nullable: true })
  guarantor2Address: string;

  @Column({ type: 'text', nullable: true }) // New column for bank name
  bankName: string;

  @Column({ type: 'text', nullable: true }) // New column for account number
  accountNumber: string;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Washing, (washing) => washing.washer)
  washings: Washing[];
}
