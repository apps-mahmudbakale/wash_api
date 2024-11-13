// src/packages/packages.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Package } from '../entities/package.entity';
import { Service } from '../entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, Service])],
  providers: [PackagesService],
  controllers: [PackagesController],
})
export class PackagesModule {}
