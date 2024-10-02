import { Module } from '@nestjs/common';
import { CarWashersService } from './car-washers.service';
import { CarWashersController } from './car-washers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarWashers } from '../entities/car-washers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarWashers])],
  providers: [CarWashersService],
  controllers: [CarWashersController],
})
export class CarWashersModule {}
