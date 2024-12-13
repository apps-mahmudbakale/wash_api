import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionsService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Body('userId') userId: number,
    @Body('packageId') packageId: number,
    @Body('paymentReference') paymentReference: string,
    @Body('plateNumbers') plateNumbers: any,
  ) {
    return this.subscriptionsService.subscribeUser(
      userId,
      packageId,
      paymentReference,
      plateNumbers,
    );
  }
}
