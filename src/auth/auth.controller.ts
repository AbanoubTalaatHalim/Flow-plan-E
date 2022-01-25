import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { User as UserEntity } from '~src/users/entities';
import { UsersService } from '~src/users/users.service';
import { AuthService } from './auth.service';
import { User } from './decorators';
import { RegisterDto } from './dtos';
import { AccessTokenGuard, RefreshTokenGuard, LocalGuard } from './guards';
import { AuthorizedUser } from './types';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<AuthorizedUser> {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@User() user): Promise<AuthorizedUser> {
    return this.authService.logIn(user);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('log-out')
  logOut(@User('id') id: number): Promise<UserEntity> {
    return this.authService.logOut(id);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@User('id') id: number) {
    return this.authService.refreshTokens(id);
  }
}
