import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { Queue } from 'bull';
import * as console from 'console';
import { Repository } from 'typeorm';

import { PutOnSaleEntity } from '../../put-on-sale/entities/put-on-sale.entity';
import { PURCHASE_QUEUE } from '../constants/purchase.const';
import type { CheckStatusPurchaseQueueDto } from '../dto/check-status-purchase-queue.dto';
import { PurchaseEntity } from '../entities/purchase.entity';
import { PurchaseJob, PurchaseStatus } from '../enums/purchase.enum';

@Injectable()
export class PurchaseQueue {
  constructor(
    @InjectQueue(PURCHASE_QUEUE) private purchaseQueue: Queue,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(PutOnSaleEntity)
    private readonly putOnSaleRepository: Repository<PutOnSaleEntity>,
  ) {}

  async addCheckStatusPurchaseQueue(
    id: Uuid,
    delayTime: number,
    status: PurchaseStatus,
  ) {
    const job = await this.purchaseQueue.add(
      PurchaseJob.CheckStatus,
      {
        id,
        status,
      },
      {
        delay: delayTime,
        attempts: 10,
        backoff: 2000,
      },
    );
    console.log('##########', id);
    console.log('##########', status);
    console.log('##########', delayTime);

    await this.purchaseRepository.update(
      {
        id,
      },
      {
        currentJobId: job.id.toString(),
      },
    );
  }

  async handleCheckStatusPurchase(jobData: CheckStatusPurchaseQueueDto) {
    const purchaseData = await this.purchaseRepository.findOne({
      where: {
        id: jobData.id,
      },
      relations: ['putOnSale'],
      select: {
        id: true,
        status: true,
        buyAmount: true,
        putOnSale: {
          id: true,
          availableAmount: true,
        },
      },
    });

    if (!purchaseData || !purchaseData.putOnSale) {
      return false;
    }

    if (purchaseData.status === jobData.status) {
      const statusUpdate: PurchaseStatus = PurchaseStatus.BUYER_NOT_CONFIRM_PAY;
      await this.purchaseRepository.update(
        { id: purchaseData.id },
        { status: statusUpdate },
      );
      const refundAmount = new BigNumber(
        purchaseData.putOnSale.availableAmount || '0',
      )
        .plus(new BigNumber(purchaseData.buyAmount))
        .toString();
      await this.putOnSaleRepository.update(
        {
          id: purchaseData.putOnSale.id,
        },
        {
          availableAmount: refundAmount,
        },
      );
    }
  }
}
