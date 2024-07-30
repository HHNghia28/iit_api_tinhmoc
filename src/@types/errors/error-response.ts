import { HttpException, HttpStatus } from '@nestjs/common';

export default class ErrorResponse extends HttpException {
  constructor(
    public errors: string,
    public statusCode: HttpStatus,
    public message: string,
  ) {
    super(
      {
        status: statusCode,
        error: errors,
        message,
      },
      statusCode,
    );
  }
}
