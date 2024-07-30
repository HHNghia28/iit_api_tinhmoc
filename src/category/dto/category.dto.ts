import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  parentId: string;

  @IsString()
  @IsOptional()
  createId: string;

  @IsString()
  @IsOptional()
  updateId: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  parentId: string;

  @IsString()
  @IsOptional()
  updateId: string;

  @IsOptional()
  isDeleted: boolean;
}
