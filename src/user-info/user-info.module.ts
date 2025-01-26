import { Module } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { UserInfoController } from './user-info.controller';

@Module({
  imports : [DatabaseModule],
  providers: [UserInfoService, DatabaseService],
  controllers : [UserInfoController]
})
export class UserInfoModule {}
