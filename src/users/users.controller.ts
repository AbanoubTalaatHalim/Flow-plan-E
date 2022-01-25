import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FindConditions, FindManyOptions, ObjectLiteral } from 'typeorm';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';

import { Serialize } from '~src/common/interceptors';
import { ParseFilterPipe, ParseLimitPipe, ParseSelectPipe, ParseSkipPipe, ParseSortPipe } from '~src/common/pipes';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dtos';
import { User } from './entities';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Serialize(ReadUserDto)
  @Get()
  read(
    @Query('filter', ParseFilterPipe) filter?: FindConditions<User>[] | FindConditions<User> | ObjectLiteral | string,
    @Query('select', ParseSelectPipe) select?: (keyof User)[],
    @Query('sort', ParseSortPipe) sort?: { [P in EntityFieldsNames<User>]?: 'ASC' | 'DESC' | 1 | -1 },
    @Query('limit', ParseLimitPipe) limit?: number,
    @Query('skip', ParseSkipPipe) skip?: number,
  ): Promise<User[]> {
    const options: FindManyOptions<User> = {};

    if (filter) options.where = filter;
    if (select) options.select = select;
    if (sort) options.order = sort;
    if (limit) options.take = limit;
    if (skip) options.skip = skip;

    return this.usersService.read(options);
  }

  @Serialize(ReadUserDto)
  @Get(':id')
  async readById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.readById(id);

    if (!user) {
      throw new NotFoundException('We couldn’t find the user you are looking for.');
    }

    return user;
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersService.update(id, updateUserDto);

    if (!user) {
      throw new NotFoundException('We couldn’t find the user you are looking for.');
    }

    return user;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.delete(id);

    if (!user) {
      throw new NotFoundException('We couldn’t find the user you are looking for.');
    }

    return user;
  }
}
