import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UpdateWithdrawDto {
  @ApiProperty({ required: true })
  @IsString()
  txId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsUUID()
  id: Uuid;
}
