import {
  Column, Entity, JoinTable, ManyToMany, ManyToOne,
} from 'typeorm';
import { ImageStoreEntity } from '../../files/entities/image-store.entity';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { UserEntity } from '../../user/entities/user.entity';

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
  @Column('text', { nullable: true })
  description?: string;

  /**
   * Owner of the lot
   */
  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  /**
   * Image of the lot
   */
  @ManyToMany(() => ImageStoreEntity)
  @JoinTable()
  images: ImageStoreEntity[];
}
