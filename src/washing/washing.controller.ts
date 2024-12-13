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

  @Post('schedule')
  @HttpCode(HttpStatus.CREATED)
  async createWashing(@Body() body: any) {
    const { userId, carIds, scheduledAt } = body; // Accept carIds as an array
    return this.washingService.createWashingRequest(
      userId,
      carIds,
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
