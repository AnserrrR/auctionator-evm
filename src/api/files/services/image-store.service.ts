import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import assert from '../../../common/assert';
import { ImageStoreEntity } from '../entities/image-store.entity';
import { ImageStoreUpdateInput } from '../inputs/image-store-update.input';

@Injectable()
export class ImageStoreService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Updates the image store in the database
   * @param input
   */
  async update(input: ImageStoreUpdateInput): Promise<ImageStoreEntity> {
    const imageStore = await this.dataSource.manager.findOneBy(ImageStoreEntity, {
      id: input.id,
    });
    assert(imageStore, new NotFoundException('Image not found'));
    imageStore.isVisible = input.isVisible;
    return imageStore.save();
  }
}
