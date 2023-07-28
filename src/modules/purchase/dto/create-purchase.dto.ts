import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty({ required: true })
  @IsString()
  buyAmount: string;

  @ApiProperty({ required: true })
  @IsUUID()
  putOnSaleId: Uuid;
}
