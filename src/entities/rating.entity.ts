// src/ratings/entities/rating.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageId: number; // Reference to the package for which this rating applies

  @Column('decimal', { precision: 3, scale: 2 })
  value: number; // Rating value (e.g., 4.5)

  @Column()
  numberOfRatings: number; // Total number of ratings for calculating average
}
