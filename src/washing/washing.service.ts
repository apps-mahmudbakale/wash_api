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

  // Schedule wash for multiple cars based on car names
  async scheduleWash(userId: number, cars: string[], scheduledAt: Date) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find an available washer
    const washer = await this.carWasherRepository.findOne({
      where: { isAvailable: true },
    });
    if (!washer) {
      throw new NotFoundException('No available washers at the moment');
    }

    const carIds: number[] = [];

    // Get car IDs based on car names
    for (const carName of cars) {
      const car = await this.carRepository.findOne({
        where: { plateNumber: carName },
      });
      if (!car) {
        throw new NotFoundException(`Car with name ${carName} not found`);
      }
      carIds.push(car.id);
    }

    // Create washing requests for each car
    for (const carId of carIds) {
      const car = await this.carRepository.findOne({ where: { id: carId } });
      const washingRequest = this.washingRepository.create({
        user,
        car,
        washer,
        scheduledAt,
        status: 'PENDING', // Default status
      });
      await this.washingRepository.save(washingRequest);
    }

    // Update washer availability
    washer.isAvailable = false;
    await this.carWasherRepository.save(washer);

    // Return washer details
    return {
      message: 'Washes scheduled successfully',
      washer: {
        id: washer.id,
        name: washer.fullName,
        phone: washer.phone,
        photo: washer.passportPhotoFilename,
      },
    };
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
