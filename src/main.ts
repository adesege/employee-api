import { NestFactory } from '@nestjs/core';
import { ConfigService } from 'services/config/config.service';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'));
}

bootstrap();
