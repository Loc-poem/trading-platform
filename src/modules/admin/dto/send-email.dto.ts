import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ required: true })
  @IsString()
  context: string;

  @ApiProperty({ required: true })
  @IsString()
  subject: string;

  @ApiProperty({ required: true })
  @IsString()
  listMail: string;
}
