import { Injectable } from '@nestjs/common';
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
      if (bcrypt.compareSync(body.password, user.password)) {
        const payload = { username: user.email, sub: user.id };
        return { success: 'true', access_token: this.jwtService.sign(payload) };
      } else {
        return { success: 'false', message: 'password is incorrect' };
      }
    } catch (err) {
      return { success: 'false', message: 'email not correct' };
    }

    return 'failure ';
  }

  async signUp(email: string, pass: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email },
      });
      if (!user) {
        const hashedPassword = bcrypt.hashSync(pass, 10);
        const resp = await this.databaseService.user.create({
          data: { email, password: hashedPassword, categories: [] },
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
