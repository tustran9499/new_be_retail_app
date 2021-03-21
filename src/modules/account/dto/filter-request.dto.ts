import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationRequest } from 'src/common/dto/pagination.dto';

export class AccountsFilterRequestDto extends PaginationRequest {
  @ApiPropertyOptional()
  searchBy?: string;

  @ApiPropertyOptional()
  searchKeyword?: string;
}
