import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import UnauthorizedReponse from 'src/@types/errors/unauthorized-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const { response: responseMsg } = exceptionResponse as any;

    console.log(exceptionResponse, responseMsg);

    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        const { message } = exception.getResponse() as any;
        console.log(message);
        console.log(
          new UnauthorizedReponse('Unauthorized', message).getResponse(),
        );
        response
          .status(status)
          .json(new UnauthorizedReponse('Unauthorized', message).getResponse());
        break;
      case HttpStatus.BAD_REQUEST:
        if (responseMsg) {
          response.status(status).json(responseMsg);
        } else response.status(status).json(exceptionResponse);

        break;
      case HttpStatus.FORBIDDEN:
        response.status(status).json(responseMsg);
        break;
      default:
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
    }
  }
}
