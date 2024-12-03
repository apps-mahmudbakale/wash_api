import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  idDocumentFilename: string; // Stores the filename of the uploaded ID document

  @Column()
  passportPhotoFilename: string; // Stores the filename of the passport photograph

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
}
