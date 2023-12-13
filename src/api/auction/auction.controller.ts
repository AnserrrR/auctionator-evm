import {
  Controller, Get, Param, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuctionService } from './auction.service';
import { ApiBearerAuth } from '@nestjs/swagger';

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

    this.auctionService.subscribe(auctionId, res);
  }
}
