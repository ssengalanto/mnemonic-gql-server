import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserRepository } from '@modules/user/user.repository';
import { CurrentUser } from '@shared/interfaces';

import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUser> {
    const { sub } = payload;
    const user = await this.userRepository.findOne({ where: { id: sub, active: true } });

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }
}
