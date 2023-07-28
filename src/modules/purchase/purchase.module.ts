import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PutOnSaleEntity } from '../put-on-sale/entities/put-on-sale.entity';
import { WalletEntity } from '../user/entities/wallet.entity';
import { PURCHASE_QUEUE } from './constants/purchase.const';
import { ProofTransferredMoneyEntity } from './entities/proof-transferred-money.entity';
import { PurchaseEntity } from './entities/purchase.entity';
import { PurchaseProcessor } from './processors/purchase.processor';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseQueue } from './queues/purchase.queue';

const queues = [PurchaseQueue];
const processors = [PurchaseProcessor];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseEntity,
      PutOnSaleEntity,
      WalletEntity,
      ProofTransferredMoneyEntity,
    ]),
    BullModule.registerQueue({
      name: PURCHASE_QUEUE,
    }),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, ...queues, ...processors],
  exports: [PurchaseService],
})
export class PurchaseModule {}
