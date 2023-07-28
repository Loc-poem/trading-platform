import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PutOnSaleService } from '../put-on-sale.service';

@Injectable()
export class PutOnSaleTask {
  constructor(private readonly putOnSaleService: PutOnSaleService) {}

  @Cron('*/30 * * * * *')
  syncDataPutOnSale() {
    this.putOnSaleService
      .syncDataPutOnSale()
      .then((res) => res)
      .catch((error) => error);
  }

  @Cron('*/30 * * * * *')
  syncDataCancelPutOnSale() {
    this.putOnSaleService
      .syncDataCancelPutOnSale()
      .then((res) => res)
      .catch((error) => error);
  }
}
