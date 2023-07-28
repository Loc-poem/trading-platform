import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyOtpCodeDto {
  @ApiProperty({ required: true })
  @IsString()
  otpCode: string;

  @ApiProperty({ required: true })
  @IsString()
  email: string;
}
