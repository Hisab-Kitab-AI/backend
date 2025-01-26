import { Injectable } from '@nestjs/common';
import { TxnStatus } from '@prisma/client';
import { cloneDeep } from 'lodash';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TxnService {
  constructor(private databaseService: DatabaseService) {}

  async createNewTxn(body) {
    try {
      //handle in case of new category
      let result;
      try {
        result = (await this.databaseService.user.findFirst({
          where: { id: Number(body.userId) },
          select: { categories: true },
        })) as any;
      } catch (err) {
        console.log('User id does not exist');
      }
      console.log(result);
      if (!result['categories'].includes(body.category)) {
        result['categories'].push(body.category);
        await this.databaseService.user.update({
          where: { id: Number(body.userId) },
          data: {
            categories: result['categories'],
          },
        });
      }
      console.log('asas', Number(body.amount));
      const resp = await this.databaseService.txn.create({
        data: {
          userId: Number(body.userId),
          to: body.to,
          from: body.from,
          amount: Number(body.amount),
          refId: body.refId,
          remark: body.remark,
          category: body.category,
          status: TxnStatus.ACTIVE,
        },
      });
      console.log('Respppp', resp);
      console.log('succesfully created txn in db for user id', body.userId);
      return { success: 'true', resp };
    } catch (err) {
      console.log(err);
      return { success: 'false', message: 'failed to create txn' };
    }
  }

  async getTxn(id) {
    try {
      const resp = this.databaseService.txn.findFirst({
        where: { id: Number(id), status: TxnStatus.ACTIVE },
      });
      return resp;
    } catch (err) {
      console.log(err);
      return { success: 'false' };
    }
  }
  async deleteTxn(id) {
    console.log(id);
    try {
      const resp = await this.databaseService.txn.update({
        where: { id: Number(id) },
        data: {
          status: TxnStatus.INACTIVE,
        },
      });
      return { success: true, resp };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'failure in deletion' };
    }
  }

  async updateTxn(body) {
    console.log('options', body);

    try {
      //handle in case of new category
      const result = (await this.databaseService.user.findFirst({
        where: { id: Number(body.userId) },
        select: { categories: true },
      })) as any;

      if (!result['categories'].includes(body.category)) {
        result['categories'].push(body.category);
        await this.databaseService.user.update({
          where: { id: Number(body.userId) },
          data: {
            categories: result['categories'],
          },
        });
      }

      const resp = await this.databaseService.txn.update({
        where: { id: Number(body.id) },
        data: {
          to: body.to,
          from: body.from,
          amount: parseFloat(body.amount),
          refId: body.refId,
          remark: body.remark,
          category: body.category,
        },
      });
      return { success: true, response: resp };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'failure in updation' };
    }
  }

  async getTxns(options) {
    try {
      if (!options.startTimestamp && !options.endTimestamp) {
        return {
          success: 'false',
          message:
            'atleast one of startTimestamp or endTimestamp needs to be passed',
        };
      }

      //setting default page size
      if (!options.pageSize) options.pageSize = 100;
      //setting default order
      if (!options.sortOrder) options.sortOrder = 'desc';

      const whereConditionTotalCount = {
        userId: Number(options.userId),
        status: TxnStatus.ACTIVE,
      };
      if (options.category)
        whereConditionTotalCount['category'] = options.category;

      //where condition for data
      const whereConditionDbData: any = cloneDeep(whereConditionTotalCount);
      whereConditionDbData['updatedAt'] = {};

      //add the startTimestamp if given
      if (options.startTimestamp) {
        whereConditionDbData.updatedAt['gt'] = new Date(
          Number(options.startTimestamp),
        );
      }

      //add the endTimestamp if given
      if (options.endTimestamp) {
        whereConditionDbData.updatedAt['lt'] = new Date(
          Number(options.endTimestamp),
        );
      }

      //parallel db calls for count and data
      const [totalCount, txns] = await Promise.all([
        this.databaseService.txn.count({
          where: whereConditionTotalCount,
        }),
        this.databaseService.txn.findMany({
          where: whereConditionDbData,
          orderBy: {
            updatedAt: options.sortOrder,
          },
          select: {
            id: true,
            to: true,
            from: true,
            amount: true,
            refId: true,
            remark: true,
            category: true,
            updatedAt: true,
          },
          take: options.pageSize,
        }),
      ]);

      //get the timestamp (for pagination purpose)

      const nextTimestamp = new Date(
        txns[txns.length - 1]?.updatedAt,
      ).getTime();

      return {
        nextTimestamp,
        userId: Number(options.userId),
        txns,
      };
    } catch (err) {
      throw err;
    }
  }
}
