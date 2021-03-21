import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationRequest } from 'src/common/dto/pagination.dto';

export class GetRequest extends PaginationRequest {
  @ApiPropertyOptional()
  search: string;

  @ApiPropertyOptional()
  searchBy?: string;

  @ApiPropertyOptional()
  searchKeyword?: string;
}
