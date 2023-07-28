import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePutOnSaleDto {
  @ApiProperty({ required: true })
  @IsUUID()
  currencyId: Uuid;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsNumber()
  chainId: number;

  @ApiProperty({ required: true })
  @IsString()
  amount: string;

  @ApiProperty({ required: true })
  @IsString()
  fromWalletAddress: string;

  @ApiProperty({ required: true })
  @IsArray()
  listAcceptablePaymentId: Uuid[];

  @ApiProperty({ required: true })
  @IsUUID()
  fiatCurrencyId: Uuid;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  minFiatAmount: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maxFiatAmount: string;
}
