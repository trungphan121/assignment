import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { DatabaseModule } from "@database/database.module";
import { ConfigModule } from "@nestjs/config";
import { LoggerMiddleware } from "@middlewares/logger.middleware";
import { BuildingsModule } from "@modules/buildings/buildings.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    DatabaseModule,
    BuildingsModule
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes("/");
  }
}
