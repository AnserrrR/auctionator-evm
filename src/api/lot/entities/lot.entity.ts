import {
  Column, Entity, JoinTable, ManyToMany,
} from 'typeorm';
import { ImageStoreEntity } from '../../files/entities/image-store.entity';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';

/**
 * Lot entity
 */
@Entity()
export class LotEntity extends AppBaseEntity {
  /**
   * Name of the lot
   */
  @Column('text')
  name: string;

  /**
   * Description of the lot
   */
  @Column('text')
  description: string;

  /**
   * Image of the lot
   */
  @ManyToMany(() => ImageStoreEntity)
  @JoinTable()
  images: ImageStoreEntity;
}
