import { IObserver } from '../../common/observer/observer.interface';
import { AuctionEntity } from './entities/auction.entity';

export class AuctionObserver implements IObserver<AuctionEntity> {
  constructor(
    private readonly updateAuction: (auction: AuctionEntity) => void,
  ) {}

  update(auction: AuctionEntity): void {
    this.updateAuction(auction);
  }
}
