import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule, QueryInfo, loggingMiddleware } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';
import { UploadModule } from './upload/upload.module';
import { AccountModule } from './account/account.module';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log', // default is `debug`
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
        ],
      },
    }),
    ConfigModule.forRoot(),
    AuthModule,
    UploadModule,
    AccountModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, ProductService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
