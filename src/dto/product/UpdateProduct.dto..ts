import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @IsNotEmpty()
  @ApiProperty()
  ProductName: string;

  @IsOptional()
  @ApiPropertyOptional()
  CategoryId: number;

  @IsOptional()
  @ApiPropertyOptional()
  QuantityPerUnit: string;

  @IsOptional()
  @ApiPropertyOptional()
  UnitPrice: number;

  @IsOptional()
  @ApiPropertyOptional()
  UnitsInStock: number;

  @IsOptional()
  @ApiPropertyOptional()
  Quantity: number;

  @IsOptional()
  @ApiPropertyOptional()
  ReorderLevel: number;

  @IsOptional()
  @ApiPropertyOptional()
  Discontinued: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  Discount: number;

  // @IsOptional()
  // @ApiPropertyOptional()
  // PhotoURL: string;
}
