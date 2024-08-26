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
    private readonly userRepository: Repository<User>, // Inject the UserRepository
  ) {}

  async signup(signupDto: SignupDto): Promise<string> {
    const { name, email, password } = signupDto;

    // Check if the email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    // Generate and return a JWT token
    const payload = { id: newUser.id, name: newUser.name, email: newUser.email };
    return this.jwtService.sign(payload);
  }

  async validateUser({ email, password }: AuthPayloadDto): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT without password
      const payload = { id: user.id, name: user.name, email: user.email };
      return this.jwtService.sign(payload);
    }

    throw new UnauthorizedException('Invalid email or password');
  }
}
