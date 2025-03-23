import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TxnModule } from './txn/txn.module';
import { UserInfoModule } from './user-info/user-info.module';
import { DatabaseService } from './database/database.service';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [AuthModule, TxnModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
