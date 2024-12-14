import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { WashingService } from './washing.service';

@Controller('washings')
export class WashingController {
  constructor(private readonly washingService: WashingService) {}

  @Post('schedule')
  @HttpCode(HttpStatus.CREATED)
  async scheduleWash(@Body() body: any) {
    const { userId, cars, scheduledAt } = body;

    // Validate that 'cars' is an array
    if (!Array.isArray(cars)) {
      throw new HttpException('Cars must be an array', HttpStatus.BAD_REQUEST);
    }

    // Pass the userId, cars, and scheduledAt to the service
    return this.washingService.scheduleWash(
      userId,
      cars,
      new Date(scheduledAt),
    );
  }

  @Get()
  async getAllWashings() {
    return this.washingService.getAllWashings();
  }

  @Get(':id')
  async getWashingById(@Param('id') id: number) {
    return this.washingService.getWashingById(id);
  }

  @Patch(':id/status')
  async updateWashingStatus(@Param('id') id: number, @Body() body: any) {
    const { status } = body;
    return this.washingService.updateWashingStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWashing(@Param('id') id: number) {
    return this.washingService.deleteWashing(id);
  }
}
