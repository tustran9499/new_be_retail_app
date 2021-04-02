import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
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
  ReorderLevel: number;

  @IsOptional()
  @ApiPropertyOptional()
  Discontinued: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  PhotoURL: string;
}
