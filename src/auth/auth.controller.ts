import { Controller, Post, Request, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body) {
    return this.authService.login({...body});
  }

  @Post('signup')
  async signUp(@Body() body) {
    return this.authService.signUp({...body});
  }

  @Get('test')
  async test(){
    return "hello"
  }
}

