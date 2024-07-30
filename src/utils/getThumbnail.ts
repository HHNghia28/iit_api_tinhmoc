import { ConfigService } from '@nestjs/config';

export const prependHostAndPort = (
  configService: ConfigService,
  avatar: string | null,
): string | null => {
  if (!avatar) {
    return avatar; // Return null if avatar is null
  }
  const host = configService.get<string>('HOST');
  return `${host}${avatar}`;
};
