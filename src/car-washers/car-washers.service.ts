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

  // Modified method to handle profile picture upload
  async createCarWasher(
    createCarWasherDto: CreateCarWasherDto,
    profilePicture: Express.Multer.File,
  ): Promise<CarWashers> {
    const carWasher = this.carWasherRepository.create(createCarWasherDto);

    // Assign the profile picture file path if it exists
    if (profilePicture) {
      carWasher.profilePicture = `/uploads/profile-pictures/${profilePicture.filename}`;
    }

    return this.carWasherRepository.save(carWasher);
  }

  findAll(): Promise<CarWashers[]> {
    return this.carWasherRepository.find();
  }

  findOne(id: number): Promise<CarWashers> {
    return this.carWasherRepository.findOneBy({ id });
  }

  async updateCarWasher(
    id: number,
    updateData: Partial<CreateCarWasherDto>,
  ): Promise<CarWashers> {
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

  // KYC document upload handling (optional)
  async uploadKYCDocument(
    carWasherId: number,
    kycDocument: Express.Multer.File,
  ): Promise<CarWashers> {
    const carWasher = await this.findOne(carWasherId);
    if (carWasher) {
      carWasher.kycDocument = `/uploads/kyc-documents/${kycDocument.filename}`;
      return this.carWasherRepository.save(carWasher);
    }
    throw new Error('Car washer not found');
  }
}
