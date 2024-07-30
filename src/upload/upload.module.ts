import { Module } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, AccountService, ProductService],
})
export class UploadModule {}
