import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class ServiceFeeTransactionPageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  from?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  to?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  chainId: number;
}
