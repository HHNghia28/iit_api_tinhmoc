import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { UseJwtGuard } from 'src/utils/decorators/use-jwt-guard.decorator';
import { GetUser } from 'src/utils/user';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('categories') categoryName?: string[],
  ) {
    if (typeof categoryName === 'string') {
      categoryName = [categoryName];
    }
    return await this.productService.findAll({
      search,
      sort,
      categoryName,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.productService.findBySlug(slug);
  }

  @Post()
  @UseJwtGuard()
  async create(@Body() request: CreateProductDto, @GetUser() user: any) {
    return await this.productService.create({
      ...request,
      createId: user.userId,
      updateId: user.userId,
    });
  }

  @Put(':id')
  @UseJwtGuard()
  async update(
    @Param('id') id: string,
    @Body() request: UpdateProductDto,
    @GetUser() user: any,
  ) {
    return await this.productService.update(id, {
      ...request,
      updateId: user.userId,
    });
  }

  @Delete(':id')
  @UseJwtGuard()
  async delete(@Param('id') id: string, @GetUser() user: any) {
    return await this.productService.delete(id, user.userId);
  }
}
