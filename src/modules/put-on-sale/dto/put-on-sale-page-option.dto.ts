import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { PutOnSaleStatus } from '../enums/put-on-sale.enum';

export class PutOnSalePageOptionDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    enum: PutOnSaleStatus,
    description: `DRAFT = 1, PENDING = 2, ACTIVE = 3, FAIL = 4, CANCELED = 5, CANCEL_PENDING = 6, CANCEL_FAIL = 7,`,
  })
  @IsOptional()
  @Type(() => Number)
  status?: PutOnSaleStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  chainId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  currencyId?: Uuid;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  fiatCurrencyId?: Uuid;
}
