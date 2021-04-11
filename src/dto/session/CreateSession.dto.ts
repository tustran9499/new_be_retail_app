import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSessionDto {
    @IsNotEmpty()
    @ApiProperty()
    SaleclerkId: number;

}
