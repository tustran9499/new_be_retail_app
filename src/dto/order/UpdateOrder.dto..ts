import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Guid } from 'guid-typescript';

export class UpdateOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  customerId: number;

  @IsNotEmpty()
  @ApiProperty()
  saleClerkId: number;

  @IsNotEmpty()
  @ApiProperty()
  sessionId: string;
}
