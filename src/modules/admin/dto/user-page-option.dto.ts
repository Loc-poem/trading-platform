import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class UserPageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive: boolean;
}
