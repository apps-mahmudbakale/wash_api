import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthPayloadDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer'; // Still using nodemailer here

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Helper to generate OTP and its expiration time
  private generateOtp(): { otp: string; otpExpires: Date } {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10); // OTP expires in 10 minutes
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

  // User signup with OTP
  async signup(signupDto: SignupDto): Promise<{ id: number; name: string; email: string }> {
    const { name, email, password } = signupDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const { otp, otpExpires } = this.generateOtp();

    // Create new user with OTP
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

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
    const { otp, otpExpires } = this.generateOtp();
    user.otp = otp;
    user.otpExpires = otpExpires;

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
    const currentTime = new Date();
    if (user.otp !== otp || currentTime > user.otpExpires) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // OTP is valid, generate JWT token
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = this.jwtService.sign(payload);

    // Clear OTP and expiration once verified
    user.otp = null;
    user.otpExpires = null;
    await this.userRepository.save(user);

    return { token };
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
      location: user.address,
      lat: user.lat,
      long: user.long,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
  // Method to save or update user location
  async saveLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user's latitude and longitude
    user.lat = latitude;
    user.long = longitude;

    // Save the updated user location to the database
    await this.userRepository.save(user);
  }
}
