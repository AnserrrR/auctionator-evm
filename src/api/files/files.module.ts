import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { FilesController } from './controllers/files.controller';
import { ImageController } from './controllers/image.controller';
import { FilesService } from './services/files.service';
import { ImageService } from './services/image.service';
import { S3Service } from './services/s3.service';
import { ImageStoreService } from './services/image-store.service';
import { FilesResolver } from './files.revolver';
import { ImageStoreEntity } from './entities/image-store.entity';
import { FileStoreEntity } from './entities/file-store.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      ImageStoreEntity,
      FileStoreEntity,
    ]),
  ],
  controllers: [
    ImageController,
    FilesController,
  ],
  providers: [
    FilesResolver,
    FilesService,
    ImageService,
    ImageStoreService,
    S3Service,
  ],
  exports: [
    FilesService,
    ImageService,
    ImageStoreService,
    S3Service,
  ],
})
export class FilesModule {}
