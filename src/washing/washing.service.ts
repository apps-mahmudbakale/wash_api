import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Washing } from '../entities/washing.entity';
import { User } from '../entities/user.entity';
import { Car } from '../entities/car.entity';
import { CarWashers } from '../entities/car-washers.entity';

@Injectable()
export class WashingService {
  constructor(
    @InjectRepository(Washing)
    private readonly washingRepository: Repository<Washing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(CarWashers)
    private readonly carWasherRepository: Repository<CarWashers>,
  ) {}

  async createWashingRequest(
    userId: number,
    carIds: number[],
    scheduledAt: Date,
  ): Promise<Washing[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cars = await this.carRepository.find({
      where: { id: In(carIds) },
    });

    if (cars.length !== carIds.length) {
      throw new NotFoundException('One or more cars not found');
    }

    const washer = await this.carWasherRepository.findOne({ where: { isAvailable: true } });

    if (!washer) {
      throw new NotFoundException('No available washer found');
    }

    // Mark washer as unavailable
    washer.isAvailable = false;
    await this.carWasherRepository.save(washer);

    // Create a washing record for each car
    const washings = cars.map((car) =>
      this.washingRepository.create({
        user,
        car,
        washer,
        scheduledAt,
      }),
    );

    return this.washingRepository.save(washings);
  }

  async getAllWashings(): Promise<Washing[]> {
    return this.washingRepository.find();
  }

  async getWashingById(id: number): Promise<Washing> {
    const washing = await this.washingRepository.findOne({ where: { id } });
    if (!washing) {
      throw new NotFoundException('Washing not found');
    }
    return washing;
  }

  async updateWashingStatus(
    id: number,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  ): Promise<Washing> {
    const washing = await this.getWashingById(id);

    // Optionally validate status explicitly
    if (
      !['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)
    ) {
      throw new Error('Invalid status');
    }

    washing.status = status;
    return this.washingRepository.save(washing);
  }

  async deleteWashing(id: number): Promise<void> {
    const washing = await this.getWashingById(id);
    await this.washingRepository.remove(washing);
  }
}
