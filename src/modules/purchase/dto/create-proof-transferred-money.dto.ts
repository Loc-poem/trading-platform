import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProofTransferredMoneyData {
  @ApiProperty({ required: true })
  imageUrl?: string;
}

export class CreateProofTransferredMoneyDto {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsString()
  purchaseId: Uuid;

  @ApiProperty({ required: true })
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsArray()
  dataProof: ProofTransferredMoneyData[];
}
