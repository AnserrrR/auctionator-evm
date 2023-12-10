import { Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { UserEntity } from './entities/user-.entity';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { ICurrentAuth } from '../auth/interfaces/current-auth.interface';
import { UserRepository } from './user.repository';

@Resolver()
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Get current authorized user
   * @param auth - Current authorization
   * @returns Current DocuBackUserEntity
   */
  @Query(() => UserEntity, {
    description: 'Returns current authorized user',
  })
  async userCurrent(
    @CurrentAuth() auth: ICurrentAuth,
  ): Promise<UserEntity> {
    this.logger.log(`userCurrent: ${JSON.stringify(auth)}`);
    return this.userRepository.findByIdOrThrow(auth.user.id);
  }
}
