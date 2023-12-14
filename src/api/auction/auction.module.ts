import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionService } from './auction.service';
import { AuctionEntity } from './entities/auction.entity';
import { AuctionController } from './auction.controller';
import { BidEntity } from '../bid/entities/bid.entity';
import { LotEntity } from '../lot/entities/lot.entity';

@Module({
  controllers: [AuctionController],
  providers: [
    AuctionService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      AuctionEntity,
      BidEntity,
      LotEntity,
    ]),
  ],
  exports: [
    AuctionService,
  ],
})
export class AuctionModule {}
