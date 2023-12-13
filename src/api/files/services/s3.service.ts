import { Injectable } from '@nestjs/common';
import {
  BucketItem, Client, ItemBucketMetadata, UploadedObjectInfo,
} from 'minio';
import { Readable } from 'node:stream';
import { ConfigService } from '../../../config/config.service';
import { NodeEnv } from '../../../config/node-env.enum';

/**
 * Service for interacting with S3 object storage.
 */
@Injectable()
export class S3Service {
  private readonly minio: Client;

  constructor(private readonly configService: ConfigService) {
    this.minio = new Client({
      endPoint: this.configService.config.s3.endPoint,
      port: this.configService.config.s3.port,
      accessKey: this.configService.config.s3.accessKey,
      secretKey: this.configService.config.s3.secretKey,
      useSSL: process.env.NODE_ENV !== NodeEnv.Test
       && process.env.NODE_ENV !== NodeEnv.Dev,
    });
  }

  /**
   * Uploads a file to the bucket.
   * @param buffer - file buffer.
   * @param key - file path in the bucket.
   * @param metadata - file metadata.
   * @return UploadedObjectInfo - info about uploaded object.
   */
  async uploadFile(key: string, buffer: Buffer, metadata?: ItemBucketMetadata): Promise<UploadedObjectInfo> {
    return this.minio.putObject(this.configService.config.s3.bucketName, key, buffer, metadata);
  }

  /**
   * Checks if a file exists in the bucket.
   * @param key - file path in the bucket.
   */
  async isFileExists(key: string): Promise<boolean> {
    try {
      await this.minio.statObject(this.configService.config.s3.bucketName, key);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Removes a file from the bucket.
   * @param key
   */
  async removeFile(key: string): Promise<void> {
    await this.minio.removeObject(this.configService.config.s3.bucketName, key);
  }

  /**
   * Creates a readable stream to the object identified by key.
   * Usage:
   *  1. import type { Response } from Express
   *  2. @Res() res: Response
   *  3. stream.pipe(res)
   * @param key - file path in the bucket
   * @return Readable stream
   */
  async createStream(key: string): Promise<Readable> {
    return this.minio.getObject(this.configService.config.s3.bucketName, key);
  }

  /**
   * Returns a presigned URL to the object identified by key.
   * @param key - file path in the bucket
   * @return Presigned URL
   */
  async getPresignedUrl(key: string): Promise<string> {
    return this.minio.presignedGetObject(
      this.configService.config.s3.bucketName,
      key,
      this.configService.config.s3.presignedUrlExpiration,
    );
  }

  /**
   * Returns a list of objects in the bucket.
   * @param args - prefix and recursive flag.
   */
  async listObjects(
    args: { prefix?: string, recursive?: boolean } = {},
  ): Promise<BucketItem[]> {
    const stream = this.minio.listObjectsV2(
      this.configService.config.s3.bucketName,
      args.prefix ?? '',
      args.recursive ?? true,
    );
    const files: BucketItem[] = [];
    for await (const file of stream) {
      files.push(file);
    }
    return files;
  }
}
