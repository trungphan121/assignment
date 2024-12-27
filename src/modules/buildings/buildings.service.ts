import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Building } from "@modules/buildings/buildings.entity";
import { Repository } from "typeorm";
import { CreateBuildingDto } from "@modules/buildings/dto/create-building.dto";
import { UpdateBuildingDto } from "@modules/buildings/dto/update-building.dto";

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>
  ) {
  }

  async create(createDto: CreateBuildingDto): Promise<Building> {
    const { parentId, ...data } = createDto;

    let parent = null;
    if (parentId) {
      parent = await this.buildingRepository.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundException(`Parent with id ${parentId} not found`);
      }
    }

    try {
      const createdBuilding = this.buildingRepository.create({
        ...data,
        parent
      });

      return this.buildingRepository.save(createdBuilding);
    } catch (e) {
      throw new BadRequestException(e);
    }

  }

  async findAll(): Promise<Building[]> {
    try {
      const buildings = await this.buildingRepository
        .createQueryBuilder("building")
        .leftJoinAndSelect("building.children", "children")
        .leftJoinAndSelect("building.parent", "parent")
        .select([
          "building.id",
          "building.building",
          "building.name",
          "building.locationNumber",
          "building.area",
          "parent.id",
          "children.id",
          "children.name",
          "children.locationNumber",
          "children.area"
        ])
        .getMany();

      return buildings;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: string): Promise<Building> {
    const building = await this.buildingRepository.findOne({
      where: { id },
      relations: ["parent", "children"]
    });

    if (!building) {
      throw new NotFoundException(`Building with id ${id} not found`);
    }

    return building;
  }

  async update(id: string, updateDto: UpdateBuildingDto): Promise<Building> {

    // A la parent cua B, B la parent cua C, C la parent cua D

    // b have id : 2, parent id: 1
    // a have id : 1
    // input: {id: 1, parent id: 2}

    const building = await this.findOne(id);
    if (!building) {
      throw new NotFoundException(`Building with id ${id} not found`);
    }

    if (updateDto.parentId) {
      const parent = await this.buildingRepository.findOne({
        where: { id: updateDto.parentId }
      });

      if (!parent) {
        throw new NotFoundException(`Parent ${updateDto.parentId} not found`);
      }

      // input: {id: 1, parent id: 2}
      // loop 1 b.id: 2, a.id: 1 -> continue find parent b
      // loop 2: a.id: 1, a.id: 1 -> wrong tree -> exception

      // input: {id: 1, parent id: 3}
      // loop 1 c.id: 3, a.id: 1 -> continue find parent c
      // loop 2: b.id: 2, a.id: 1 -> continue find parent b
      // loop 3: a.id: 1, a.id: 1 -> wrong tree -> exception

      // input: {id: 2, parent id: 1}
      // loop 1: a.id: 1, b.id: 2 -> continue update

      // input: {id: 3 parent id: 2}
      // loop 1: b.id: 2, b.id: 3 -> continue find parent b
      // loop 2: a.id: 1, b.id: 3 -> continue update

      let currentParent = parent;
      while (currentParent) {
        if (currentParent.id === building.id) {
          throw new BadRequestException(`Cannot update parent with id ${updateDto.parentId}`);
        }

        if (!currentParent.parent) {
          break;
        }

        currentParent = await this.buildingRepository.findOne({
          where: { id: currentParent.parent.id },
        });
      }

      building.parent = parent;
    }

    try {
      Object.assign(building, updateDto);
      return this.buildingRepository.save(building);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: string): Promise<void> {
    const building = await this.findOne(id);
    if (!building) {
      throw new NotFoundException(`Building with id ${id} not found`);
    }
    await this.buildingRepository.remove(building);
  }
}
