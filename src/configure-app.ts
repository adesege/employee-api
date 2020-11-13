import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "app.module";
import { useContainer } from "class-validator";

export const configureApp = (app: NestExpressApplication): void => {
  app.set('trust proxy', true);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    whitelist: true
  }));

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });
}
