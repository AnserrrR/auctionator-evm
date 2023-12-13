import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { AuctionEntity } from '../../auction/entities/auction.entity';

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
}
