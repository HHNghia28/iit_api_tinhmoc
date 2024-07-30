import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { UseJwtGuard } from 'src/utils/decorators/use-jwt-guard.decorator';
import { GetUser } from 'src/utils/user';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('category-count')
  async findAllCount() {
    return await this.categoryService.findAllCount();
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':name')
  async findByName(@Param('name') name: string) {
    return await this.categoryService.findByName(name);
  }

  @Post()
  @UseJwtGuard()
  async create(@Body() request: CreateCategoryDto, @GetUser() user: any) {
    return await this.categoryService.create({
      ...request,
      createId: user.userId,
      updateId: user.userId,
    });
  }

  @Put(':id')
  @UseJwtGuard()
  async update(
    @Param('id') id: string,
    @Body() request: UpdateCategoryDto,
    @GetUser() user: any,
  ) {
    return await this.categoryService.update(id, {
      ...request,
      updateId: user.userId,
    });
  }

  @Delete(':id')
  @UseJwtGuard()
  async delete(@Param('id') id: string, @GetUser() user: any) {
    return await this.categoryService.delete(id, user.userId);
  }
}
