import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TxnController } from './txn/txn.controller';
import { TxnModule } from './txn/txn.module';
import { AuthController } from './auth/auth.controller';
import { UserInfoController } from './user-info/user-info.controller';
import { UserInfoModule } from './user-info/user-info.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [AuthModule, TxnModule, UserInfoModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
