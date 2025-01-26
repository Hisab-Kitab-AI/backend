import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserInfoService {

    constructor(
        private databaseService: DatabaseService,
      ) {}

    async getUserCategories(userId){
        try{
            const resp = this.databaseService.user.findFirst({
                where : {id : Number(userId)},
                select : {categories  :true}
                
            })
            return resp;
        }
        catch(err){
            console.log(err)
            return {success : "false"}
        }
    }
}
