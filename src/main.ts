import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { DataSource } from "typeorm";

async function runMigrations() {
  const logger = new Logger();
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  logger.debug('start runMigrations');
  await dataSource.runMigrations()
  logger.debug('end runMigrations');
  await app.close();
}

async function bootstrap() {
  await runMigrations();

  const app = await NestFactory.create(AppModule);

  // init validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    })
  );

  // setup Swagger
  const config = new DocumentBuilder()
    .setTitle("Assignment")
    .setDescription("API documentation for Building function")
    .setVersion("1.0")
    .build();

  const logger = new Logger();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(3000);

  logger.verbose(`service running on port: 3000`);
}
bootstrap().then();
