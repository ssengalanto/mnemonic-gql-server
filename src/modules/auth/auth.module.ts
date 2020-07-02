import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@modules/user/user.module';

import { JwtFactory, JwtStrategy } from './strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ useClass: JwtFactory }),
  ],
  providers: [AuthResolver, AuthService, CryptoService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
