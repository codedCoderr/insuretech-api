import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = configuration().port;
  await app.listen(port);
  console.log(`App is running on port ${port}`);
}
bootstrap();
