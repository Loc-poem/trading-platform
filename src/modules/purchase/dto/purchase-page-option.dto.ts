import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { PurchaseStatus } from '../enums/purchase.enum';

export class PurchasePageOptionDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    enum: PurchaseStatus,
    description: `DRAFT = 1,
  WAITING_TO_PAYMENT = 2,
  BUYER_CONFIRM_PAY = 3,
  SELLER_CONFIRM_PAY = 4,

  BUYER_NOT_CONFIRM_PAY = 5,
  CANCEL = 6,
  PENDING_BY_DISABLE_USER = 7`,
  })
  @IsOptional()
  @Type(() => Number)
  status?: PurchaseStatus;

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
