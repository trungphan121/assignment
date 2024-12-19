import { Module } from "@nestjs/common";
import { BuildingsService } from "./buildings.service";
import { BuildingsController } from "./buildings.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Building } from "@modules/buildings/buildings.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Building])],
  providers: [BuildingsService],
  controllers: [BuildingsController],
})
export class BuildingsModule {}
