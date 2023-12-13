import { AfterLoad, Column, Entity } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { ImageControllerEndpoints } from '../endpoints/image-controller-endpoints';
import { FileStoreEntity } from './file-store.entity';

/**
 * Entity for storing images.
 */
@Entity()
export class ImageStoreEntity extends FileStoreEntity {
  /**
   * Image width in pixels after resizing.
   */
  @Column('integer', { nullable: true })
  width?: number;

  /**
   * Image height in pixels after resizing.
   */
  @Column('integer', { nullable: true })
  height?: number;

  /**
   * URL to view this image, starts with "/".
   */
  url?: string;

  /**
   * URL to download this image, starts with "/".
   */
  downloadUrl?: string;

  /**
   * URL to view AVATAR of this image, starts with "/".
   */
  avatarUrl?: string;

  /**
   * Is image visible to users.
   */
  @Column({ type: 'boolean', nullable: false, default: true })
  isVisible: boolean;

  /**
   * Check sum of file content.
   */
  @ApiHideProperty()
  @Column('text', { nullable: true })
  checksum?: string;

  /**
   * Auto-generation after entity select.
   */
  @AfterLoad()
  generateUrl() {
    this.url = ImageControllerEndpoints.imageView(this);
    this.downloadUrl = ImageControllerEndpoints.imageDownload(this);
    this.avatarUrl = ImageControllerEndpoints.avatarGet(this);
  }
}
