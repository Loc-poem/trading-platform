import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubAdminDto {
  @ApiProperty({ required: true })
  @IsString()
  userName: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;
}
