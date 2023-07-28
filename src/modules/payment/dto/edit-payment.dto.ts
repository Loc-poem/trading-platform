import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaymentType } from '../enums/payment.enums';
import type { CreatePaymentAccountNumberDto } from './create-payment-account-number.dto';

export class EditPaymentDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: Uuid;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  listPaymentAccountNumber?: CreatePaymentAccountNumberDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note: string;
}
