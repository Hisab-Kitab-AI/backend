import { Controller, Get, Param } from '@nestjs/common';
import { UserInfoService } from './user-info.service';

@Controller('user-info')
export class UserInfoController {
    constructor(private userInfoService: UserInfoService) {}

    @Get('categories/:id')
    async getUserCategories(@Param('id') id) {
        console.log(id)
      return this.userInfoService.getUserCategories(id);
    }
}
