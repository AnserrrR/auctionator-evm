import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { AuthResolver } from './auth.resolver';
import { RemoteAuthService } from './services/remote-auth.service';
import { UserEntity } from '../user/entities/user-.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    RemoteAuthService,
    JwtStrategy,
  ],
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}
