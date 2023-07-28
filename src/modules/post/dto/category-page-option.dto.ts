import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class CategoryPageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isPublic?: string | boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;
}
