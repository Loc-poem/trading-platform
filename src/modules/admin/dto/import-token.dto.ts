import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImportTokenDto {
  @ApiProperty({ required: true })
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'E26' })
  @IsString()
  tokenId: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'E26' })
  @IsString()
  key: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'E26' })
  @Type(() => Number)
  chainId: number;
}
