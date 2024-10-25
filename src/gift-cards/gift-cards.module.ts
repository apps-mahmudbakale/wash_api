import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftCardService } from './gift-cards.service';
import { GiftCardController } from './gift-cards.controller';
import { GiftCard } from '../entities/gift-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GiftCard])],
  providers: [GiftCardService],
  controllers: [GiftCardController],
})
export class GiftCardModule {}
