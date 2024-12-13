import { Controller, Post, Body } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  addCar(@Body() createCarDto: CreateCarDto) {
    return this.carsService.addCar(createCarDto);
  }
}
