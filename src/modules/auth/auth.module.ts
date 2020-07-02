import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@modules/user/user.module';

import { JwtFactory, JwtStrategy } from './strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';
import { GqlAuthGuard } from '@shared/decorators';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ useClass: JwtFactory }),
  ],
  providers: [AuthResolver, AuthService, CryptoService, JwtStrategy, GqlAuthGuard],
  exports: [JwtStrategy, PassportModule, AuthService, GqlAuthGuard],
})
export class AuthModule {}
