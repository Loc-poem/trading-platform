import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { CurrencyDto } from '../../currency/dto/currency.dto';
import type { ProfitEntity } from '../entities/profit.entity';
import type { ProfitType } from '../enums/admin.enums';

export class ProfitDto extends AbstractDto {
  totalAmount: string;

  chainId: number;

  currencyId: Uuid;

  currency: CurrencyDto;

  type: ProfitType;

  constructor(profit: ProfitEntity) {
    super(profit);
    this.totalAmount = profit.totalAmount;
    this.chainId = profit.chainId;
    this.currencyId = profit.currencyId;
    this.type = profit.type;

    if (profit.currency) {
      this.currency = profit.currency.toDto();
    }
  }
}
