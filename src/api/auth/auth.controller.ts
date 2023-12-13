import {
  Body, Controller, InternalServerErrorException, Logger, Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { Public } from './decorators/public.decorator';
import { CurrentAuth } from './decorators/current-auth.decorator';
import { ICurrentAuth } from './interfaces/current-auth.interface';
import { LoginDto } from './dtos/login.dto';

/**
 * Controller for authentication
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  /**
   * Auth by remote service and upsert user in database.
   * If remote service not available -> auth by database.
   * @returns JWT.
   * @param input
   */
  @Post('login')
  @Public()
  async loginByPassword(
    @Body() input: LoginDto,
  ): Promise<string> {
    const userEntity = await this.authService.checkUserThoughDatabase({ ...input }).catch((err: Error) => {
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
  @ApiBearerAuth('JWT')
  @Post('logout')
  async logout(@CurrentAuth() auth: ICurrentAuth): Promise<boolean> {
    if (!auth.user.id) {
      throw new InternalServerErrorException('User ID not found');
    }
    await this.authService.userLogout(auth.user.id);
    return true;
  }
}
