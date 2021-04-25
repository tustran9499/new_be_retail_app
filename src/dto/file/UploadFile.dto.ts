import { ApiProperty } from '@nestjs/swagger';

export class UploadFile {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
