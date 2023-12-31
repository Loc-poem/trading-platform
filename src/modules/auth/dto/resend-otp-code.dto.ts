import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResendOtpCodeDto {
  @ApiProperty({ required: true })
  @IsString()
  email: string;
}
