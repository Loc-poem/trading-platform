import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ResentOtpPurchaseDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: Uuid;
}
