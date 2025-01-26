import { Injectable } from '@nestjs/common';
import { TxnService } from './txn/txn.service';

@Injectable()
export class AppService {
  constructor(private txnService: TxnService) {}

  getHello(): string {
    return 'Hello World!';
  }
  async ICICIRegex(sms, userId) {
    // Define regex patterns
    const amountPattern = /Rs ([\d,]+\.\d{2})/;
    const fromAccountPattern = /Acct ([A-Z]+\d+)/;
    const toAccountPattern = /; ([A-Za-z\s]+) credited\./;
    const upiPattern = /UPI:(\d+)/;

    // Extract information using regex
    const amountMatch = sms.match(amountPattern);
    const fromAccountMatch = sms.match(fromAccountPattern);
    const toAccountMatch = sms.match(toAccountPattern);
    const upiMatch = sms.match(upiPattern);

    // Check if matches are found and extract the groups
    const amount = amountMatch ? amountMatch[1] : 0;
    const from = fromAccountMatch ? 'ICICI' + fromAccountMatch[1] : 'Not found';
    const to = toAccountMatch ? toAccountMatch[1] : 'Not found';
    const refId = upiMatch ? upiMatch[1] : 'Not found';

    // Return the extracted details
    return {
      amount,
      from,
      to,
      refId,
    };
  }
  async SBIRegex(sms, userId) {
    // Define regex patterns
    const amountPattern = /debited by ([\d,]+\.\d+)/; // Matches amount debited
    const fromAccountPattern = /A\/C ([A-Z]\d+)/; // Matches the account number
    const toAccountPattern = /trf to ([A-Za-z\s]+) Refno/; // Matches the recipient's name
    const upiPattern = /Refno (\d+)/; // Matches the reference number

    // Extract information using regex
    const amountMatch = sms.match(amountPattern);
    const fromAccountMatch = sms.match(fromAccountPattern);
    const toAccountMatch = sms.match(toAccountPattern);
    const upiMatch = sms.match(upiPattern);

    // Check if matches are found and extract the groups
    const amount = amountMatch ? +amountMatch[1] : 0;
    const from = fromAccountMatch ? 'SBI' + fromAccountMatch[1] : 'Not found';
    const to = toAccountMatch ? toAccountMatch[1] : 'Not found';
    const refId = upiMatch ? upiMatch[1] : 'Not found';

    // Return the extracted details
    return {
      amount,
      from,
      to,
      refId,
    };
  }

  async UBIRegex(sms, userId) {
    // Define regex patterns
    const fromAccountPattern = /A\/c (\*\d+)/; // Matches the account number
    const amountPattern = /Debited for Rs:(\d+\.\d+)/; // Matches the amount debited
    const upiPattern = /ref no (\d+)/; // Matches the reference number

    // Extract information using regex
    const amountMatch = sms.match(amountPattern);
    const fromAccountMatch = sms.match(fromAccountPattern);
    const upiMatch = sms.match(upiPattern);

    // Check if matches are found and extract the groups
    const amount = amountMatch ? +amountMatch[1] : 0;
    const from = fromAccountMatch
      ? 'UnionBankofIndia' + fromAccountMatch[1]
      : 'Not found';
    const refId = upiMatch ? upiMatch[1] : 'Not found';

    // Return the extracted details
    return {
      amount,
      from,
      refId,
    };
  }

  async processMsg(sms, userId): Promise<any> {
    if (
      !(
        sms.includes('debited for') ||
        sms.includes('debited by') ||
        sms.includes('Debited for')
      )
    ) {
      return { isTxn: false };
    }
    if (sms.includes('ICICI')) {
      const resp = await this.ICICIRegex(sms, userId);
      //make the db entry
      const txn = await this.txnService.createNewTxn({
        userId,
        to: resp.to,
        from: resp.from,
        amount: resp.amount,
        refId: resp.refId,
        category: 'other',
        remark: 'ICICI Bank Txn',
      });
      return { isTxn: true, ...txn.resp };
    }
    if (sms.includes('SBI')) {
      const resp = await this.SBIRegex(sms, userId);
      //make the db entry
      console.log(resp);
      const txn = await this.txnService.createNewTxn({
        userId,
        to: resp.to,
        from: resp.from,
        amount: resp.amount,
        refId: resp.refId,
        category: 'other',
        remark: 'SBI Bank Txn',
      });
      return { isTxn: true, ...txn.resp };
    }
    if (sms.includes('Union Bank of India')) {
      const resp = await this.UBIRegex(sms, userId);
      //make the db entry
      console.log(resp);
      const txn = await this.txnService.createNewTxn({
        userId,
        from: resp.from,
        amount: resp.amount,
        refId: resp.refId,
        category: 'other',
        remark: 'Union Bank of India Txn',
      });
      return { isTxn: true, ...txn.resp };
    }
  }
}
