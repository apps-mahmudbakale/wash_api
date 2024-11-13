// src/ratings/rating.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  // Get rating by package ID
  async getRatingByPackageId(packageId: number): Promise<Rating> {
    return this.ratingRepository.findOne({ where: { packageId } });
  }

  // Calculate average rating if needed
  async calculateAverageRating(packageId: number): Promise<number> {
    const rating = await this.getRatingByPackageId(packageId);
    return rating ? rating.value / rating.numberOfRatings : 0;
  }

  // Get all ratings (optional, for admin or debugging)
  async getAllRatings(): Promise<Rating[]> {
    return this.ratingRepository.find();
  }
}
