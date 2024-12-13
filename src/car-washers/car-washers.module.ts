import { Module } from '@nestjs/common';
import { CarWashersService } from './car-washers.service';
import { CarWashersController } from './car-washers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarWashers } from '../entities/car-washers.entity';
import { Washing } from '../entities/washing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarWashers, Washing])],
  providers: [CarWashersService],
  controllers: [CarWashersController],
})
export class CarWashersModule {}
