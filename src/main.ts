import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('unity-config');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5001);
}
bootstrap();
