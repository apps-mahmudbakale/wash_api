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

  async createCarWasher(
    createCarWasherDto: CreateCarWasherDto,
    files: Express.Multer.File[],
  ): Promise<CarWashers> {
    const carWasher = this.carWashersRepository.create(createCarWasherDto);

    // Assign file paths
    files.forEach((file) => {
      if (file.fieldname === 'passportPhoto') {
        carWasher.passportPhotoFilename = `/uploads/passport-photos/${file.filename}`;
      } else if (file.fieldname === 'idDocument') {
        carWasher.idDocumentFilename = `/uploads/id-documents/${file.filename}`;
      }
    });

    return this.carWashersRepository.save(carWasher);
  }

  findAll(): Promise<CarWashers[]> {
    return this.carWashersRepository.find();
  }

  findOne(id: number): Promise<CarWashers> {
    return this.carWashersRepository.findOneBy({ id });
  }

  async updateCarWasher(
    id: number,
    updateData: Partial<CreateCarWasherDto>,
  ): Promise<CarWashers> {
    await this.carWashersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async removeCarWasher(id: number): Promise<void> {
    await this.carWashersRepository.delete(id);
  }
}
