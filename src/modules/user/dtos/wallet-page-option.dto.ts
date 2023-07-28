import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class WalletPageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  chainId: number;
}
