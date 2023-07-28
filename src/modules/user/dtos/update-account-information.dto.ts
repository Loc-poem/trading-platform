import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { NationalityEntity } from '../entities/nationality.entity';

export class UpdateAccountInformationDto {
  @ApiProperty({ required: true })
  @IsString()
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  nationalityId?: Uuid;

  @ApiProperty({ required: false })
  @IsOptional()
  nationality: NationalityEntity;
}
