// src/packages/packages.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from '../entities/package.entity';
import { CreatePackageDto } from './dto/package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,
  ) {}

  createPackage(createPackageDto: CreatePackageDto): Promise<Package> {
    const newPackage = this.packagesRepository.create(createPackageDto);
    return this.packagesRepository.save(newPackage);
  }

  findAll(): Promise<Package[]> {
    return this.packagesRepository.find();
  }

  findOne(id: number): Promise<Package> {
    return this.packagesRepository.findOneBy({ id });
  }

  async updatePackage(id: number, updateData: Partial<CreatePackageDto>): Promise<Package> {
    await this.packagesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async removePackage(id: number): Promise<void> {
    await this.packagesRepository.delete(id);
  }
}
