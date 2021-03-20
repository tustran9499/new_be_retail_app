import { IsPositive, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationRequest {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  take: number;

  @ApiProperty({
    required: false,
  })
  orderBy?: string;

  @ApiProperty({
    required: false,
    enum: SortDirection,
  })
  orderDirection?: SortDirection;
}
