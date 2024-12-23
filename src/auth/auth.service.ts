import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthPayloadDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { CarWashers } from '../entities/car-washers.entity';
import { CreateCarWasherDto } from '../car-washers/dto/create-car-washer.dto'; // Still using nodemailer here

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CarWashers)
    private readonly carWasherRepository: Repository<CarWashers>,
  ) {}

  // Helper to generate OTP and its expiration time
  private generateOtp(): { otp: string; otpExpires: number } {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
    return { otp, otpExpires };
  }

  // Helper to send OTP email using nodemailer
  private async sendOtpEmail(to: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com', // Use environment variables for security
      port: parseInt(process.env.SMTP_PORT, 10) || 465,
      secure: true, // Use true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'bnetworksitsolutions@gmail.com', // Use environment variables
        pass: process.env.SMTP_PASS || 'jaea jpyv zrhp qnuh', // Use environment variables
      },
    });

    const mailOptions = {
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
      html: `<b>Your OTP code is ${otp}</b>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['subscriptions', 'subscriptions.package', 'cars'],
    });
  }

  // User signup with OTP
  async signup(
    signupDto: SignupDto,
  ): Promise<{ id: number; name: string; email: string }> {
    const { name, email, password } = signupDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      console.log(existingUser);
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const { otp } = this.generateOtp();
    // Create new user with OTP
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      otp,
    });

    console.log(newUser);
    // Save the user to the database
    await this.userRepository.save(newUser);

    // Send OTP email
    await this.sendOtpEmail(email, otp);

    // Return the payload with user details
    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }

  // Resend OTP
  async resendOtp(email: string): Promise<{ message: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a new OTP and update the user
    const { otp } = this.generateOtp();
    user.otp = otp;
    // user.otpExpires = otpExpires; // Store as a timestam

    // Save updated OTP to the user
    await this.userRepository.save(user);

    // Send the OTP via email
    await this.sendOtpEmail(user.email, otp);

    return { message: 'OTP resent successfully' };
  }

  // Verify OTP and login the user
  async verifyOtp(email: string, otp: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the OTP matches and hasn't expired
    // const currentTime = new Date();
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // OTP is valid, generate JWT token
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = this.jwtService.sign(payload);

    // Clear OTP and expiration once verified
    user.otp = null;
    // user.otpExpires = null;
    await this.userRepository.save(user);

    return { token };
  }

  // Verify OTP for forgot password
  async verifyOtp2(
    email: string,
    otp: string,
  ): Promise<{ success: boolean; message: string; token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // // Check if the OTP matches and hasn't expired
    // const currentTime = Date.now();
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // OTP is valid, generate JWT token
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = this.jwtService.sign(payload);

    // OTP is valid, clear OTP and expiration once verified
    user.otp = null;
    // user.otpExpires = null;
    await this.userRepository.save(user);
    //
    // // Return success status for frontend verification
    return {
      success: true,
      message: 'OTP verified successfully',
      token: token,
    };
  }

  // Validate user login (via email/password)
  async validateUser({
    email,
    password,
  }: AuthPayloadDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
  // Method to save or update user location
  async saveLocation(
    userId: number,
    latitude: number,
    longitude: number,
    address: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user's latitude and longitude
    user.lat = latitude;
    user.long = longitude;
    user.address = address;

    // Save the updated user location to the database
    await this.userRepository.save(user);
  }
  // Admin login logic
  async adminLogin(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    // console.log(user);
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
  async sendForgotPasswordOtp(email: string): Promise<{ message: string }> {
    // Check if the email exists in the system
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    // Generate a new OTP and update the user
    const { otp } = this.generateOtp();
    user.otp = otp;
    // user.otpExpires = otpExpires;

    // Save updated OTP to the user
    await this.userRepository.save(user);

    // Send the OTP via email
    await this.sendOtpEmail(user.email, otp);

    return { message: 'OTP sent successfully' };
  }
  // Verify OTP and Reset Password
  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return { success: true, message: 'Password reset successfully' };
  }
  async washerSignup(createCarWasherDto: CreateCarWasherDto): Promise<{
    id: number;
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }> {
    const { fullName, email, password, phone } = createCarWasherDto;

    const existingWasher = await this.carWasherRepository.findOne({
      where: { email },
    });
    if (existingWasher) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { otp } = this.generateOtp();
    const newWasher = this.carWasherRepository.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      otp,
    });
    await this.carWasherRepository.save(newWasher);

    await this.sendOtpEmail(email, otp);
    return {
      id: newWasher.id,
      fullName: newWasher.fullName,
      email: newWasher.email,
      phone: newWasher.phone,
      password: newWasher.password,
    };
  }

  /**
   * Washer Login
   */
  async washerLogin(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const washer = await this.carWasherRepository.findOne({ where: { email } });
    if (!washer) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, washer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: washer.id,
      name: washer.fullName,
      email: washer.email,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
  /**
   * Verify OTP
   */
  async verifyOtpWasher(
    email: string,
    otp: string,
  ): Promise<{ success: boolean; message: string; token: any }> {
    const washer = await this.carWasherRepository.findOne({ where: { email } });
    if (!washer) {
      throw new NotFoundException('Account not found');
    }
    if (washer.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    washer.otp = null; // Clear OTP after successful verification
    await this.carWasherRepository.save(washer);

    const payload = {
      id: washer.id,
      name: washer.fullName,
      email: washer.email,
      phone: washer.phone,
    };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'OTP verified successfully',
      token: token,
    };
  }
}
