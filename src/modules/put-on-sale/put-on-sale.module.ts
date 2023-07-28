import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceFeeTransactionEntity } from '../admin/entities/service-fee-transaction.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { FiatCurrencyEntity } from '../currency/entities/fiat-currency.entity';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PutOnSaleEntity } from './entities/put-on-sale.entity';
import { PutOnSaleTask } from './job/put-on-sale.task';
import { PutOnSaleController } from './put-on-sale.controller';
import { PutOnSaleService } from './put-on-sale.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PutOnSaleEntity,
      PaymentEntity,
      UserEntity,
      FiatCurrencyEntity,
      CurrencyEntity,
      PurchaseEntity,
      ServiceFeeTransactionEntity,
    ]),
  ],
  controllers: [PutOnSaleController],
  providers: [PutOnSaleService, PutOnSaleTask],
  exports: [PutOnSaleService],
})
export class PutOnSaleModule {}
