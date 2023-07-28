import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: Uuid;
}
