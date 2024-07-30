import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from 'src/product/product.service';
import { UseJwtGuard } from 'src/utils/decorators/use-jwt-guard.decorator';
import { prependHostAndPort } from 'src/utils/getThumbnail';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
  ) {}

  @Post('product-thumbnail')
  @UseJwtGuard()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadProductThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id: string },
  ) {
    const filePath = prependHostAndPort(
      this.configService,
      `/uploads/products/${file.filename}`,
    );
    return await this.productService.updateThumbnail(body.id, filePath);
  }

  @Post('product-images')
  @UseJwtGuard()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `product-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadProductImages(
    @Body() body: { id: string; oldUrl: string[] },
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const filepaths = files.map((file) =>
      prependHostAndPort(
        this.configService,
        `/uploads/products/${file.filename}`,
      ),
    );
    return await this.productService.updateProductImage({
      id: body.id,
      thumbnails: filepaths,
      oldUrl: body.oldUrl,
    });
  }

  @Post()
  @UseJwtGuard()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const filePath = `/uploads/images/${file.filename}`;
    return prependHostAndPort(this.configService, filePath);
  }
}
