import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SummaryPeriodDto {

  @IsNotEmpty()
  @ApiProperty()
  startTime: Date;

  @IsNotEmpty()
  @ApiProperty()
  endTime: Date;

}
