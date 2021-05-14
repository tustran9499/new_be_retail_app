import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateStoreDto {
  @IsOptional()
  @ApiPropertyOptional()
  Phone: string;

  @IsOptional()
  @ApiPropertyOptional()
  Fax: string;

  @IsOptional()
  @ApiPropertyOptional()
  Address: string;

  @IsOptional()
  @ApiPropertyOptional()
  Country?: string;

  @IsOptional()
  @ApiPropertyOptional()
  PostalCode?: string;

  @IsOptional()
  @ApiPropertyOptional()
  Region?: string;

  @IsOptional()
  @ApiPropertyOptional()
  City?: string;

  @IsOptional()
  @ApiPropertyOptional()
  Size?: string;

  @IsOptional()
  @ApiPropertyOptional()
  Price?: string;

  @IsNotEmpty()
  @ApiProperty()
  ShortName: string;

  @IsOptional()
  @ApiPropertyOptional()
  WarehouseId?: string;

  @IsNotEmpty()
  @ApiProperty()
  AddressCoorLat: string;
  

  @IsNotEmpty()
  @ApiProperty()
  AddressCoorLong: string;

}
