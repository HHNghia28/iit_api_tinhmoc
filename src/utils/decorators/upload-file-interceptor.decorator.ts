import { UseInterceptors, applyDecorators } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { storage } from '../multer';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import BadRequestResponse from 'src/@types/errors/bad-request-response';

export function UploadFileInterceptor(
  fieldName: string,
  fileSizeLimit: number = +process.env.FILE_LIMIT || 10485760,
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: storage,
        preservePath: true,
        limits: {
          files: 1,
          fileSize: fileSizeLimit,
        },
      }),
    ),
  );
}

export function UploadFilesInterceptor(
  fieldName: string,
  fileSizeLimit = +process.env.FILE_LIMIT || 10485760,
) {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, Infinity, {
        storage: storage,
        preservePath: true,
        limits: {
          fileSize: fileSizeLimit,
        },
      }),
    ),
  );
}

export function UploadMultiFileFieldsInterceptor(
  uploadFields: MulterField[],
  fileSizeLimit = +process.env.FILE_LIMIT || 10485760,
) {
  const imageFileFilter = (req: any, file: any, callback: any) => {
    if (file && !file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new BadRequestResponse('Hình ảnh không hợp lệ !'), false);
    }
    callback(null, true);
  };

  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(uploadFields, {
        storage: storage,
        preservePath: true,
        limits: {
          fileSize: fileSizeLimit,
        },
        fileFilter: imageFileFilter,
      }),
    ),
  );
}
