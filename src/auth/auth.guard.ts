// src/auth/jwt.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1]; // Assumes Bearer token format
    if (!token) {
      return false;
    }

    try {
      // Validate the JWT token
      const decoded = this.jwtService.verify(token, {
        secret: 'JWT_SECRET',
      });

      request.headers.userId = decoded.sub;
      console.log({request})
      return true;
    } catch (error) {
      console.log({error})
      return false;
    }
  }
}
