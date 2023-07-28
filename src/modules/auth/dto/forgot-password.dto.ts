import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  email: string;
}
