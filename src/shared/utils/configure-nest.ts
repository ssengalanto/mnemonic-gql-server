import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

export const configureNest = (app: NestExpressApplication): NestExpressApplication => {
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  return app;
};
