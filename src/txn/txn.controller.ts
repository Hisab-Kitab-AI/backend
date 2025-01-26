import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TxnService } from './txn.service';

@Controller('txn')
export class TxnController {
    constructor(private txnService: TxnService) {}

    @Post()
    async createNewTxn(@Body() body) {
      return this.txnService.createNewTxn(body);
    }

    @Patch()
    async updateTxn(@Body() body) {
      return this.txnService.updateTxn(body);
    }
    @Get()
    async getTxns(@Query() query) {
      return this.txnService.getTxns(query);
    }

    @Get('/:id')
    async getTxn(@Param('id') id) {
        console.log(id)
      return this.txnService.getTxn(id);
    }

    @Delete()
    async deleteTxn(@Query('id') id) {
      return this.txnService.deleteTxn(id);
    }

    

    

    
}
