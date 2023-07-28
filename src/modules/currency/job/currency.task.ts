import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CurrencyService } from '../currency.service';

@Injectable()
export class CurrencyTask {
  constructor(private readonly currencyService: CurrencyService) {}

  @Cron('0 */10 * * * *')
  getCurrencyExchangeRate() {
    this.currencyService
      .syncCryptoExchangeRate()
      .then((res) => res)
      .catch((error) => error);
  }

  @Cron('0 0 */6 * * *')
  getFiatCurrencyExchangeRate() {
    this.currencyService
      .syncFiatCurrencyExchangeRate()
      .then((res) => res)
      .catch((error) => error);
  }
}
