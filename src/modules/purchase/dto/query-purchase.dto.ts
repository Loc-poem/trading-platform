import type { FindOperator } from 'typeorm';

import type { PurchaseStatus } from '../enums/purchase.enum';

export class QueryPurchaseDto {
  id: Uuid;

  status: PurchaseStatus | FindOperator<number>;

  chainId: number;

  buyerId: Uuid;

  sellerId: Uuid;

  currencyId: Uuid;

  fiatCurrencyId: Uuid;
}
