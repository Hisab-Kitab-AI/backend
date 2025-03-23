// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service'; // Adjust the path
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtAuthGuard } from './auth.guard';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '60m' }, // Token expiration
    }),
  ],
  providers: [JwtAuthGuard, DatabaseService, AuthService],
  exports: [JwtModule,JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
