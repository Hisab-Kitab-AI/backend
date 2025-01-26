import { Module } from '@nestjs/common';
import { TxnService } from './txn.service';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { TxnController } from './txn.controller';

@Module({
  imports: [DatabaseModule],
  providers: [TxnService, DatabaseService],
  exports: [TxnService],
  controllers: [TxnController],
})
export class TxnModule {}
