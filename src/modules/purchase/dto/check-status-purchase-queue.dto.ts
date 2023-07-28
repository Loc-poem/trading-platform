import type { PurchaseStatus } from '../enums/purchase.enum';

export class CheckStatusPurchaseQueueDto {
  id: Uuid;

  status: PurchaseStatus;
}
