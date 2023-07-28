import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class PendingPurchasePageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  chainId: number;
}
