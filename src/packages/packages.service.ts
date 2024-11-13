// src/packages/packages.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from '../entities/package.entity';
import { Service } from '../entities/service.entity';
import { CreatePackageDto } from './dto/package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,

    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async createPackage(createPackageDto: CreatePackageDto): Promise<Package> {
    const { services, ...packageData } = createPackageDto;

    // Create and save package
    const newPackage = this.packagesRepository.create(packageData);
    const savedPackage = await this.packagesRepository.save(newPackage);

    // Create and save services associated with the package
    const serviceEntities = services.map((service) =>
      this.servicesRepository.create({
        ...service,
        packageEntity: savedPackage,
      }),
    );
    await this.servicesRepository.save(serviceEntities);

    // Return the package with its services
    return this.packagesRepository.findOne({
      where: { id: savedPackage.id },
      relations: ['services'],
    });
  }

  findAll(): Promise<Package[]> {
    return this.packagesRepository.find({ relations: ['services'] });
  }

  findOne(id: number): Promise<Package> {
    const packageFound = this.packagesRepository.findOne({
      where: { id },
      relations: ['services'],
    });
    return packageFound;
  }

  async updatePackage(id: number, updateData: Partial<CreatePackageDto>): Promise<Package> {
    await this.packagesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async removePackage(id: number): Promise<void> {
    await this.packagesRepository.delete(id);
  }
}
