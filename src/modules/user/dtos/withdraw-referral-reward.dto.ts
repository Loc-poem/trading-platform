import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class WithdrawReferralRewardDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  chainId: number;
}
