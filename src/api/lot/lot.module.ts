import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotService } from './lot.service';
import { LotEntity } from './entities/lot.entity';
import { FilesModule } from '../files/files.module';
import { LotController } from './lot.controller';

@Module({
  providers: [LotService],
  imports: [
    TypeOrmModule.forFeature([LotEntity]),
    FilesModule,
  ],
  controllers: [LotController],
})
export class LotModule {}
