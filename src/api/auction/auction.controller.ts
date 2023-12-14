import {
  Controller, Get, Param, Patch, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuctionService } from './auction.service';
import { AuctionEntity } from './entities/auction.entity';

@ApiBearerAuth('JWT')
@Controller('auction')
export class AuctionController {
  constructor(
    private readonly auctionService: AuctionService,
  ) {}

  /**
   * Subscribe to auction updates
   */
  @Get('subscribe/:auctionId')
  subscribe(
    @Param('auctionId') auctionId: string,
    @Res() res: Response,
  ): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();

    this.auctionService.subscribe(auctionId, (auction) => {
      res.write(`data: ${JSON.stringify(auction)}\n\n`);
    });
  }

  /**
   * Get auction by id
   */
  @Get(':id')
  async getById(
    @Param('id') id: string,
  ): Promise<AuctionEntity> {
    return this.auctionService.getById(id);
  }

  /**
   * Decide auction winner
   */
  @Patch(':id/decide-winner')
  async decideAuctionWinner(
    @Param('id') id: string,
  ): Promise<AuctionEntity> {
    return this.auctionService.decideAuctionWinner(id);
  }
}
