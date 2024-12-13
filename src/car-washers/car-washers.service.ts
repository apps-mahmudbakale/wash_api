import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarWashers } from '../entities/car-washers.entity';
import { CreateCarWasherDto } from './dto/create-car-washer.dto';

@Injectable()
export class CarWashersService {
  constructor(
    @InjectRepository(CarWashers)
    private carWashersRepository: Repository<CarWashers>,
  ) {}

  /**
   * Create a new car washer with uploaded file paths.
   */
  async createCarWasher(
    createCarWasherDto: CreateCarWasherDto,
  ): Promise<CarWashers> {
    const carWasher = this.carWashersRepository.create(createCarWasherDto);
    return this.carWashersRepository.save(carWasher);
  }

  /**
   * Retrieve all car washers.
   */
  findAll(): Promise<CarWashers[]> {
    return this.carWashersRepository.find();
  }

  /**
   * Retrieve a single car washer by ID.
   */
  findOne(id: number): Promise<CarWashers> {
    return this.carWashersRepository.findOneBy({ id });
  }

  /**
   * Update an existing car washer.
   */
  async updateCarWasher(
    id: number,
    updateData: Partial<CreateCarWasherDto>,
  ): Promise<CarWashers> {
    await this.carWashersRepository.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Delete a car washer by ID.
   */
  async removeCarWasher(id: number): Promise<void> {
    await this.carWashersRepository.delete(id);
  }
}
