import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { FiatCurrencyEntity } from '../entities/fiat-currency.entity';

export class FiatCurrencyDto extends AbstractDto {
  code: string;

  symbol: string;

  name: string;

  exchangeRate: string;

  constructor(fiatCurrency: FiatCurrencyEntity) {
    super(fiatCurrency);
    this.code = fiatCurrency.code;
    this.symbol = fiatCurrency.symbol;
    this.name = fiatCurrency.name;
    this.exchangeRate = fiatCurrency.exchangeRate;
  }
}
