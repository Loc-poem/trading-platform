import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateUserActiveDto {
  @ApiProperty({ required: true })
  @IsUUID()
  userId: Uuid;

  @ApiProperty({ required: true })
  @IsBoolean()
  @Type(() => Boolean)
  isActive: boolean;
}
