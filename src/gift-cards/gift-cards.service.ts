import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftCard } from '../entities/gift-card.entity';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectRepository(GiftCard)
    private giftCardRepository: Repository<GiftCard>,
  ) {}

  // Method to create a gift card
  async createGiftCard(data: { name: string; price: number; benefits: string }): Promise<GiftCard> {
    const giftCard = this.giftCardRepository.create(data);
    return this.giftCardRepository.save(giftCard);
  }

  // Method to get all gift cards
  async getAllGiftCards(): Promise<GiftCard[]> {
    return this.giftCardRepository.find();
  }
  async getRandomGiftCard(): Promise<GiftCard> {
    const giftCards = await this.giftCardRepository.find();
    if (giftCards.length === 0) {
      throw new Error('No gift cards available');
    }
    const randomIndex = Math.floor(Math.random() * giftCards.length);
    return giftCards[randomIndex];
  }
}
