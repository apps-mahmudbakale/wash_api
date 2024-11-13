// src/entities/package.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Service } from './service.entity';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Price field with decimal type
  price: number;

  @Column({ default: 0 }) // Add the number of washes column here
  numberOfWashes: number;

  @OneToMany(() => Service, (service) => service.packageEntity, { cascade: true })
  services: Service[];
}
