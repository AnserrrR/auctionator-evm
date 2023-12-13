import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { AuctionEntity } from '../auction/entities/auction.entity';
import { BidEntity } from './entities/bid.entity';
import { AuctionModule } from '../auction/auction.module';
import { BidController } from './bid.controller';

@Module({
  controllers: [BidController],
  providers: [
    BidService,
  ],
  imports: [
    TypeOrmModule.forFeature([AuctionEntity, BidEntity]),
    AuctionModule,
  ],
})
export class BidModule {}
