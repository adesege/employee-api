import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "app.module";
import { useContainer } from "class-validator";

export const configureApp = (app: INestApplication): void => {
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
