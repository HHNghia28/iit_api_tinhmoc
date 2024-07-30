import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsNumber()
  salePercent: number;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  createId: string;

  @IsOptional()
  @IsString()
  updateId: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  normalizeTitle: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsNumber()
  salePercent: number;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  updateId: string;

  @IsOptional()
  isDeleted: boolean;
}

export class UpdateImageDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  thumbnails: string[];

  @IsNotEmpty()
  oldUrl: string[];
}
