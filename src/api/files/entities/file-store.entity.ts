import { AfterLoad, Column, Entity } from 'typeorm';
import { FilesControllerEndpoints } from '../endpoints/files-controller-endpoints';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';

/**
 * Entity for storing files.
 */
@Entity()
export class FileStoreEntity extends AppBaseEntity {
  /**
   * Original file name with extension.
   * "image.jpg", "document.pdf", etc.
   */
  @Column('text')
  name: string;

  /**
   * File description if needed.
   */
  @Column('text', { nullable: true })
  description?: string;

  /**
   * File extension with dot.
   * ".jpg", ".png", ".pdf", etc.
   */
  @Column('text')
  ext: string;

  /**
   * File URL to get this file from current backend.
   * Starts with "/".
   */
  url?: string;

  /**
   * Auto-generation after entity select.
   */
  @AfterLoad()
  generateUrl() {
    this.url = FilesControllerEndpoints.fileGet(this);
  }
}
