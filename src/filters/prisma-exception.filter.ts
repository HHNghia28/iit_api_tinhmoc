import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception);
    switch (exception.code) {
      case 'P2002':
        const failedField = exception.meta.target;
        return response.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.CONFLICT,
          message: 'Validation failed',
          error: { [failedField]: `Dữ liệu đã được sử dụng!` },
        });
      case 'P2011':
        return response.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          error: {
            [exception.meta.constraint[0]]: `Dữ liệu không tồn tại (1)!`,
          },
        });

      case 'P2003' || 'P2025':
        return response.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: 'Dữ liệu không tồn tại !',
        });

      case 'P2025':
        return response.status(HttpStatus.NOT_FOUND).json({
          status: HttpStatus.NOT_FOUND,
          message: 'Không tìm thấy dữ liệu !',
        });

      default:
        if (exception instanceof HttpException) {
          const status = exception.getStatus();
          const { message, errors } = exception.getResponse() as any;

          return response.status(HttpStatus.BAD_REQUEST).json({
            status: status,
            message: message || 'UNKNOWN ERROR',
            error: errors || {},
          });
        }

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'UNKNOWN ERROR',
        });
    }
  }

  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const formattedErrors = {};

    errors.forEach((error) => {
      formattedErrors[error.property] = Object.values(error.constraints);
    });

    return formattedErrors;
  }
}
