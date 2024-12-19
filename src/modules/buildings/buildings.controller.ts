import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BuildingsService } from "./buildings.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateBuildingDto } from "@modules/buildings/dto/create-building.dto";
import { UpdateBuildingDto } from "@modules/buildings/dto/update-building.dto";

@ApiTags("Buildings")
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  async create(@Body() createDto: CreateBuildingDto) {
    return this.buildingsService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.buildingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.buildingsService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: CreateBuildingDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateBuildingDto) {
    return this.buildingsService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.buildingsService.remove(id);
    return { message: `Building with id ${id} deleted` };
  }
}
