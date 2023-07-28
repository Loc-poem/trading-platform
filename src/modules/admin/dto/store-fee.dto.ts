import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { StoreFeeEntity } from '../entities/store-fee.entity';

export class StoreFeeDto extends AbstractDto {
  fee: string;

  minFiatAmountUsd: number;

  isDefault: boolean;

  constructor(storeFee: StoreFeeEntity) {
    super(storeFee);
    this.fee = storeFee.fee;
    this.minFiatAmountUsd = storeFee.minFiatAmountUsd;
    this.isDefault = storeFee.isDefault;
  }
}
