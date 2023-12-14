import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm';
import { LotEntity } from './entities/lot.entity';
import assert from '../../common/assert';
import { LotFilterDto } from './dto/lot-filter.dto';
import { LotCreateDto } from './dto/lot-create-dto';
import { UserEntity } from '../user/entities/user.entity';
import { ImageStoreService } from '../files/services/image-store.service';
import { LotUpdateDto } from './dto/lot-update-dto';
import { UserRoleEnum } from '../user/enums/user-role.enum';

@Injectable()
export class LotService {
  constructor(
    private readonly imageStoreService: ImageStoreService,
  ) {}

  private readonly lotRelations: FindOptionsRelations<LotEntity> = {
    images: true,
    owner: true,
  };

  async getById(id: string): Promise<LotEntity> {
    const lot = await LotEntity.findOne({
      where: {
        id,
      },
      relations: this.lotRelations,
    });
    assert(lot, new NotFoundException(`Lot with id ${id} not found`));

    return lot;
  }

  async getFiltered(filter: LotFilterDto): Promise<LotEntity[]> {
    return LotEntity.find({
      where: {
        owner: {
          id: filter.ownerId,
        },
      },
      ...filter,
      relations: {
        images: true,
      },
    });
  }

  async create(input: LotCreateDto, user: UserEntity): Promise<LotEntity> {
    const lot = new LotEntity();
    lot.name = input.name;
    lot.description = input.description;
    lot.owner = user;
    lot.images = await this.imageStoreService.getByIds(input.imageIds);

    return LotEntity.save(lot);
  }

  async update(input: LotUpdateDto, user: UserEntity): Promise<LotEntity> {
    const lot = await LotEntity.findOne({
      where: {
        id: input.id,
        owner: user.role === UserRoleEnum.Admin
          ? undefined
          : {
            id: user.id,
          },
      },
      relations: this.lotRelations,
    });
    assert(lot, new NotFoundException(`Lot with id ${input.id} not found`));

    lot.name = input.name !== undefined ? input.name : lot.name;
    lot.description = input.description !== undefined ? input.description : lot.description;
    lot.images = input.imageIds
      ? await this.imageStoreService.getByIds(input.imageIds)
      : lot.images;

    return lot.save();
  }

  async delete(id: string, user: UserEntity): Promise<boolean> {
    await LotEntity.delete({
      id,
      owner: user.role === UserRoleEnum.Admin
        ? undefined
        : {
          id: user.id,
        },
    });

    return true;
  }
}
