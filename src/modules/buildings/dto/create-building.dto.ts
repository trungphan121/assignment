import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBuildingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  building: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  area: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  parentId?: string;
}
