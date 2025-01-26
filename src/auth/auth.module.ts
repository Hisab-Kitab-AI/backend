// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { DatabaseService } from '../database/database.service'; // Adjust the path
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '60m' }, // Token expiration
    }),
  ],
  providers: [JwtStrategy, DatabaseService, AuthService],
  exports: [JwtStrategy, PassportModule],
  controllers : [AuthController]
}
)
export class AuthModule {}
