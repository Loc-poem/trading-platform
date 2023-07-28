import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { PaymentType } from '../enums/payment.enums';

export class ListPaymentPageOptionDto extends PageOptionsDto {
  @ApiProperty({ required: false, enum: PaymentType })
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;
}
