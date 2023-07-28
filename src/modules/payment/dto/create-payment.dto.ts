import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaymentType } from '../enums/payment.enums';
import type { CreatePaymentAccountNumberDto } from './create-payment-account-number.dto';

export class CreatePaymentDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  accountName: string;

  @ApiProperty({ required: true })
  @IsArray()
  listPaymentAccountNumber: CreatePaymentAccountNumberDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note: string;
}
