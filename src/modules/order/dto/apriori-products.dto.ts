import { ApiProperty } from "@nestjs/swagger";

export class AprioriProductsArrayDto {
  @ApiProperty({ type: [Number] })
  productIds: number[];
}
