import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Washing } from '../entities/washing.entity';
import { User } from '../entities/user.entity';
import { Car } from '../entities/car.entity';

@Injectable()
export class WashingService {
  constructor(
    @InjectRepository(Washing)
    private readonly washingRepository: Repository<Washing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  // Create a new washing request
  async createWashingRequest(
    userId: number,
    carId: number,
    washerId: number,
    scheduledAt: Date,
  ): Promise<Washing> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const car = await this.carRepository.findOne({ where: { id: carId } });
    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    const washingRequest = this.washingRepository.create({
      user,
      car,
      washerId,
      scheduledAt,
      status: 'PENDING', // Default status
    });

    return await this.washingRepository.save(washingRequest);
  }

  // Get all washing requests
  async getAllWashings(): Promise<Washing[]> {
    return await this.washingRepository.find({
      relations: ['user', 'car'],
    });
  }

  // Get a single washing request by ID
  async getWashingById(id: number): Promise<Washing> {
    const washing = await this.washingRepository.findOne({
      where: { id },
      relations: ['user', 'car'],
    });

    if (!washing) {
      throw new HttpException(
        'Washing request not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return washing;
  }

  // Update the status of a washing request
  async updateWashingStatus(
    washingId: number,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  ): Promise<Washing> {
    const washing = await this.washingRepository.findOne({ where: { id: washingId } });
    if (!washing) {
      throw new HttpException(
        'Washing request not found',
        HttpStatus.NOT_FOUND,
      );
    }

    washing.status = status;
    return await this.washingRepository.save(washing);
  }

  // Delete a washing request
  async deleteWashing(id: number): Promise<void> {
    const washing = await this.washingRepository.findOne({ where: { id } });
    if (!washing) {
      throw new HttpException(
        'Washing request not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.washingRepository.delete(id);
  }
}
