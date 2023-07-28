import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { UpdateDto } from '../../../common/dto/update.dto';

export class BuyerConfirmPayDto extends UpdateDto {
  @ApiProperty({ required: true })
  @IsUUID()
  paymentId: Uuid;
}
