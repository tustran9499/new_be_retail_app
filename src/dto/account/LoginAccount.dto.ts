import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginAccountDto {
  @ApiProperty()
  @IsEmail()
  @Transform(it => it.value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
