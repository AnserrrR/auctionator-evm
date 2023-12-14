import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BidService } from './bid.service';
import { BidCreateDto } from './dtos/bid-create.dto';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { BidUpdateDto } from './dtos/bid-update.dto';
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
    @CurrentAuth('user') user: UserEntity,
  ): Promise<BidEntity> {
    return this.bidService.create(bidCreateDto, user);
  }

  /**
   * Update a bid
   */
  @Patch()
  async bidUpdate(
    @Body() bidUpdateDto: BidUpdateDto,
    @CurrentAuth('user') user: UserEntity,
  ): Promise<BidEntity> {
    return this.bidService.update(bidUpdateDto, user);
  }
}
