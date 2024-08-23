import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('login') 
    login(@Body() authpayload:AuthPayloadDto) {
        const user = this.authService.validateUser(authpayload);
        return user;
        // if(!user) throw new HttpException('Invalid Credentials', 401);
        // return user;
    }
}
