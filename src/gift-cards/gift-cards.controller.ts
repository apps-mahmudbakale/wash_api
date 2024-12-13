import { Controller, Get, Post, Body, HttpStatus, HttpException } from "@nestjs/common";
import { GiftCardService } from './gift-cards.service';
import { GiftCard } from '../entities/gift-card.entity';

@Controller('gift-cards')
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  // POST /gift-cards - Create a new gift card
  @Post()
  async createGiftCard(@Body() data: { name: string; price: number; percentage: number }): Promise<GiftCard> {
    return this.giftCardService.createGiftCard(data);
  }

  // GET /gift-cards - Get all gift cards
  @Get()
  async getAllGiftCards(): Promise<GiftCard[]> {
    return this.giftCardService.getAllGiftCards();
  }
  @Get('random')
  async getRandomGiftCard() {
    try {
      const giftCard = await this.giftCardService.getRandomGiftCard();
      return giftCard;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
