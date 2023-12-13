import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { ImageStoreService } from './services/image-store.service';
import { ImageStoreEntity } from './entities/image-store.entity';
import { ImageStoreUpdateInput } from './inputs/image-store-update.input';

@Resolver()
export class FilesResolver {
  private readonly logger = new Logger(FilesResolver.name);

  constructor(
    private readonly imageStoreService: ImageStoreService,
  ) {}

  /**
   * Updates the image store in the database
   * (specifically isVisible)
   * @param input
   */
  @Mutation(
    () => ImageStoreEntity,
    { description: 'Updates the image store in the database (specifically isVisible)' },
  )
  async updateImageStore(
    @Args('input') input: ImageStoreUpdateInput,
  ): Promise<ImageStoreEntity> {
    this.logger.log(`updateImageStore: ${JSON.stringify(input)}`);
    return this.imageStoreService.update(input);
  }
}
