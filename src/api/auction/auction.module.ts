import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionService } from './auction.service';
import { AuctionEntity } from './entities/auction.entity';
import { AuctionController } from './auction.controller';

@Module({
  controllers: [AuctionController],
  providers: [
    AuctionService,
  ],
  imports: [
    TypeOrmModule.forFeature([AuctionEntity]),
  ],
  exports: [
    AuctionService,
  ],
})
export class AuctionModule {}
