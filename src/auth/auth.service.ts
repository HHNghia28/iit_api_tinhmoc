import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { compare, hash } from 'src/utils/bcrypt';
import {
  CreadentialDto,
  RefreshTokenDto,
  UpdatePasswordDto,
} from './dto/credential.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login({ email, password }: CreadentialDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác !');
    }

    if (await compare(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...data } = user;

      const accessToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });
      const refreshToken = await this.generateRefreshToken(user.id);

      return {
        accessToken,
        refreshToken,
        user: {
          id: data.id,
          email: data.email,
        },
      };
    } else {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác !');
    }
  }

  async changePassword({ email, password, newPassword }: UpdatePasswordDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác !');
    }

    if (await compare(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...data } = user;

      const hashPassword = await hash(newPassword);
      const accessToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });
      const refreshToken = await this.generateRefreshToken(user.id);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: hashPassword,
        },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: data.id,
          email: data.email,
        },
      };
    } else {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác !');
    }
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    const user = await this.prismaService.user.findFirst({
      where: { refreshToken, isDeleted: false },
    });

    if (!user || !this.isRefreshTokenValid(user.expiryRefreshToken)) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn.',
      );
    }

    const newToken = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken: newToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async logout(userId: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: null, expiryRefreshToken: null },
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = bcrypt.genSaltSync(10);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        refreshToken,
        expiryRefreshToken: expiryDate,
      },
    });

    return refreshToken;
  }

  private isRefreshTokenValid(expiryDate: Date): boolean {
    return new Date() < new Date(expiryDate);
  }
}
