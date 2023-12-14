import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { AuctionEntity } from '../../auction/entities/auction.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { BidStatusEnum } from '../enums/bid-status.enum';

@Entity()
export class BidEntity extends AppBaseEntity {
  /**
   * Price of the bid
   */
  @Column('money')
  price: number;

  /**
   * Auction
   */
  @ManyToOne(() => AuctionEntity)
  auction: AuctionEntity;

  /**
   * Bidder
   */
  @ManyToOne(() => UserEntity, { eager: true })
  bidder: UserEntity;

  /**
   * Status of the bid
   * @enum BidStatusEnum
   */
  @Column('enum', { enum: BidStatusEnum, default: BidStatusEnum.ACTIVE })
  status: BidStatusEnum;
}
