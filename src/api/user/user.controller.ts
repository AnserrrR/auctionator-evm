import { Controller, Get, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { ICurrentAuth } from '../auth/interfaces/current-auth.interface';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Get current authorized user
   * @param auth - Current authorization
   * @returns Current DocuBackUserEntity
   */
  @Get('user-current')
  async userCurrent(
    @CurrentAuth() auth: ICurrentAuth,
  ): Promise<UserEntity> {
    this.logger.log(`userCurrent: ${JSON.stringify(auth)}`);
    return this.userRepository.findByIdOrThrow(auth.user.id);
  }
}
