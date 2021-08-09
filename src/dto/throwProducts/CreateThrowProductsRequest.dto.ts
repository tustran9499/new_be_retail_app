import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { PaginationRequest } from "src/common/dto/pagination.dto";

export class CreateThrowProductsRequest {
  @IsNotEmpty()
  @ApiProperty()
  accountId: number;

  @IsNotEmpty()
  @ApiProperty()
  productId: number;

  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsOptional()
  @ApiPropertyOptional()
  status: string;

  @IsNotEmpty()
  @ApiProperty()
  storeId: number;

  @IsOptional()
  @ApiPropertyOptional()
  createdAt: Date;

  @IsOptional()
  @ApiPropertyOptional()
  thrownAt: Date;
}

export class GetThrowProductsRequest extends PaginationRequest {
  @ApiPropertyOptional()
  searchBy?: string;

  @ApiPropertyOptional()
  searchKeyword?: string;

  @IsNotEmpty()
  @ApiProperty()
  accountId: number;

  @IsNotEmpty()
  @ApiProperty()
  storeId: number;
}
