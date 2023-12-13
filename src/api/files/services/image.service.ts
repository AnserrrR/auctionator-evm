import {
  Injectable, InternalServerErrorException, Logger, NotFoundException,
} from '@nestjs/common';
import ContentDisposition from 'content-disposition';
import type { Response } from 'express';
import heic from 'heic-convert';
import path from 'node:path';
import sharp from 'sharp';
import * as uuid from 'uuid';
import crypto from 'crypto';
import { ImageStoreEntity } from '../entities/image-store.entity';
import { IFileOrImageUploadBody } from '../interfaces/file-or-image-upload-body.interface';
import { S3Service } from './s3.service';

/**
 * Image service for uploading/updating images to S3, creating image store entity, etc.
 */
@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    private readonly s3: S3Service,
  ) {}

  /**
   * Get image from S3 and send to client.
   * @param imageName - ID with or without ext. "<uuid>" or "<uuid>.<ext>".
   * @param res - Express response object.
   * @param args - Additional arguments.
   */
  public async imageGet(
    imageName: string,
    res: Response,
    args: { wantAvatar?: boolean, doDownload?: boolean } = {},
  ): Promise<void> {
    const id = path.basename(imageName, path.extname(imageName));
    const image = await ImageStoreEntity.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Image not found');
    });
    const s3key = this.imageGetS3Key(image, args.wantAvatar);
    if (args.doDownload) {
      const stream = await this.s3.createStream(s3key);
      stream.pipe(res);
      res.setHeader('Content-Disposition', ContentDisposition(image.name, { type: 'attachment' }));
      res.setHeader('Content-Type', 'image/jpeg');
    } else {
      const presignedUrl = await this.s3.getPresignedUrl(s3key);
      res.redirect(presignedUrl);
    }
  }

  /**
   * Upload/Update image to S3 and save image metadata to database.
   * @param file - Multer file object.
   * @param body - Request body.
   * @param imageName - Image name if need to update. "<uuid>" or "<uuid>.<ext>".
   * @param angle - Image rotation angle in degrees. "90", "135", "270".
   */
  public async imageUpsert(
    file: Express.Multer.File,
    body: IFileOrImageUploadBody,
    imageName?: string,
    angle?: string,
  ): Promise<ImageStoreEntity> {
    const checksum = crypto
      .createHash('md5')
      .update(file.buffer)
      .digest('hex');

    if (!imageName) {
      const existedImage = await ImageStoreEntity.findOneBy({
        checksum,
      });
      if (existedImage) {
        return existedImage;
      }
    }

    const id = imageName ? path.basename(imageName, path.extname(imageName)) : uuid.v4();
    if (imageName && !await ImageStoreEntity.countBy({ id })) {
      throw new NotFoundException('Image not found');
    }
    const fileOriginalName = body.filename || file.originalname;
    try {
      const bufferSrc = path.extname(fileOriginalName).toLowerCase() === '.heic'
        ? Buffer.from(await heic({ buffer: file.buffer, format: 'JPEG', quality: 1 }))
        : file.buffer;
      const [bufferImage, bufferAvatar] = await Promise.all([
        sharp(bufferSrc)
          .resize(1000)
          .rotate(Number(angle || 0))
          .jpeg({ mozjpeg: true, quality: 70 })
          .toBuffer(),
        sharp(bufferSrc)
          .resize(100)
          .rotate(Number(angle || 0))
          .jpeg({ mozjpeg: true, quality: 50 })
          .toBuffer(),
      ]);
      const metadata = await sharp(bufferImage).metadata();
      await Promise.all([
        this.s3.uploadFile(this.imageGetS3Key({ id, ext: '.jpg' }), bufferImage, {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': ContentDisposition(fileOriginalName, { type: 'inline' }),
        }),
        this.s3.uploadFile(this.imageGetS3Key({ id, ext: '.jpg' }, true), bufferAvatar, {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': ContentDisposition(`avatar_${fileOriginalName}`, { type: 'inline' }),
        }),
        ImageStoreEntity.upsert({
          id,
          name: fileOriginalName,
          ext: '.jpg',
          description: body.description,
          width: metadata.width,
          height: metadata.height,
          checksum,
        }, { conflictPaths: ['id'] }),
      ]);
      return await ImageStoreEntity.findOneByOrFail({ id });
    } catch (e) {
      this.logger.error(`Cannot upload image: ${fileOriginalName}`);
      this.logger.error(e);
      throw new InternalServerErrorException('Cannot upload this image');
    }
  }

  /**
   Get image file key in current S3 bucket.
   * @param image - ImageStoreEntity
   * @param wantAvatar - If you need to get avatar image key.
   */
  public imageGetS3Key(image: Pick<ImageStoreEntity, 'id' | 'ext'>, wantAvatar = false): string {
    return `images/${image.id}${wantAvatar ? '_avatar' : ''}${image.ext}`;
  }
}
