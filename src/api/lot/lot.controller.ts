import {
  Body, Controller, Delete, Get, Param, Patch, Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LotService } from './lot.service';
import { LotCreateDto } from './dto/lot-create-dto';
import { LotEntity } from './entities/lot.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { LotUpdateDto } from './dto/lot-update-dto';
import { LotFilterDto } from './dto/lot-filter.dto';

@ApiBearerAuth('JWT')
@Controller('lot')
export class LotController {
  constructor(
    private readonly lotService: LotService,
  ) {}

  /**
   * Create a lot
   * @param lotCreateDto
   * @param user
   */
  @Post()
  async lotCreate(
    @Body() lotCreateDto: LotCreateDto,
    @CurrentAuth('user') user: UserEntity,
  ): Promise<LotEntity> {
    return this.lotService.create(lotCreateDto, user);
  }

  /**
   * Update a lot
   * @param lotUpdateDto
   * @param user
   */
  @Patch()
  async lotUpdate(
    @Body() lotUpdateDto: LotUpdateDto,
    @CurrentAuth('user') user: UserEntity,
  ): Promise<LotEntity> {
    return this.lotService.update(lotUpdateDto, user);
  }

  /**
   * Delete a lot
   * @param id
   * @param user
   */
  @Delete(':id')
  async lotDelete(
    @Param('id') id: string,
    @CurrentAuth('user') user: UserEntity,
  ): Promise<boolean> {
    return this.lotService.delete(id, user);
  }

  /**
   * Get a lot by id
   * @param id
   */
  @Get(':id')
  async lotGetById(
    @Param('id') id: string,
  ): Promise<LotEntity> {
    return this.lotService.getById(id);
  }

  /**
   * Get filtered lots
   * @param user
   * @param filter
   */
  @Get()
  async lotGetFiltered(
    @CurrentAuth('user') user: UserEntity,
    @Body() filter: LotFilterDto,
  ): Promise<LotEntity[]> {
    return this.lotService.getFiltered(filter, user);
  }
}
