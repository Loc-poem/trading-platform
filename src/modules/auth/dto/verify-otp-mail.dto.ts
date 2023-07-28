import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyOtpMailDto {
  @ApiProperty({ required: true })
  @IsString()
  otpCode: string;
}
