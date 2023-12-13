import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
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
    if (!auction) {
      const notObservableAuction = await AuctionEntity.findOneBy({ id });
      if (!notObservableAuction) {
        assert(notObservableAuction, new NotFoundException(`Auction with id ${id} not found`));
      }

      this.observableAuctions.push(notObservableAuction);
      auction = notObservableAuction;
    }

    return auction;
  }

  subscribe(auctionId: string, res: Response): void {
    this.getById(auctionId).then((auction) => {
      const observer = new AuctionObserver((updatedAuction) => {
        res.write(`data: ${JSON.stringify(updatedAuction)}\n\n`);
      });
      auction.attach(observer);
    });
  }
}
