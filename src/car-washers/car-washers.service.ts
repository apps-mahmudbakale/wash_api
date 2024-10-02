import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarWashers } from '../entities/car-washers.entity';
import { CreateCarWasherDto } from './dto/create-car-washer.dto';

@Injectable()
export class CarWashersService {
  constructor(
    @InjectRepository(CarWashers)
    private carWasherRepository: Repository<CarWashers>,
  ) {}

  createCarWasher(createCarWasherDto: CreateCarWasherDto): Promise<CarWashers> {
    const carWasher = this.carWasherRepository.create(createCarWasherDto);
    return this.carWasherRepository.save(carWasher);
  }

  findAll(): Promise<CarWashers[]> {
    return this.carWasherRepository.find();
  }

  findOne(id: number): Promise<CarWashers> {
    return this.carWasherRepository.findOneBy({ id });
  }

  async updateCarWasher(id: number, updateData: Partial<CreateCarWasherDto>): Promise<CarWashers> {
    await this.carWasherRepository.update(id, updateData);
    return this.findOne(id);
  }

  async removeCarWasher(id: number): Promise<void> {
    await this.carWasherRepository.delete(id);
  }

  async verifyKYC(id: number): Promise<CarWashers> {
    await this.carWasherRepository.update(id, { isKYCVerified: true });
    return this.findOne(id);
  }
}
