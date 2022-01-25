import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '~src/users/entities';
import { UsersService } from '~src/users/users.service';
import { RegisterDto } from './dtos';
import { AuthorizedUser, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthorizedUser> {
    const user = await this.usersService.create(registerDto);

    const tokens = await this.generateTokens(user.id, user.email);

    await this.usersService.update(user.id, { refreshToken: tokens.refreshToken });

    return {
      user,
      tokens,
    };
  }

  async logIn(user: User): Promise<AuthorizedUser> {
    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);

    await this.usersService.update(user.id, { refreshToken });

    return { user, tokens: { accessToken, refreshToken } };
  }

  logOut(id: number): Promise<User> {
    return this.usersService.update(id, { refreshToken: null });
  }

  async refreshTokens(id: number) {
    const user = await this.usersService.readById(id);

    if (!user) {
      throw new NotFoundException();
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.usersService.update(user.id, { refreshToken: tokens.refreshToken });

    return tokens;
  }

  async generateTokens(id: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.usersService.readByEmail(email);

    if (!user) {
      return null;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return null;
    }

    return user;
  }
}
