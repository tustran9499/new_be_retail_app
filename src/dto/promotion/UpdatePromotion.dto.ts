import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdatePromotionDto {
  @IsOptional()
  @ApiPropertyOptional()
  Description: string;

  @IsNotEmpty()
  @ApiProperty()
  Quantity: number;

  @IsNotEmpty()
  @ApiProperty()
  StartTime: Date;

  @IsNotEmpty()
  @ApiProperty()
  EndTime: Date;

  @IsNotEmpty()
  @ApiProperty()
  PercentOff: number;

}
