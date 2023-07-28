import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UpdatePutOnSaleDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: Uuid;

  @ApiProperty({ required: true })
  @IsString()
  txId: string;
}
