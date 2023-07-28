import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CancelPutOnSaleDto {
  @ApiProperty({ required: true })
  @IsString()
  walletAddress: string;
}
