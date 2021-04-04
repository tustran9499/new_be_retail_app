import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAccountDto {
  @IsOptional()
  @ApiPropertyOptional()
  username: string;

  @IsEmail()
  @ApiProperty()
  @Transform(it => it.value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiPropertyOptional()
  fName?: string;

  @IsOptional()
  @ApiPropertyOptional()
  lName?: string;

  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @ApiPropertyOptional()
  titleOfCourtesy?: string;

  @IsOptional()
  @ApiPropertyOptional()
  reportsTo?: number;

  @IsOptional()
  @ApiPropertyOptional()
  birthday?: string;

  @IsOptional()
  @ApiPropertyOptional()
  hireDate?: string;

  @IsOptional()
  @ApiPropertyOptional()
  homephone?: string;

  @IsOptional()
  @ApiPropertyOptional()
  extension?: string;

  @IsOptional()
  @ApiPropertyOptional()
  photoURL?: string;

  @IsOptional()
  @ApiPropertyOptional()
  notes?: string;

  @IsOptional()
  @ApiPropertyOptional()
  type?: string;

  @IsOptional()
  @ApiPropertyOptional()
  country?: string;

  @IsOptional()
  @ApiPropertyOptional()
  postalCode?: string;

  @IsOptional()
  @ApiPropertyOptional()
  region?: string;

  @IsOptional()
  @ApiPropertyOptional()
  city?: string;

  @IsOptional()
  @ApiPropertyOptional()
  address?: string;
}
