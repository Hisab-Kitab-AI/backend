import { Controller, Post, Request, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Post('signup')
  async signUp(@Body() body) {
    return this.authService.signUp(body.email, body.password);
  }

  @Get('test')
  async test(){
    return "hello"
  }
}

