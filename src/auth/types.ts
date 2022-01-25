import { User } from '~src/users/entities';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthorizedUser {
  user: User;
  tokens: Tokens;
}
