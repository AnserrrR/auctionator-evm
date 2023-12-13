import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotService } from './lot.service';
import { LotEntity } from './entities/lot.entity';

@Module({
  providers: [LotService],
  imports: [
    TypeOrmModule.forFeature([LotEntity]),
  ],
})
export class LotModule {}
