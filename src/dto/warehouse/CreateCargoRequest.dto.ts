import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateCargoRequestDto {
  @IsNotEmpty()
  @ApiProperty({ type: [Number] })
  ProductId: number[];

  @IsNotEmpty()
  @ApiProperty({ type: [Number] })
  Quantity: number[];

  @IsNotEmpty()
  @ApiProperty()
  warehouseId: number;

  @IsNotEmpty()
  @ApiProperty()
  StoreId: number;

  @IsNotEmpty()
  @ApiProperty()
  UserId: number;
}

export class UpdateCargoRequestDto {
  @ApiProperty({ type: [Number] })
  ProductId: number[];

  @ApiProperty({ type: [Number] })
  Quantity: number[];

  @ApiProperty()
  warehouseId: number;

  @ApiProperty()
  StoreId: number;

  @ApiProperty()
  Notes: string;

  @ApiProperty()
  Status: string;
}
