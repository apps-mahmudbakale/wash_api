import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftCard } from '../entities/gift-card.entity';
import { v4 as uuidv4 } from 'uuid'; // Importing UUID for unique code generation

@Injectable()
export class GiftCardService {
  constructor(
    @InjectRepository(GiftCard)
    private giftCardRepository: Repository<GiftCard>,
  ) {}

  // Method to create a gift card with a coupon code
  async createGiftCard(data: { name: string; price: number; percentage: number }): Promise<GiftCard> {
    // Generate a unique coupon code
    const couponCode = `GC-${uuidv4().split('-')[0].toUpperCase()}`; // Prefix with "GC-" and use part of the UUID

    // Merge the coupon code with the incoming data
    const giftCardData = { ...data, couponCode };

    // Create the gift card entity
    const giftCard = this.giftCardRepository.create(giftCardData);

    // Save and return the gift card
    return this.giftCardRepository.save(giftCard);
  }

  // Method to get all gift cards
  async getAllGiftCards(): Promise<GiftCard[]> {
    return this.giftCardRepository.find();
  }

  // Method to get a random gift card
  async getRandomGiftCard(): Promise<GiftCard> {
    const giftCards = await this.giftCardRepository.find();
    if (giftCards.length === 0) {
      throw new Error('No gift cards available');
    }
    const randomIndex = Math.floor(Math.random() * giftCards.length);
    return giftCards[randomIndex];
  }
}
