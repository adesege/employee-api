import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ConfigService } from 'services/config/config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    whitelist: true
  }));

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'));
}

bootstrap();
