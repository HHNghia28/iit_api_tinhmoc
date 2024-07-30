import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreadentialDto {
  @IsNotEmpty({
    message: 'Địa chỉ mail bị bỏ trống !',
  })
  email: string;

  @IsNotEmpty({
    message: 'Mật khẩu bị bỏ trống !',
  })
  password: string;
}

export class UpdatePasswordDto {
  @IsOptional()
  email: string;

  @IsNotEmpty({
    message: 'Mật khẩu bị bỏ trống !',
  })
  password: string;

  @IsNotEmpty({
    message: 'Mật khẩu bị bỏ trống !',
  })
  newPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
