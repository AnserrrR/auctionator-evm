import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  InternalServerErrorException, Logger,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { AuthService } from './services/auth.service';
import { CurrentAuth } from './decorators/current-auth.decorator';
import { ICurrentAuth } from './interfaces/current-auth.interface';
import { ConfigService } from '../../config/config.service';

/**
 * Resolver for users login and logout.
 */
@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Auth by remote service and upsert user in database.
   * If remote service not available -> auth by database.
   * @param login - User login.
   * @param password - User password.
   * @returns JWT.
   */
  @Mutation(() => String, {
    description: 'Returns JWT. Tries auth by remote service or database.',
  })
  @Public()
  async loginByPassword(
    @Args('login') login: string,
    @Args('password') password: string,
  ): Promise<string> {
    const userEntity = await this.authService.checkUserThoughDatabase({ login, password }).catch((err: Error) => {
      throw err;
    });
    if (!userEntity.jwtKey) {
      userEntity.jwtKey = await this.authService.generateJwtKey();
      await userEntity.save();
    }
    return this.authService.generateAccessToken({
      id: userEntity.id,
      key: userEntity.jwtKey,
    });
  }

  /**
   * Logout and invalidate all previously created JWTs.
   * @param auth - Current auth.
   */
  @Mutation(() => Boolean, {
    description: 'Logout and invalidate all previously created JWTs',
  })
  async logout(@CurrentAuth() auth: ICurrentAuth): Promise<boolean> {
    if (!auth.user.id) {
      throw new InternalServerErrorException('User ID not found');
    }
    await this.authService.userLogout(auth.user.id);
    return true;
  }
}
