import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { StoreFeeDto } from '../dto/store-fee.dto';

@Entity({ name: 'store_fee' })
@UseDto(StoreFeeDto)
export class StoreFeeEntity extends AbstractEntity<StoreFeeDto> {
  @Column({ name: 'fee' })
  fee: string;

  @Column({ name: 'min_fiat_amount_usd', type: 'float' })
  minFiatAmountUsd: number;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}
