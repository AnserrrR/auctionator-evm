/* eslint-disable no-case-declarations */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '../../../config/config.service';
import { UserEntity } from '../../user/entities/user-.entity';
import { ICurrentAuth } from '../interfaces/current-auth.interface';

/**
 * Strategy for authorization by JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      secretOrKey: configService.config.jwtToken.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * Method automatically callable after access token
   *    validation for additional checks of the current session.
   */
  async validate(payload: IJwtPayload, done: Function): Promise<ICurrentAuth> {
    const user = await this.userRepository.findOneByOrFail({ id: payload.id }).catch(() => {
      throw new UnauthorizedException('User not found');
    });
    if (user.jwtKey !== payload.key) {
      throw new UnauthorizedException('Unauthorized');
    }
    return { jwtPayload: payload, user };
  }
}
