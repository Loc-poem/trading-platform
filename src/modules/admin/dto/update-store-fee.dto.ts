import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { CreateStoreFeeDto } from './create-store-fee.dto';

export class UpdateStoreFeeDto extends CreateStoreFeeDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: Uuid;
}
