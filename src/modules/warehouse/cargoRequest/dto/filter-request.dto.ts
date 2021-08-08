import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationRequest } from "src/common/dto/pagination.dto";

export class FilterRequestDto extends PaginationRequest {
  @ApiPropertyOptional()
  order?: any;

  @ApiPropertyOptional()
  searchBy?: string;

  @ApiPropertyOptional()
  searchKeyword?: string;

  @ApiProperty()
  userId?: number;

  @ApiProperty()
  storeId?: number;

  @ApiProperty()
  warehouseId?: number;
}

export class FilterReturnedRequestDto extends PaginationRequest {
  @ApiPropertyOptional()
  order?: any;

  @ApiPropertyOptional()
  searchBy?: string;

  @ApiPropertyOptional()
  searchKeyword?: string;

  @ApiProperty()
  userId?: number;
}
