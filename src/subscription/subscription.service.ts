import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { Payment } from '../entities/payment.entity';
import { User } from '../entities/user.entity';
import { Package } from '../entities/package.entity';
import axios from 'axios';

@Injectable()
export class SubscriptionService {
  private readonly paystackBaseUrl = 'https://api.paystack.co';
  private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  // Verify Paystack payment
  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );

      if (response.data.status && response.data.data.status === 'success') {
        return response.data.data; // Return the full payment details
      }

      return null;
    } catch (error) {
      throw new HttpException(
        'Payment verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Subscribe a user to a package and save payment details
  async subscribeUser(
    userId: number,
    packageId: number,
    paymentReference: string,
  ): Promise<Subscription> {
    // Verify payment reference
    const paymentDetails = await this.verifyPayment(paymentReference);
    if (!paymentDetails) {
      throw new HttpException('Payment not verified', HttpStatus.BAD_REQUEST);
    }

    // Save payment details
    const payment = this.paymentRepository.create({
      user: { id: userId },
      reference: paymentDetails.reference,
      amount: paymentDetails.amount / 100, // Convert from kobo to Naira
      currency: paymentDetails.currency,
      status: paymentDetails.status,
      gatewayResponse: paymentDetails.gateway_response,
    });
    await this.paymentRepository.save(payment);

    // Retrieve package details
    const packageEntity = await this.packageRepository.findOne({ where: { id: packageId } });
    if (!packageEntity) {
      throw new HttpException('Invalid package', HttpStatus.NOT_FOUND);
    }

    // Calculate subscription duration (always monthly)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + 1);

    // Create and save subscription
    const subscription = this.subscriptionRepository.create({
      user: { id: userId },
      package: { id: packageId },
      startDate,
      endDate,
      status: 'ACTIVE',
    });

    return this.subscriptionRepository.save(subscription);
  }
}
