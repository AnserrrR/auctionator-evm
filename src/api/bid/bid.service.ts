import { Injectable, NotFoundException } from '@nestjs/common';
import { BidCreateDto } from './dtos/bid-create.dto';
import { BidEntity } from './entities/bid.entity';
import { AuctionService } from '../auction/auction.service';
import { UserEntity } from '../user/entities/user.entity';
import { BidStatusEnum } from './enums/bid-status.enum';
import { BidUpdateDto } from './dtos/bid-update.dto';
import assert from '../../common/assert';

@Injectable()
export class BidService {
  constructor(
    private readonly auctionService: AuctionService,
  ) {}

  async create(input: BidCreateDto, user: UserEntity): Promise<BidEntity> {
    const auction = await this.auctionService.extendDurationAndPrice(input.auctionId, input.price);

    await BidEntity.update({
      auction: {
        id: input.auctionId,
      },
    }, {
      status: BidStatusEnum.LOST,
    });

    return BidEntity.create({
      auction,
      price: input.price,
      bidder: user,
    }).save();
  }

  async update(input: BidUpdateDto, user: UserEntity): Promise<BidEntity> {
    const bid = await BidEntity.findOne({
      where: {
        id: input.id,
        bidder: {
          id: user.id,
        },
      },
      relations: {
        auction: true,
      },
    });
    assert(bid, new NotFoundException(`Bid with id ${input.id} not found`));

    await this.auctionService.extendDurationAndPrice(bid.auction.id, input.price);
    await BidEntity.update({
      auction: {
        id: bid.auction.id,
      },
    }, {
      status: BidStatusEnum.LOST,
    });

    bid.price = input.price;
    bid.status = BidStatusEnum.ACTIVE;
    return bid.save();
  }
}
