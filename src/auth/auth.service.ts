import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const fakeUsers = [
  { id: 1, username: 'mahmud', password: 'password' },
  { id: 2, username: 'bakale', password: 'password123' },
];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  validateUser({ username, password }: AuthPayloadDto) {
    const user = fakeUsers.find(u => u.username === username);

    if (user && user.password === password) {
      // Exclude password from the payload
      const { password: _, ...userWithoutPassword } = user;
      return this.jwtService.sign(userWithoutPassword);
    }

    return null;
  }
}
