import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserEntity } from '../../user/entities/user.entity';

export class UserRegisterDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly lastName: string;

  @ApiProperty({ required: true })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  readonly password: string;

  @ApiProperty({ required: true })
  @IsString()
  phone: string;

  @ApiProperty({ required: true })
  @MaxLength(3)
  phoneCode: string;

  @ApiProperty({ required: false })
  nationalityId?: Uuid;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referralCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referralUser: UserEntity;

  @ApiProperty({ required: true })
  @IsString()
  userName: string;
}
