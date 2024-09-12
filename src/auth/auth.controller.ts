import { Body, Controller, Get, Post, Req, UseGuards,BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() authPayload: AuthPayloadDto) {
    console.log(authPayload);
    return this.authService.validateUser(authPayload);
  }

  // Route for verifying OTP
  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string,) {
    if (!email || !otp) {
      throw new BadRequestException('Email and OTP are required');
    }

    return this.authService.verifyOtp(email, otp);
  }

  // New endpoint for resending OTP
  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  // NEW: Route to update user location
  @Post('location')
  @UseGuards(JwtAuthGuard) // Protect this route using JWT Guard
  async updateLocation(
    @Req() req: Request,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    const userId = req.user['id']; // Extract the userId from the JWT token payload

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    // Call the service method to update location
    await this.authService.saveLocation(userId, latitude, longitude);

    return { message: 'Location updated successfully' };
  }
}
