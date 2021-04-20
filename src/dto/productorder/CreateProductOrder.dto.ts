import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductOrderDto {
    @IsNotEmpty()
    @ApiProperty()
    ProductId: number;

    @IsNotEmpty()
    @ApiProperty()
    OrderId: number;

    @IsNotEmpty()
    @ApiProperty()
    Price: number;

    @IsNotEmpty()
    @ApiProperty()
    Quantity: number;

    @IsOptional()
    @ApiPropertyOptional()
    ReturnedQuantity: number;

    @IsOptional()
    @ApiPropertyOptional()
    Tax: number;
}
