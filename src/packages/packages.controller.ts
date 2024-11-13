// src/packages/packages.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/package.dto';
import { Package } from '../entities/package.entity';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  createPackage(@Body() createPackageDto: CreatePackageDto): Promise<Package> {
    return this.packagesService.createPackage(createPackageDto);
  }

  @Get()
  findAll(): Promise<Package[]> {
    return this.packagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Package> {
    return this.packagesService.findOne(id);
  }
}
