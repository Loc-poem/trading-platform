import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class PostPageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  postCategoryId?: Uuid;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isPublic?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  authorId?: Uuid;
}
