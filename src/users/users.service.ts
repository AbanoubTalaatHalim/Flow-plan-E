import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { DatabaseErrorCodes } from '~src/common/enums';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { User } from './entities';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersRepository) private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === DatabaseErrorCodes.UniqueViolation) {
        throw new BadRequestException(`${user.email} is already taken.`);
      }

      throw new InternalServerErrorException('An unexpected error has occurred.');
    }
  }

  read(options?: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.find(options);
  }

  async readById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      return null;
    }

    return user;
  }

  async readByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      return null;
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      return null;
    }

    Object.assign(user, updateUserDto);

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === DatabaseErrorCodes.UniqueViolation) {
        throw new BadRequestException(`${user.email} is already taken.`);
      }

      throw new InternalServerErrorException('An unexpected error has occurred.');
    }
  }

  async delete(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      return null;
    }

    return this.usersRepository.remove(user);
  }
}
