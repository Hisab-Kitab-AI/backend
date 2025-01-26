import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JWT_SECRET',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.databaseService.user.findFirst({
      where: { email: payload.email },
    });
    console.log('inside validate', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
