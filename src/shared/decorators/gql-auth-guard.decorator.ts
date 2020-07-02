import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { AppContext } from '@shared/interfaces';
import { AuthService } from '@modules/auth/auth.service';
import { JwtPayload } from '@modules/auth/interfaces';
import { Cookie, COOKIE_OPTIONS } from '@shared/enums';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req as Request;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext() as AppContext;

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) throw new UnauthorizedException();

    const accessToken = authorizationHeader.split(' ')[1];

    const refreshToken = req.cookies[Cookie.REFRESH_TOKEN];

    if (!accessToken || !refreshToken) throw new UnauthorizedException();

    const isValidAccessToken = this.authService.validateTokenExpiry(accessToken);
    if (isValidAccessToken) return this.activate(context);

    const isValidRefreshToken = this.authService.validateTokenExpiry(refreshToken);
    if (!isValidRefreshToken) throw new UnauthorizedException();

    if (isValidRefreshToken) {
      const user = await this.authService.validateRefreshToken(refreshToken);
      if (!user) throw new UnauthorizedException();

      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };

      const newAccessToken = this.authService.createAccessToken(jwtPayload);
      const newRefreshToken = this.authService.createRefreshToken(jwtPayload);

      req.headers.authorization = `Bearer ${newAccessToken}`;

      req.cookies[Cookie.REFRESH_TOKEN] = newRefreshToken;

      res.cookie(Cookie.REFRESH_TOKEN, newRefreshToken, COOKIE_OPTIONS);
    }
    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
