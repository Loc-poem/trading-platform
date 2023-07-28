import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePaymentAccountNumberDto {
  @ApiProperty({ required: true })
  @IsString()
  accountNumber: string;
}
