import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ required: true })
  @IsString()
  userName: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;
}
