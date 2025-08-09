import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Multer } from 'multer';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME', '468ed122-asleep');
    this.region = this.configService.get<string>('S3_REGION', 'ru-1');
    
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY');
    const endpoint = this.configService.get<string>('S3_ENDPOINT', 'https://s3.twcstorage.ru');
    
    this.logger.log(`S3 Configuration: Bucket=${this.bucketName}, Region=${this.region}, Endpoint=${endpoint}`);
    this.logger.log(`S3 Credentials: AccessKeyId=${accessKeyId ? '***' + accessKeyId.slice(-4) : 'NOT_SET'}`);
    
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: any, folder: string = 'uploads'): Promise<string> {
    try {
      const fileName = this.generateFileName(file.originalname);
      const key = `${folder}/${fileName}`;

      this.logger.log(`Attempting to upload file: ${fileName} to bucket: ${this.bucketName}, key: ${key}`);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Убираем ACL, так как некоторые S3-совместимые хранилища могут не поддерживать
        // ACL: 'public-read',
      });

      this.logger.log(`Sending S3 command...`);
      await this.s3Client.send(command);
      
      const fileUrl = `${this.configService.get<string>('S3_ENDPOINT', 'https://s3.twcstorage.ru')}/${this.bucketName}/${key}`;
      
      this.logger.log(`File uploaded successfully: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error uploading file: ${errorMessage}`);
      this.logger.error(`Error details:`, error);
      throw new Error(`Failed to upload file: ${errorMessage}`);
    }
  }

  async uploadMultipleFiles(files: any[], folder: string = 'uploads'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${fileUrl}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error deleting file: ${errorMessage}`);
      throw new Error(`Failed to delete file: ${errorMessage}`);
    }
  }

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error generating presigned URL: ${errorMessage}`);
      throw new Error(`Failed to generate presigned URL: ${errorMessage}`);
    }
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  }

  private extractKeyFromUrl(fileUrl: string): string {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    // Убираем первый пустой элемент и bucket name
    return pathParts.slice(2).join('/');
  }

  getFileUrl(key: string): string {
    return `${this.configService.get<string>('S3_ENDPOINT', 'https://s3.twcstorage.ru')}/${this.bucketName}/${key}`;
  }
} 