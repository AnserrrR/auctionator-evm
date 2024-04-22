import { Injectable, NotFoundException } from '@nestjs/common';
import { merge } from 'lodash';
import { AuctionEntity } from './entities/auction.entity';
import assert from '../../common/assert';
import { AuctionObserver } from './auction.observer';
import { AuctionEntityBuilder } from './auction-entity-builder';

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

  subscribe(id: string, updateFunction: (auction: AuctionEntity) => void): AuctionObserver {
    const observer = new AuctionObserver(updateFunction);
    this.getById(id).then((auction) => {
      auction.attach(observer);
    });
    return observer;
  }

  unsubscribe(id: string, observer: AuctionObserver): void {
    const auction = this.observableAuctions.find(
      (item) => item.id === id,
    );
    if (!auction) {
      return;
    }
    auction.detach(observer);
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

  async createAuction(input: AuctionEntity): Promise<AuctionEntity> {
    const builder = new AuctionEntityBuilder(
      input.name,
      input.startDate,
      input.duration,
      input.startPrice,
      input.lot,
      input.owner,
    );
    if (input.description) {
      builder.withDescription(input.description);
    }
    if (input.extension) {
      builder.withExtension(input.extension);
    }
    const auction = builder.build();
    return auction;
  }
}
