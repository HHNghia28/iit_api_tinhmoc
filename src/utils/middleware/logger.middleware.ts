import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Gets the request log

    console.log('--------------------------------------------');
    console.log(`req:`, {
      // headers: req.headers,
      originalUrl: req.originalUrl,
      body: req.body,
    });
    // Ends middleware function execution, hence allowing to move on
    if (next) {
      next();
    }
  }
}
