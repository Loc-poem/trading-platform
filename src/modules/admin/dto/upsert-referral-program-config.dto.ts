import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class ReferralProgramConfigData {
  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  level: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  rewardPercent: number;
}

export class UpsertReferralProgramConfigDto {
  @ApiProperty({ required: true })
  @IsArray()
  referralProgramConfig: ReferralProgramConfigData[];
}
