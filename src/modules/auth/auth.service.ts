import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '@shared/typeorm/entities';
import { CreateUserInput } from '@modules/user/inputs';
import { UserRepository } from '@modules/user/user.repository';
import { Cookie, Constant, COOKIE_OPTIONS } from '@shared/enums';

import { JwtPayload } from './interfaces';
import { SigninUserInput } from './inputs';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async signup(payload: CreateUserInput, res: Response): Promise<string> {
    const { password } = payload;

    const hashedPassword = await this.cryptoService.hash(password, Constant.SALT);

    const user = await this.userRepository.createOne({ ...payload, password: hashedPassword });

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const accessToken = this.createAccessToken(jwtPayload);
    const refreshToken = this.createRefreshToken(jwtPayload);

    res.cookie(Cookie.REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);

    return accessToken;
  }

  async signin(payload: SigninUserInput, res: Response): Promise<string> {
    const jwtPayload = await this.validateUser(payload);

    if (!jwtPayload) throw new UnauthorizedException();

    const accessToken = this.createAccessToken(jwtPayload);
    const refreshToken = this.createRefreshToken(jwtPayload);

    res.cookie(Cookie.REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);

    return accessToken;
  }

  async validateRefreshToken(token: string): Promise<User | null> {
    const { sub } = this.jwtService.verify(token);

    const user = await this.userRepository.findOne({ where: { id: sub, active: true } });

    if (!user) return null;
    return user;
  }

  createAccessToken(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload);
  }

  createRefreshToken(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<number>('REFRESH_JWT_EXPIRES_IN'),
    });
  }

  validateTokenExpiry(token: string): boolean {
    const { exp } = this.jwtService.verify(token, { ignoreExpiration: true });

    const currentDate = new Date().getTime();
    const expiryDate = exp * 1000;

    if (currentDate > expiryDate) return false;

    return true;
  }

  async validateUser(payload: SigninUserInput): Promise<JwtPayload | null> {
    const { email, password } = payload;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) return null;

    const isPasswordValid = await this.cryptoService.verify(password, user.password);

    if (!isPasswordValid) return null;

    return {
      sub: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    } as JwtPayload;
  }
}
