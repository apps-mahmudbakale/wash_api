import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthPayloadDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer'; // Import nodemailer

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<{ id: number; name: string; email: string }> {
    const { name, email, password } = signupDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10); // OTP expires in 10 minutes

    // Create new user with OTP
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      otp, // Save OTP
      otpExpires, // Save OTP expiration time
    });

    // Save the user to the database
    await this.userRepository.save(newUser);

    // Send OTP email
    await this.sendOtpEmail(email, otp);

    // Return the payload with user details
    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      otp: newUser.otp,
      otpExpires: newUser.otpExpires,
    };
    return payload;
  }

  async sendOtpEmail(to: string, otp: string) {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Replace with your SMTP server
      port: 465, // Replace with your SMTP port (587 for TLS)
      secure: true, // Use true for 465, false for other ports
      auth: {
        user: 'bnetworksitsolutions@gmail.com', // Replace with your email
        pass: 'jaea jpyv zrhp qnuh', // Replace with your email password
      },
    });

    // Define the email options
    const mailOptions = {
      to,
      subject: 'Your OTP Code', // Subject line
      text: `Your OTP code is ${otp}`, // Plain text body
      html: `<b>Your OTP code is ${otp}</b>`, // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }

  async validateUser({
    email,
    password,
  }: AuthPayloadDto): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { id: user.id, name: user.name, email: user.email };
    return this.jwtService.sign(payload);
  }
}
