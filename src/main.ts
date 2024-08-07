import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { json, static as static_ } from 'express';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import BadRequestResponse from './@types/errors/bad-request-response';
import { HttpExceptionFilter } from './filters/catch-http-exception.filter';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        let msg: any = {};
        errors.forEach((error) => {
          msg = {
            ...msg,
            [error.property]:
              error.constraints[Object.keys(error.constraints)[0]],
          };
        });
        const response = new BadRequestResponse(msg);
        return new BadRequestException(response);
      },
    }),
  );

  app.setGlobalPrefix('api');

  // Enable CORS
  app.use(cors());

  // Serve static files from the 'uploads' directory
  app.use('/uploads', static_(path.join(process.cwd(), 'uploads')));

  console.log(path.join(process.cwd(), 'uploads'));

  app.use(json({ limit: '200mb' }));

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter),
    new PrismaExceptionFilter(),
    new HttpExceptionFilter(),
  );

  const cfgService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(cfgService.get<number>('PORT'));
}

bootstrap();
