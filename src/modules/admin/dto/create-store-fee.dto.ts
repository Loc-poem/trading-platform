import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class StoreFeeDto {
  @ApiProperty({ required: true })
  @IsString()
  fee: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  minFiatAmountUsd: number;
}

export class CreateStoreFeeDto {
  @ApiProperty({ required: true })
  @IsArray()
  dataCreateStoreFee: StoreFeeDto[];
}
