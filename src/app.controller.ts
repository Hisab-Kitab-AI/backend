import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('process-msg')
  async processMsg(@Body() body): Promise<any> {
    console.log(body.sms);
    const resp = await this.appService.processMsg(body.sms, body.userId);
    return resp;
  }
}
