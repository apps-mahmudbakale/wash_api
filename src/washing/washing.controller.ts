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
} from '@nestjs/common';
import { WashingService } from './washing.service';

@Controller('washings')
export class WashingController {
  constructor(private readonly washingService: WashingService) {}

  // Create a new washing request
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWashing(@Body() body: any) {
    const { userId, carId, washerId, scheduledAt } = body;
    return this.washingService.createWashingRequest(
      userId,
      carId,
      washerId,
      new Date(scheduledAt),
    );
  }

  // Get all washing requests
  @Get()
  async getAllWashings() {
    return this.washingService.getAllWashings();
  }

  // Get a single washing request by ID
  @Get(':id')
  async getWashingById(@Param('id') id: number) {
    return this.washingService.getWashingById(id);
  }

  // Update washing status
  @Patch(':id/status')
  async updateWashingStatus(@Param('id') id: number, @Body() body: any) {
    const { status } = body;
    return this.washingService.updateWashingStatus(id, status);
  }

  // Delete a washing request
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWashing(@Param('id') id: number) {
    return this.washingService.deleteWashing(id);
  }
}
