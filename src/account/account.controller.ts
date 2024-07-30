import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateUserDto, UpdateUserDto } from './dto/account.dto';
import { UseJwtGuard } from 'src/utils/decorators/use-jwt-guard.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @UseJwtGuard()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.accountService.createUser(createUserDto);
  }

  @Get(':id')
  @UseJwtGuard()
  async findOne(@Param('id') id: string) {
    return this.accountService.findUserById(id);
  }

  @Put(':id')
  @UseJwtGuard()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.accountService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseJwtGuard()
  async remove(@Param('id') id: string) {
    return this.accountService.deleteUser(id);
  }

  @Get()
  @UseJwtGuard()
  async findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.accountService.listUsers({
      search,
      sort,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }
}
