import { ENV_CONST } from "@constants/environment.const";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Building } from "@modules/buildings/buildings.entity";
import { PrepareBuilding1734613370810 } from "@migrations/1734613370810-PrepareBuilding";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get(ENV_CONST.DB_HOST),
        port: +configService.get(ENV_CONST.DB_PORT),
        username: configService.get(ENV_CONST.DB_USERNAME),
        password: configService.get(ENV_CONST.DB_PASSWORD),
        database: configService.get(ENV_CONST.DB_NAME),
        entities: [
          Building
        ],
        migrations: [
          PrepareBuilding1734613370810
        ],
        synchronize: false, // turn off to avoid modification database
        ssl: false,
        cli: {
          migrationsDir: "src/core/migrations",
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  private readonly logger = new Logger(DatabaseModule.name);

  onModuleInit() {
    this.logger.verbose("-------------Database connection established successfully---------");
  }
}
