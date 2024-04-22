import { AuctionEntity } from './entities/auction.entity';
import { UserEntity } from '../user/entities/user.entity';
import { LotEntity } from '../lot/entities/lot.entity';

export class AuctionEntityBuilder {
  private readonly auction: AuctionEntity;

  constructor(
    name: string,
    startDate: Date,
    duration: number,
    startPrice: number,
    lot: LotEntity,
    owner: UserEntity,
  ) {
    this.auction = new AuctionEntity();
    this.auction.name = name;
    this.auction.startDate = startDate;
    this.auction.duration = duration;
    this.auction.startPrice = startPrice;
    this.auction.lot = lot;
    this.auction.owner = owner;
  }

  withDescription(description: string): AuctionEntityBuilder {
    this.auction.description = description;
    return this;
  }

  withExtension(extension: number): AuctionEntityBuilder {
    this.auction.extension = extension;
    return this;
  }

  build(): AuctionEntity {
    return this.auction;
  }
}
