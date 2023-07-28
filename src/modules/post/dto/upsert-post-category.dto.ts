import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class UpsertPostCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @Type(() => Boolean)
  @IsBoolean()
  isPublic: boolean;
}
