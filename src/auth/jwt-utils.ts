import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTUtils {
  constructor(private readonly jwtService: JwtService) {}

  decode(auth: string): { userId: string; email: string } {
    const jwt = auth.replace('Bearer ', '');
    const decoded = this.jwtService.decode(jwt, { json: true }) as {
      userId: string;
      email: string;
    };
    return decoded;
  }
}
