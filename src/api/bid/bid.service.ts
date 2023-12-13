import { Injectable } from '@nestjs/common';
import { BidCreateDto } from './dtos/bid-create.dto';
import { BidEntity } from './entities/bid.entity';
import { AuctionService } from '../auction/auction.service';

@Injectable()
export class BidService {
  constructor(
    private readonly auctionService: AuctionService,
  ) {}

  async bidCreate(input: BidCreateDto): Promise<BidEntity> {
    const auction = await this.auctionService.getById(input.auctionId);

    auction.notify();
    return BidEntity.create({ auction, price: input.price }).save();
  }
}
