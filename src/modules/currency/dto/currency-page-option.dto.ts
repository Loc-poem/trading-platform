import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class CurrencyPageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  chainId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive: string;
}
