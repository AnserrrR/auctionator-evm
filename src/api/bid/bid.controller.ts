import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BidService } from './bid.service';
import { BidCreateDto } from './dtos/bid-create.dto';
import { BidEntity } from './entities/bid.entity';

@ApiBearerAuth('JWT')
@Controller('bid')
export class BidController {
  constructor(
    private readonly bidService: BidService,
  ) {}

  /**
   * Create a bid
   */
  @Post()
  async bidCreate(
    @Body() bidCreateDto: BidCreateDto,
  ): Promise<BidEntity> {
    return this.bidService.bidCreate(bidCreateDto);
  }
}
