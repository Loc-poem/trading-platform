import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class VerifyOtpPurchaseDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: Uuid;

  @ApiProperty({ required: true })
  @IsString()
  otpCode: string;
}
