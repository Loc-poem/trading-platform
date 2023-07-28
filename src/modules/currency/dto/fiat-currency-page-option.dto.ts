import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class FiatCurrencyPageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search: string;
}
