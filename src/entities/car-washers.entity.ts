import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Washing } from './washing.entity';

@Entity()
export class CarWashers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  idDocumentType: string; // Stores the identifier (e.g., NIN number)

  @Column('text') // Changed from string to text for Base64 data
  idDocumentFilename: string; // Stores the Base64 string of the ID document

  @Column('text') // Changed from string to text for Base64 data
  passportPhotoFilename: string; // Stores the Base64 string of the passport photo

  @Column('decimal', { precision: 10, scale: 8 }) // Adjust precision/scale as needed
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 }) // Adjust precision/scale as needed
  longitude: number;

  @Column()
  guarantor1Name: string;

  @Column()
  guarantor1Phone: string;

  @Column()
  guarantor1Address: string;

  @Column()
  guarantor2Name: string;

  @Column()
  guarantor2Phone: string;

  @Column()
  guarantor2Address: string;

  @Column() // New column for bank name
  bankName: string;

  @Column() // New column for account number
  accountNumber: string;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Washing, (washing) => washing.washer)
  washings: Washing[];
}
