import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyChangePasswordOtpDto {
  @ApiProperty({ required: true })
  @IsString()
  otpCode: string;
}
