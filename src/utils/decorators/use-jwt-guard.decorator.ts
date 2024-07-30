import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export function UseJwtGuard() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
