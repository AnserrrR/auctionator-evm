import { Injectable, NotFoundException } from '@nestjs/common';
import { merge } from 'lodash';
import { AuctionEntity } from './entities/auction.entity';
import assert from '../../common/assert';
import { AuctionObserver } from './auction.observer';

@Injectable()
export class AuctionService {
  private readonly observableAuctions: AuctionEntity[] = [];

  async getById(id: string): Promise<AuctionEntity> {
    let auction = this.observableAuctions.find(
      (item) => item.id === id,
    );

    const actualAuction = await AuctionEntity.findOneBy({ id });
    assert(actualAuction, new NotFoundException(`Auction with id ${id} not found`));

    if (!auction) {
      this.observableAuctions.push(actualAuction);
      auction = actualAuction;
    } else {
      merge(auction, actualAuction);
    }

    return auction;
  }

  subscribe(id: string, updateFunction: (auction: AuctionEntity) => void): void {
    this.getById(id).then((auction) => {
      const observer = new AuctionObserver(updateFunction);
      auction.attach(observer);
    });
  }

  async extendDurationAndPrice(id: string, price: number): Promise<AuctionEntity> {
    const auction = await this.getById(id);

    auction.extendDuration();
    auction.extendPrice(price);

    await auction.save();
    auction.notify();

    return auction;
  }

  async decideAuctionWinner(id: string): Promise<AuctionEntity> {
    const auction = await this.getById(id);
    assert(auction, new NotFoundException(`Auction with id ${id} not found`));

    await auction.decideWinner();
    return auction;
  }
}
