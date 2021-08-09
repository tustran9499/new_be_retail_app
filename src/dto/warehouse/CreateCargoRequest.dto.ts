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

  @ApiProperty()
  warehouseId: number;

  @ApiProperty()
  ToStoreId: number;

  @IsNotEmpty()
  @ApiProperty()
  StoreId: number;

  @IsNotEmpty()
  @ApiProperty()
  UserId: number;
}

export class CreateReturnCargoRequestDto {
  @IsNotEmpty()
  @ApiProperty({ type: [Number] })
  ProductId: number[];

  @IsNotEmpty()
  @ApiProperty()
  CargoRequestId: number;

  @IsNotEmpty()
  @ApiProperty({ type: [Number] })
  Quantity: number[];

  @IsNotEmpty()
  @ApiProperty()
  UserId: number;
}

export class ProductArrayDto {
  @ApiProperty({ type: [Number] })
  ProductId: number[];
}

export class UpdateCargoRequestDto {
  @ApiProperty({ type: [Number] })
  ProductId: number[];

  @ApiProperty({ type: [Number] })
  Quantity: number[];

  @ApiProperty()
  warehouseId: number;

  @ApiProperty()
  ToStoreId: number;

  @ApiProperty()
  StoreId: number;

  @ApiProperty()
  Notes: string;

  @ApiProperty()
  Status: string;
}
