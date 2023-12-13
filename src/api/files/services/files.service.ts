import { Injectable } from '@nestjs/common';
import ContentDisposition from 'content-disposition';
import path from 'node:path';
import * as uuid from 'uuid';
import { FileStoreEntity } from '../entities/file-store.entity';
import { S3Service } from './s3.service';

/**
 * Files service for uploading files to S3, creating file store entity, etc.
 */
@Injectable()
export class FilesService {
  constructor(private readonly s3: S3Service) {}

  /**
   * Upload file to S3 and create FileStoreEntity.
   * @param filename File name with extension.
   * @param buffer File content.
   * @param description File description if needed.
   * @return FileStoreEntity
   */
  async createFileStore(filename: string, buffer: Buffer, description?: string): Promise<FileStoreEntity> {
    const id = uuid.v4();
    const ext = path.extname(filename);
    await Promise.all([
      this.s3.uploadFile(
        this.fileGetS3Key({ id, ext }),
        buffer,
        { 'Content-Disposition': ContentDisposition(filename, { type: 'attachment' }) },
      ),
      FileStoreEntity.save({
        id,
        name: filename,
        ext,
        description,
      }),
    ]);
    return FileStoreEntity.findOneByOrFail({ id });
  }

  /**
   * Get file key in current S3 bucket.
   * @param file - FileStoreEntity
   * @return string - file key in S3 bucket.
   */
  public fileGetS3Key(file: Pick<FileStoreEntity, 'id' | 'ext'>) {
    return `files/${file.id}${file.ext}`;
  }
}
