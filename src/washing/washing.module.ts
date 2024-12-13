import { Module } from '@nestjs/common';
import { WashingController } from './washing.controller';
import { WashingService } from './washing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Car } from '../entities/car.entity';
import { Washing } from '../entities/washing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Washing, User, Car])],
  controllers: [WashingController],
  providers: [WashingService],
})
export class WashingModule {}
