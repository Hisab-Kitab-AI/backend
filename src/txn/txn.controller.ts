import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TxnService } from './txn.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('txn')
export class TxnController {
    constructor(private txnService: TxnService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createNewTxn(@Body() body) {
      console.log('inside create new txn', body);
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
