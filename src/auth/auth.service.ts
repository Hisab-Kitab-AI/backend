import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(body: any) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email: body.email },
      });
      if(!user){
        return new BadRequestException({
          message: `No user found with the given email`
        })
      }
      if (await bcrypt.compare(body.password, user.password)) {
        const payload = { email: user.email, userId: user.id };
        return { success: 'true', access_token: this.jwtService.sign(payload) };
      } else {
        return { success: 'false', message: 'password is incorrect' };
      }
    } catch (err) {
      throw new InternalServerErrorException(`Error while trying to login`)
    }

  }

  async signUp(body: any) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email : body.email },
      });
      if (!user) {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const resp = await this.databaseService.user.create({
          data: { email : body.email, password: hashedPassword, categories: [] },
        });
        const { password, ...response } = resp;
        return { success: 'true', response };
      }
      return { success: 'false', message: 'email already exists' };
    } catch (err) {
      console.log(err);
      return { success: 'false', message: 'error occured' };
    }
  }
}
