import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class WithdrawTokenDto {
  @ApiProperty({ required: true })
  @IsString()
  userWalletAddress: string;

  @ApiProperty({ required: true })
  @IsArray()
  listWalletId: Uuid[];

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  chainId: number;
}
