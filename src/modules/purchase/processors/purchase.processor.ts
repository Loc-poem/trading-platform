import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { PURCHASE_QUEUE } from '../constants/purchase.const';
import { PurchaseJob } from '../enums/purchase.enum';
import { PurchaseQueue } from '../queues/purchase.queue';

@Processor(PURCHASE_QUEUE)
export class PurchaseProcessor {
  constructor(private purchaseQueue: PurchaseQueue) {}

  @Process(PurchaseJob.CheckStatus)
  checkStatusPurchase(job: Job) {
    return this.purchaseQueue.handleCheckStatusPurchase(job.data);
  }
}
