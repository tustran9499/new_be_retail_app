import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsNotEmpty()
  @ApiProperty()
  Address: string;

  @IsOptional()
  @ApiPropertyOptional()
  City: string;

  @IsOptional()
  @ApiPropertyOptional()
  ContactName: string;

  @IsOptional()
  @ApiPropertyOptional()
  ContactTitle: string;

  @IsOptional()
  @ApiPropertyOptional()
  Country: string;

  @IsOptional()
  @ApiPropertyOptional()
  Fax: string;

  @IsOptional()
  @ApiPropertyOptional()
  Phone: string;

  @IsOptional()
  @ApiPropertyOptional()
  PostalCode: string;

  @IsOptional()
  @ApiPropertyOptional()
  Region: string;
}
