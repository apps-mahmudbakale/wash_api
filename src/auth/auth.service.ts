import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthPayloadDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup(signupDto: SignupDto): Promise<string> {
    const { name, email, password } = signupDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    const payload = { id: newUser.id, name: newUser.name, email: newUser.email };
    return this.jwtService.sign(payload);
  }

  async validateUser({ email, password }: AuthPayloadDto): Promise<string | null> {
    // Debugging: Log the received email and password
    console.log('Received Email:', email);
    console.log('Received Password:', password);

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      console.log('User not found'); // Debugging
      throw new UnauthorizedException('Invalid email or password');
    }

    // Debugging: Log the stored hashed password
    console.log('Stored Hashed Password:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Password does not match'); // Debugging
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT
    const payload = { id: user.id, name: user.name, email: user.email };
    return this.jwtService.sign(payload);
  }
}
