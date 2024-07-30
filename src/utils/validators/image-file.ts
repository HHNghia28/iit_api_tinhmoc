import {
  BadRequestException,
  FileTypeValidator,
  ParseFileOptions,
} from '@nestjs/common';
import BadRequestResponse from 'src/@types/errors/bad-request-response';

export const imageFile = (
  name: string,
  fileIsRequired = true,
): ParseFileOptions => {
  return {
    validators: [new FileTypeValidator({ fileType: 'image/*' })],
    exceptionFactory: (msg) => {
      const response = new BadRequestResponse({ [name]: msg });

      return new BadRequestException(response);
    },
    fileIsRequired,
  };
};
