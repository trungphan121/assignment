import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { BuildingsService } from "./buildings.service";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateBuildingDto } from "@modules/buildings/dto/create-building.dto";
import { UpdateBuildingDto } from "@modules/buildings/dto/update-building.dto";
import { Building } from "@modules/buildings/buildings.entity";

@ApiTags("Buildings")
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  async create(@Body() createDto: CreateBuildingDto) {
    return this.buildingsService.create(createDto);
  }

  @Get()
  @ApiResponse({type: [Building]})
  async findAll(): Promise<Building[]> {
    return this.buildingsService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: Building})
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Building> {
    return this.buildingsService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: CreateBuildingDto })
  @ApiResponse({type: Building})
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateBuildingDto): Promise<Building> {
    return this.buildingsService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.buildingsService.remove(id);
    return { message: `Building with id ${id} deleted` };
  }
}
