// src/ratings/rating.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { RatingService } from './ratings.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // Get rating for a specific package
  @Get(':packageId')
  async getRating(@Param('packageId') packageId: number) {
    const rating = await this.ratingService.getRatingByPackageId(packageId);
    if (rating) {
      return {
        packageId: rating.packageId,
        rating: rating.value,
        numberOfRatings: rating.numberOfRatings,
      };
    }
    return { packageId, rating: 0, numberOfRatings: 0 }; // Default response if no rating
  }

  // Get all ratings (optional)
  @Get()
  async getAllRatings() {
    return await this.ratingService.getAllRatings();
  }
}
