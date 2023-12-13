import {
  Body, Controller, Get, Logger, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as path from 'node:path';
import { Public } from '../../auth/decorators/public.decorator';
import { FilesControllerEndpoints } from '../endpoints/files-controller-endpoints';
import { FileStoreEntity } from '../entities/file-store.entity';
import { IFileOrImageUploadBody } from '../interfaces/file-or-image-upload-body.interface';
import { FilesService } from '../services/files.service';
import { S3Service } from '../services/s3.service';

/**
 * REST API controller for files upload and download.
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!! Warn: All methods are public without permission checks !!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
@Public()
@Controller(FilesControllerEndpoints.rootEndpoint)
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(
    private readonly filesService: FilesService,
    private readonly s3: S3Service,
  ) {}

  /**
   * Upload a file.
   * @param file - Multer file object.
   * @param body - Request body.
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() body: IFileOrImageUploadBody,
  ): Promise<FileStoreEntity> {
    this.logger.log(`fileUpload: ${file.originalname}`);
    const fileName = body.filename || file.originalname;
    return this.filesService.createFileStore(fileName, file.buffer, body.description);
  }

  /**
   * Download a file.
   * @param fileName - ID with or without ext. "<uuid>" or "<uuid>.<ext>".
   * @param res - Express response object.
   */
  @Get(FilesControllerEndpoints.childFileGet)
  async fileGet(
    @Param('id') fileName: string,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`fileGet: ${fileName}`);
    const id = path.basename(fileName, path.extname(fileName));
    const file = await FileStoreEntity.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('File not found');
    });
    const presignedUrl = await this.s3.getPresignedUrl(this.filesService.fileGetS3Key(file));
    res.redirect(presignedUrl);
  }
}
