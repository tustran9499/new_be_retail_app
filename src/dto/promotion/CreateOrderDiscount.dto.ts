import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateOrderDiscountDto {

  @IsNotEmpty()
  @ApiProperty()
  MinBill: number;

  @IsNotEmpty()
  @ApiProperty()
  MaxDiscount: number;

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
